import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut
} from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar.events');
provider.addScope('https://www.googleapis.com/auth/calendar.readonly');

// Use local storage to persist access token for the active session safely, or just keep in memory.
// Keeping it in-memory as mandated by standard secure protocols, but we can set up a listener.
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // We have a user but no access token cached because of page refresh. 
        // We will need them to re-click Connect or use the sign-in popup to refresh credentials.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const isGoogleSigningIn = (): boolean => {
  return isSigningIn;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Interface for fetching and parsing calendar events on a given day to check slot overlaps.
export interface CalendarEvent {
  id: string;
  summary?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}

export async function fetchConflictingEvents(dateStr: string, token: string): Promise<CalendarEvent[]> {
  const startOfDay = `${dateStr}T00:00:00Z`;
  const endOfDay = `${dateStr}T23:59:59Z`;
  
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(startOfDay)}&timeMax=${encodeURIComponent(endOfDay)}&singleEvents=true&orderBy=startTime`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Google Calendar API Error: ${response.status} - ${errorDetails}`);
  }
  
  const data = await response.json();
  return data.items || [];
}

export interface ConsultationDetails {
  businessName: string;
  businessType: string;
  location: string;
  locationType: 'Meet' | 'In-Person';
  physicalAddress?: string;
  staff: string;
  challenge: string;
  leadSource: string;
  responseMethod: string;
  missedCalls: string;
  phone: string;
  email: string;
  desiredOutcome: string;
  dateTime: string; // ISO string representation
}

export async function createConsultationEvent(details: ConsultationDetails, token: string): Promise<any> {
  const startDateTime = new Date(details.dateTime);
  const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000); // 30 mins later
  
  const formattedStart = startDateTime.toISOString();
  const formattedEnd = endDateTime.toISOString();
  
  const calendarEventBody: any = {
    summary: `Strategic Revenue Consultation - ${details.businessName}`,
    description: `
LAIS STRATEGIC REVENUE AUDIT & CONSULTATION
==========================================
Client Business Name: ${details.businessName}
Business Type: ${details.businessType}
Staff Size: ${details.staff}
WhatsApp Number: ${details.phone}
Primary Bottleneck: ${details.challenge}
Lead Acquisition Source: ${details.leadSource}
Current Operations Handler: ${details.responseMethod}
Misses Leads/Calls: ${details.missedCalls}
Ultimate Success Target: ${details.desiredOutcome}

Location Mode: ${details.locationType === 'Meet' ? 'Google Meet (Interactive Video Link)' : 'In-Person Business Site Inspection'}
${details.locationType === 'In-Person' ? `Inspected Address: ${details.physicalAddress}` : ''}

------------------------------------------
AUTOMATION GATEWAY INITIATED
* A WhatsApp stateful booking confirmation has been enqueued to: ${details.phone}
* Fridays / Sundays are off-limits blackout days.
* A strict 30-minute logging and diagnosis buffer has been scheduled after this consultation.
    `.trim(),
    start: {
      dateTime: formattedStart,
      timeZone: 'Africa/Johannesburg' // Default TZ
    },
    end: {
      dateTime: formattedEnd,
      timeZone: 'Africa/Johannesburg'
    },
    attendees: [
      { email: details.email }
    ],
    // If meet is selected, make location Google Meet, else use business address
    location: details.locationType === 'Meet' ? 'Google Meet' : details.physicalAddress || details.location || 'Client Location',
  };

  if (details.locationType === 'Meet') {
    calendarEventBody.conferenceData = {
      createRequest: {
        requestId: `lais-meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet'
        }
      }
    };
  }

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(calendarEventBody)
  });
  
  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Failed to insert consultation event: ${response.status} - ${errorDetails}`);
  }
  
  const createdEvent = await response.json();
  
  // Extract Meet URL if available
  let meetUrl = '';
  if (createdEvent.conferenceData && createdEvent.conferenceData.entryPoints) {
    const meetEntryPoint = createdEvent.conferenceData.entryPoints.find((ep: any) => ep.entryPointType === 'video');
    if (meetEntryPoint) {
      meetUrl = meetEntryPoint.uri;
    }
  }
  
  return {
    eventId: createdEvent.id,
    htmlLink: createdEvent.htmlLink,
    meetUrl: meetUrl || createdEvent.location,
    status: 'booked'
  };
}
