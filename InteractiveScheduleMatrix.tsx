import { useState, useEffect, FormEvent } from "react";
import { 
  Calendar, 
  Clock, 
  Check, 
  MapPin, 
  Video, 
  Loader2, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  ShieldAlert,
  User,
  LogOut,
  RefreshCw,
  Globe,
  Plus,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  googleSignIn, 
  initAuth, 
  logout, 
  fetchConflictingEvents, 
  createConsultationEvent,
  CalendarEvent
} from '../lib/googleCalendar';

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

const INDUSTRIES_LIST = [
  "Plumbing Services", "Electrical Services", "Health & Dental Studios", 
  "Salons & Beauté", "Automotive Outlets", "Restaurants & Hospitality", 
  "Property Cleaners", "Lawn & Landscaping", "Construction & Building", 
  "Roofing contractor", "HVAC Technical", "Mechanical Workshop", 
  "Lawyers & Legal Professionals", "Gyms & Personal Fitness", "Professional Painters"
];

const BOTTLENECKS_OPTIONS = [
  "Smart Website (Lead Capture & Conversion)",
  "Automated Workflows (Backend Logistics & Bottleneck)",
  "AI Agent Employee (24/7 Missed Call Safety Net)",
  "AI Strategy (Full Business Audit & Roadmap)"
];

const ENQUIRY_CHANNELS = [
  "Incoming phone calls manually answered",
  "WhatsApp chat responses (asynchronous)",
  "Email inbox leads processed late",
  "Instagram/Facebook Direct Messages",
  "No operational system — purely manual"
];

const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate.getTime() < today.getTime();
};

const isBlackoutDay = (date: Date): boolean => {
  const day = date.getDay();
  return day === 5 || day === 0; // Friday (5) or Sunday (0)
};

const isNextAvailableMonday = (date: Date, allDates: Date[]): boolean => {
  if (date.getDay() !== 1) return false;
  if (isDateInPast(date)) return false;
  if (isBlackoutDay(date)) return false;
  
  // Find the first operational, future Monday in our array
  const firstMonday = allDates.find(d => d.getDay() === 1 && !isDateInPast(d) && !isBlackoutDay(d));
  return firstMonday ? firstMonday.toDateString() === date.toDateString() : false;
};

export function InteractiveScheduleMatrix({ onCancel }: { onCancel?: () => void } = {}) {
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Scheduling states
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<'Meet' | 'In-Person'>('Meet');
  const [physicalAddress, setPhysicalAddress] = useState('');
  
  // Real check states
  const [busySlots, setBusySlots] = useState<string[]>([]);
  const [isLoadingBusy, setIsLoadingBusy] = useState(false);

  // Form intake data
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    location: "",
    phone: "",
    email: "",
    staff: "2–5",
    challenge: BOTTLENECKS_OPTIONS[0],
    leadSource: "Google search",
    responseMethod: ENQUIRY_CHANNELS[0],
    missedCalls: "Yes — regularly",
    desiredOutcome: "Faster response to enquiries"
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [successInfo, setSuccessInfo] = useState<any>(null);

  // Pre-populate date-picker list with valid days (Mon-Thu, Sat)
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    // Generate dates starting from 2 days ago to demonstrate past/disabled state
    const dates: Date[] = [];
    const current = new Date();
    current.setDate(current.getDate() - 2);
    
    // Generate 12 consecutive calendar days
    for (let i = 0; i < 12; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    setAvailableDates(dates);
    
    // Default select first available future non-blackout day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const defaultDate = dates.find(d => {
      const day = d.getDay();
      const inPast = d.getTime() < today.getTime();
      const blackout = day === 5 || day === 0;
      return !inPast && !blackout;
    });
    
    if (defaultDate) {
      setSelectedDate(defaultDate);
    } else {
      setSelectedDate(dates[2] || new Date());
    }
  }, []);

  // Listen to Google authentication status
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        setAuthError(null);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Query busy timeslots from connected Google Calendar on-demand
  useEffect(() => {
    if (!selectedDate || !googleToken) {
      setBusySlots([]);
      return;
    }

    const loadBusyTimes = async () => {
      setIsLoadingBusy(true);
      try {
        const dateStr = selectedDate.toISOString().split('T')[0];
        const events = await fetchConflictingEvents(dateStr, googleToken);
        
        // Parse events to block slots + strict 30m post-event buffer
        const blocked: string[] = [];
        
        events.forEach((evt: CalendarEvent) => {
          if (!evt.start.dateTime || !evt.end.dateTime) return;
          
          const start = new Date(evt.start.dateTime);
          const end = new Date(evt.end.dateTime);
          // Add 30 minutes buffer to end
          const endWithBuffer = new Date(end.getTime() + 30 * 60 * 1000);
          
          // Check which standard timeslots fall inside [start, endWithBuffer]
          TIME_SLOTS.forEach(slot => {
            const [hours, minutes] = slot.split(':').map(Number);
            const slotDate = new Date(selectedDate);
            slotDate.setHours(hours, minutes, 0, 0);
            
            if (slotDate >= start && slotDate < endWithBuffer) {
              blocked.push(slot);
            }
          });
        });

        // Set simulated/factual busy slots
        setBusySlots(Array.from(new Set(blocked)));
      } catch (err: any) {
        console.error("Error evaluating conflicts: ", err);
        // Fallback to empty/simulated blockages
        setBusySlots(["11:30", "14:00"]);
      } finally {
        setIsLoadingBusy(false);
      }
    };

    loadBusyTimes();
  }, [selectedDate, googleToken]);

  const handleConnectCalendar = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const authResult = await googleSignIn();
      if (authResult) {
        setGoogleUser(authResult.user);
        setGoogleToken(authResult.accessToken);
      }
    } catch (err: any) {
      setAuthError(err.message || "Consent screen declined or connection closed.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisconnect = async () => {
    await logout();
    setGoogleUser(null);
    setGoogleToken(null);
    setSelectedTimeSlot(null);
  };

  const handleFormChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (formErrors[key]) {
      setFormErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  const handleBookConsultation = async (e: FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    
    if (!formData.businessName.trim()) errors.businessName = "Required";
    if (!formData.businessType) errors.businessType = "Required";
    if (!formData.location.trim()) errors.location = "Required";
    if (!formData.phone.trim()) errors.phone = "Required";
    if (!formData.email.trim()) errors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid format";
    
    if (locationType === 'In-Person' && !physicalAddress.trim()) {
      errors.physicalAddress = "Target delivery address mandatory";
    }

    if (!selectedTimeSlot) {
      errors.timeSlot = "Select a valid 30m appointment slot from the grid";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmittingBooking(true);
    try {
      // Formulate starting Date object
      const [hours, minutes] = (selectedTimeSlot || "10:00").split(':').map(Number);
      const startDateTime = new Date(selectedDate!);
      startDateTime.setHours(hours, minutes, 0, 0);

      const consultationDetails = {
        businessName: formData.businessName,
        businessType: formData.businessType,
        location: formData.location,
        locationType,
        physicalAddress,
        staff: formData.staff,
        challenge: formData.challenge,
        leadSource: formData.leadSource,
        responseMethod: formData.responseMethod,
        missedCalls: formData.missedCalls,
        phone: formData.phone,
        email: formData.email,
        desiredOutcome: formData.desiredOutcome,
        dateTime: startDateTime.toISOString()
      };

      let bookingResponse = null;

      // Submit to Google Calendar if Token active
      if (googleToken) {
        bookingResponse = await createConsultationEvent(consultationDetails, googleToken);
      } else {
        // Simulated booking response
        bookingResponse = {
          eventId: `sim-evt-${Date.now()}`,
          htmlLink: '#',
          meetUrl: locationType === 'Meet' ? 'https://meet.google.com/xyz-abc-123' : physicalAddress,
          status: 'simulated-offline'
        };
      }

      // Add audit details to Firestore Database
      await addDoc(collection(db, 'consultations'), {
        ...consultationDetails,
        ...bookingResponse,
        createdTime: serverTimestamp()
      });

      // Clear selection upon absolute success
      setSuccessInfo({
        ...consultationDetails,
        ...bookingResponse,
        formattedDate: selectedDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        formattedTime: selectedTimeSlot
      });

    } catch (err: any) {
      console.error(err);
      setFormErrors({ general: err.message || "Synchronization failure. Try again." });
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleRestart = () => {
    setSuccessInfo(null);
    setSelectedTimeSlot(null);
    setFormData({
      businessName: "",
      businessType: "",
      location: "",
      phone: "",
      email: "",
      staff: "2–5",
      challenge: BOTTLENECKS_OPTIONS[0],
      leadSource: "Google search",
      responseMethod: ENQUIRY_CHANNELS[0],
      missedCalls: "Yes — regularly",
      desiredOutcome: "Faster response to enquiries"
    });
    setPhysicalAddress('');
    setFormErrors({});
  };

  const isSlotMathematicallyImpossible = (slot: string, date: Date | null): boolean => {
    if (!date) return false;
    const [hours, minutes] = slot.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    
    // Strict 17:30 cutoff. Since a consultation is 30m, any slot starting at 17:30 or later ends >= 18:00.
    if (totalMinutes >= 1050) {
      return true;
    }
    
    // If selected date is today, check if slot target time has already passed
    const now = new Date();
    const isToday = now.toDateString() === date.toDateString();
    if (isToday) {
      const slotTime = new Date(date);
      slotTime.setHours(hours, minutes, 0, 0);
      if (slotTime.getTime() <= now.getTime()) {
        return true;
      }
    }
    
    return false;
  };

  const availableSlotsForSelectedDate = TIME_SLOTS.filter(slot => {
    const isBusy = busySlots.includes(slot);
    const isImpossible = isSlotMathematicallyImpossible(slot, selectedDate);
    return !isBusy && !isImpossible;
  });

  const hasNoSlots = availableSlotsForSelectedDate.length === 0;

  // Human descriptive text for target calendar options
  const selectedDateLabel = selectedDate ? selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }) : "";

  return (
    <div className="w-full relative" id="schedule-matrix-module">
      <AnimatePresence mode="wait">
        {!successInfo ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {onCancel && (
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-tertiary)] animate-pulse" />
                  <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest font-bold">Secure Booking Sandbox</span>
                </div>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex items-center gap-2 px-3.5 py-2 bg-[#141414] hover:bg-orange-500/10 border border-[rgba(255,255,255,0.06)] hover:border-[var(--color-tertiary)] rounded-xl text-xs font-mono text-[var(--color-muted)] hover:text-white transition-all duration-300 group cursor-pointer"
                >
                  <span className="text-sm font-semibold text-[var(--color-tertiary)] group-hover:scale-110 transition-transform">✕</span>
                  <span>Exit Session</span>
                </button>
              </div>
            )}

            {/* Calendar Connection Banner */}
            <div className="mb-10 p-6 bg-[#111] border border-[rgba(255,255,255,0.06)] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.1),transparent_70%)] pointer-events-none" />
              
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full border flex items-center justify-center shrink-0 ${googleUser ? "bg-[rgba(34,197,94,0.08)] border-[rgba(34,197,94,0.2)] text-[var(--color-success)]" : "bg-[rgba(249,115,22,0.05)] border-[rgba(249,115,22,0.15)] text-[var(--color-tertiary)]"}`}>
                  <Calendar className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-display text-lg text-white font-medium flex items-center gap-2">
                    {googleUser ? (
                      <>
                        <span>Google Calendar Synchronized</span>
                        <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                      </>
                    ) : (
                      "Connect Google Calendar"
                    )}
                  </h4>
                  <p className="font-body text-xs text-[var(--color-muted)] max-w-md mt-1 leading-relaxed">
                    {googleUser ? (
                      `Active session for: ${googleUser.email || "Authorized operator"}. Booking prevents busy slot overlaps directly on your schedule.`
                    ) : (
                      "Authorize connection to active calendars. We'll cross-reference busy slots dynamically and write the reservation into your schedule instantly."
                    )}
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                {googleUser ? (
                  <button
                    onClick={handleDisconnect}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[rgba(255,100,100,0.1)] hover:bg-[rgba(255,100,100,0.2)] border border-[rgba(255,100,100,0.2)] hover:border-red-500 text-red-400 text-xs font-mono uppercase tracking-widest transition-all duration-300"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <button
                    onClick={handleConnectCalendar}
                    disabled={isAuthenticating}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[var(--color-tertiary)] hover:bg-[#e64a19] text-black font-semibold text-xs font-mono uppercase tracking-widest transition-all duration-300 relative shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_25px_rgba(249,115,22,0.35)] cursor-pointer"
                  >
                    {isAuthenticating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Synchronizing...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5" />
                        <span>Link Google Calendar</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {authError && (
              <div className="mb-6 p-4 bg-red-950/30 border border-red-500/20 text-red-400 text-xs rounded-lg flex items-start gap-2.5 animate-in fade-in-50">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleBookConsultation} className="space-y-10">
              {/* Date & Time Selection Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Available Audit Days (Column Left) */}
                <div className="lg:col-span-4 bg-[#0d0d0d] border border-[rgba(255,255,255,0.05)] p-5 rounded-2xl">
                  <span className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest mb-4">01/ SELECT BUSINESS DAY</span>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {availableDates.map((date, idx) => {
                      const isSelected = selectedDate?.toDateString() === date.toDateString();
                      const inPast = isDateInPast(date);
                      const isBlackout = isBlackoutDay(date);
                      const isMondayHighlight = isNextAvailableMonday(date, availableDates);
                      const isDisabled = inPast || isBlackout;

                      const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
                      const dayNumber = date.getDate();
                      const month = date.toLocaleDateString('en-US', { month: 'short' });
                      const year = date.getFullYear();

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => { 
                            if (!isDisabled) {
                              setSelectedDate(date); 
                              setSelectedTimeSlot(null); 
                            }
                          }}
                          className={`w-full flex flex-col p-3.5 rounded-xl border text-left transition-all duration-300 relative overflow-hidden ${
                            isDisabled 
                              ? "bg-[#0c0c0c] border-[rgba(255,255,255,0.02)] text-[var(--color-muted-dark)] opacity-40 cursor-not-allowed" 
                              : isSelected 
                                ? "bg-[rgba(249,115,22,0.12)] border-[var(--color-tertiary)] text-white shadow-[0_0_20px_rgba(249,115,22,0.2)]" 
                                : isMondayHighlight
                                  ? "bg-[rgba(249,115,22,0.04)] border-[rgba(249,115,22,0.4)] text-[var(--color-tertiary)] shadow-[0_0_14px_rgba(249,115,22,0.15)] hover:border-[var(--color-tertiary)] hover:bg-[rgba(249,115,22,0.08)] animate-pulse"
                                  : "bg-[#141414] border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.15)] text-[var(--color-muted)]"
                          }`}
                        >
                          {isMondayHighlight && (
                            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[var(--color-tertiary)] text-black text-[7px] font-mono uppercase tracking-widest font-bold rounded">
                              Next Priority
                            </div>
                          )}

                          <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col">
                              <span className={`font-display text-sm font-medium ${isMondayHighlight && !isSelected ? "text-[var(--color-tertiary)]" : ""}`}>
                                {weekday}
                              </span>
                              <span className="text-[10px] font-mono text-[var(--color-muted-dark)] mt-0.5">{month} {dayNumber}, {year}</span>
                            </div>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-tertiary)] shrink-0 ml-2" />}
                            {inPast && (
                              <span className="text-[8px] font-mono bg-red-950/20 text-red-400 border border-red-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 origin-right">
                                Passed
                              </span>
                            )}
                            {isBlackout && !inPast && (
                              <span className="text-[8px] font-mono bg-zinc-950/20 text-zinc-500 border border-zinc-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider scale-90 origin-right">
                                Blackout
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <span className="block text-[9px] font-mono text-[var(--color-muted-dark)] mt-4 text-center">Blackouts active: Fridays & Sundays locked.</span>
                </div>

                {/* Available Slots (Column Center-Right) */}
                <div className="lg:col-span-8 bg-[#0d0d0d] border border-[rgba(255,255,255,0.05)] p-5 rounded-2xl relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">
                      02/ INTUITIVE SLOT MATRIX • {selectedDateLabel}
                    </span>
                    {isLoadingBusy && (
                      <span className="text-[9px] font-mono text-[var(--color-tertiary)] bg-orange-950/20 px-2 py-0.5 rounded border border-orange-500/20 flex items-center gap-1.5 animate-pulse">
                        <RefreshCw className="w-2.5 h-2.5 animate-spin" /> Checking Sync
                      </span>
                    )}
                  </div>

                  {hasNoSlots ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.01)] rounded-2xl text-center">
                      <AlertCircle className="w-10 h-10 text-[var(--color-tertiary)] mb-3 animate-pulse" />
                      <h4 className="font-display text-sm text-white font-medium mb-1">No Available Time Slots</h4>
                      <p className="font-body text-xs text-[var(--color-muted)] max-w-sm leading-relaxed">
                        All booking windows for {selectedDateLabel} are fully reserved, have passed, or exceed the 17:30 operational cutoff. Please explore a different business date from the left matrix.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 md:gap-3">
                      {TIME_SLOTS.map((slot) => {
                        const isBusy = busySlots.includes(slot);
                        const isImpossible = isSlotMathematicallyImpossible(slot, selectedDate);
                        const isSelected = selectedTimeSlot === slot;
                        
                        const [hours, minutes] = slot.split(':').map(Number);
                        const isAfterHoursSlot = (hours * 60 + minutes) >= 1050; // 17:30 or later
                        
                        const isDisabled = isBusy || isImpossible;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`relative p-3 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 min-h-[56px] select-none ${
                              isDisabled
                                ? "bg-[#111]/40 border-dashed border-[rgba(255,255,255,0.02)] text-[var(--color-muted-dark)] cursor-not-allowed opacity-30"
                                : isSelected
                                  ? "bg-[var(--color-tertiary)] border-[var(--color-tertiary)] text-black font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                                  : "bg-[#141414] border-[rgba(255,255,255,0.04)] hover:border-[var(--color-tertiary)] text-white hover:bg-[rgba(249,115,22,0.02)]"
                            }`}
                          >
                            <span className="font-mono text-xs">{slot}</span>
                            <span className="text-[7px] font-mono uppercase tracking-wider mt-1 opacity-60 text-center">
                              {isBusy 
                                ? "Reserved" 
                                : isAfterHoursSlot 
                                  ? "After-hours" 
                                  : isImpossible 
                                    ? "Passed" 
                                    : isSelected 
                                      ? "Selected" 
                                      : "Available"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {formErrors.timeSlot && (
                    <p className="mt-3 text-xs text-red-400 flex items-center gap-1.5 animate-bounce">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {formErrors.timeSlot}
                    </p>
                  )}

                  {/* Operational parameters note */}
                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-mono text-[var(--color-muted-dark)]">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[var(--color-tertiary)]" /> Duration: 30 minutes</span>
                    <span className="flex items-center gap-1.5"><Plus className="w-3.5 h-3.5 text-[var(--color-tertiary)]" /> Buffer: Strict 30m diagnostice blackout</span>
                  </div>
                </div>

              </div>

              {/* Stark Mandatory Questionnaire Array */}
              <div className="bg-[#0c0c0c] border border-[rgba(255,255,255,0.05)] rounded-2xl p-6 sm:p-8 space-y-8">
                <div>
                  <h3 className="font-display text-xl text-white font-semibold">Strategic Revenue Audit Intake Data</h3>
                  <p className="font-body text-xs text-[var(--color-muted)] mt-1.5 max-w-lg leading-relaxed">
                    Provide precise parameters. We do not sell time; we target structural lead-capture and missed revenue bottlenecks.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Business Name */}
                  <div>
                    <label htmlFor="comp-businessName" className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2.5">Business / Enterprise Name *</label>
                    <input 
                      id="comp-businessName" 
                      type="text" 
                      placeholder="e.g. Cape Town Automotive Group" 
                      className={`input-field min-h-[44px] ${formErrors.businessName ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : ''}`}
                      value={formData.businessName} 
                      onChange={(e) => handleFormChange('businessName', e.target.value)} 
                    />
                    {formErrors.businessName && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.businessName}</span>}
                  </div>

                  {/* Business Category */}
                  <div>
                    <label htmlFor="comp-businessType" className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2.5">Business Operational Sector *</label>
                    <select 
                      id="comp-businessType" 
                      className={`input-field min-h-[44px] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YzlhOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[position:right_1rem_center] ${formErrors.businessType ? 'border-red-500/50' : ''}`}
                      value={formData.businessType} 
                      onChange={(e) => handleFormChange('businessType', e.target.value)}
                    >
                      <option value="" disabled className="text-black">Select active industry sector...</option>
                      {INDUSTRIES_LIST.map(category => (
                        <option key={category} value={category} className="text-black">{category}</option>
                      ))}
                    </select>
                    {formErrors.businessType && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.businessType}</span>}
                  </div>

                  {/* City/Town Location */}
                  <div>
                    <label htmlFor="comp-location" className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2.5">Corporate Headquarters City *</label>
                    <input 
                      id="comp-location" 
                      type="text" 
                      placeholder="e.g. Cape Town, Southern Suburbs" 
                      className={`input-field min-h-[44px] ${formErrors.location ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : ''}`}
                      value={formData.location} 
                      onChange={(e) => handleFormChange('location', e.target.value)} 
                    />
                    {formErrors.location && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.location}</span>}
                  </div>

                  {/* Team Size */}
                  <div>
                    <label className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2.5">Operational Team Scale</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['Just me', '2–5', '6–15', '15+'].map((opt) => (
                        <label key={opt} className={`relative flex items-center justify-center p-2 rounded-lg bg-[#141414] border transition-all duration-300 cursor-pointer min-h-[44px] ${formData.staff === opt ? 'border-[var(--color-tertiary)] text-[var(--color-tertiary)] bg-[rgba(249,115,22,0.03)] font-bold' : 'border-[rgba(255,255,255,0.04)] text-[var(--color-muted)] hover:border-[rgba(255,255,255,0.1)] hover:bg-[#181818]'}`}>
                          <input type="radio" value={opt} checked={formData.staff === opt} onChange={(e) => handleFormChange('staff', e.target.value)} className="sr-only" />
                          <span className="font-body text-xs">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Primary Target Bottleneck */}
                  <div>
                    <label htmlFor="comp-challenge" className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2.5">Primary Diagnostic Bottleneck *</label>
                    <select 
                      id="comp-challenge" 
                      className="input-field min-h-[44px] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YzlhOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[position:right_1rem_center]"
                      value={formData.challenge} 
                      onChange={(e) => handleFormChange('challenge', e.target.value)}
                    >
                      {BOTTLENECKS_OPTIONS.map(opt => (
                        <option key={opt} value={opt} className="text-black">{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Outgoing Outreach Lead Source */}
                  <div>
                    <label htmlFor="comp-leadSource" className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2.5">Primary Enquiries Channels / Sources</label>
                    <input 
                      id="comp-leadSource" 
                      type="text" 
                      placeholder="e.g. Google Maps, Referrals, Meta Lead Ads" 
                      className="input-field min-h-[44px]"
                      value={formData.leadSource} 
                      onChange={(e) => handleFormChange('leadSource', e.target.value)} 
                    />
                  </div>

                  {/* Incoming Handling Style */}
                  <div>
                    <label htmlFor="comp-responseMethod" className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2.5">Current Incoming Lead Response style *</label>
                    <select 
                      id="comp-responseMethod" 
                      className="input-field min-h-[44px] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YzlhOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[position:right_1rem_center]"
                      value={formData.responseMethod} 
                      onChange={(e) => handleFormChange('responseMethod', e.target.value)}
                    >
                      {ENQUIRY_CHANNELS.map(opt => (
                        <option key={opt} value={opt} className="text-black">{opt}</option>
                      ))}
                    </select>
                  </div>

                  {/* Yes regularly missing */}
                  <div>
                    <label className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2.5">Encountering Missed Leads / Unanswered Calls?</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Yes — regularly', 'Sometimes', 'Rarely'].map((opt) => (
                        <label key={opt} className={`relative flex items-center justify-center p-2 rounded-lg bg-[#141414] border transition-all duration-300 cursor-pointer min-h-[44px] ${formData.missedCalls === opt ? 'border-[var(--color-tertiary)] text-[var(--color-tertiary)] bg-[rgba(249,115,22,0.03)] font-bold' : 'border-[rgba(255,255,255,0.04)] text-[var(--color-muted)] hover:border-[rgba(255,255,255,0.1)] hover:bg-[#181818]'}`}>
                          <input type="radio" value={opt} checked={formData.missedCalls === opt} onChange={(e) => handleFormChange('missedCalls', e.target.value)} className="sr-only" />
                          <span className="font-body text-xs text-center">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div>
                    <label htmlFor="comp-phone" className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2.5">Mobile Number (WhatsApp Integration Key) *</label>
                    <input 
                      id="comp-phone" 
                      type="tel" 
                      placeholder="e.g. +27 82 123 4567" 
                      className={`input-field min-h-[44px] ${formErrors.phone ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : ''}`}
                      value={formData.phone} 
                      onChange={(e) => handleFormChange('phone', e.target.value)} 
                    />
                    {formErrors.phone && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.phone}</span>}
                  </div>

                  <div>
                    <label htmlFor="comp-email" className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2.5">Corporate / Authorized Signee Email *</label>
                    <input 
                      id="comp-email" 
                      type="email" 
                      placeholder="e.g. director@caperegion.co.za" 
                      className={`input-field min-h-[44px] ${formErrors.email ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : ''}`}
                      value={formData.email} 
                      onChange={(e) => handleFormChange('email', e.target.value)} 
                    />
                    {formErrors.email && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.email}</span>}
                  </div>

                </div>

                {/* Location Logic (Hard constraint: Meet vs In-Person) */}
                <div className="pt-6 border-t border-[rgba(255,255,255,0.03)] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="block font-mono text-[10px] text-white uppercase tracking-wider font-bold">Location Dispatch Protocol</span>
                      <p className="font-body text-xs text-[var(--color-muted)] mt-1">Specify whether our diagnostics will occur over secure virtual videoconferencing or physical on-site exploration.</p>
                    </div>
                    <div className="flex gap-2 bg-[#141414] p-1 border border-[rgba(255,255,255,0.05)] rounded-xl shrink-0">
                      <button
                        type="button"
                        onClick={() => setLocationType('Meet')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all ${locationType === 'Meet' ? "bg-[var(--color-tertiary)] text-black font-semibold" : "text-[var(--color-muted)] hover:text-white"}`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Google Meet</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocationType('In-Person')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all ${locationType === 'In-Person' ? "bg-[var(--color-tertiary)] text-black font-semibold" : "text-[var(--color-muted)] hover:text-white"}`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>In-Person Site Audit</span>
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {locationType === 'In-Person' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2">
                          <label htmlFor="comp-address" className="block font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider mb-2">Corporate Physical Site Address *</label>
                          <input 
                            id="comp-address"
                            required
                            type="text" 
                            placeholder="e.g. Ground Floor, West Wing, 54 Buitengracht Street, Cape Town CBD" 
                            className={`input-field min-h-[44px] ${formErrors.physicalAddress ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]' : ''}`}
                            value={physicalAddress}
                            onChange={(e) => { setPhysicalAddress(e.target.value); if(formErrors.physicalAddress) setFormErrors(prev => ({...prev, physicalAddress: ""})); }}
                          />
                          {formErrors.physicalAddress && <span className="text-[10px] text-red-400 mt-1 block font-mono">{formErrors.physicalAddress}</span>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Submit & Error Messages */}
              <div className="flex flex-col items-center justify-center gap-4">
                {formErrors.general && (
                  <div className="p-4 bg-red-950/30 border border-red-500/25 text-red-400 text-xs rounded-lg flex items-center gap-2 max-w-lg">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{formErrors.general}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="w-full max-w-sm flex items-center justify-center gap-2 px-6 py-4 bg-[var(--color-tertiary)] hover:bg-[#e64a19] text-black font-bold text-sm font-mono uppercase tracking-widest transition-all duration-300 relative shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.45)] cursor-pointer"
                >
                  {isSubmittingBooking ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Payload...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Book Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        ) : (
          /* Absolute high-end confirmation dashboard success state */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] p-8 sm:p-12 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
            
            <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
              
              <div className="w-20 h-20 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.25)] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                <Check className="w-10 h-10 text-[var(--color-success)]" strokeWidth={2.5} />
              </div>

              <span className="font-mono text-[10px] text-[var(--color-tertiary)] uppercase tracking-widest font-bold mb-2">Audit Transmission Secured</span>
              <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">Consultation Registered.</h2>
              <p className="font-body text-sm text-[var(--color-muted)] mb-8 leading-relaxed">
                Strategic Revenue pre-audit sequence has successfully initialized and synchronized to active enterprise registries. Here are your diagnostic booking records:
              </p>

              {/* Data Summary Dashboard */}
              <div className="w-full bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6 mb-8 text-left space-y-4">
                <h4 className="font-mono text-[10px] uppercase tracking-widest text-white border-b border-[rgba(255,255,255,0.05)] pb-3">Session Specification Grid</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
                  <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Appointment Type</span>
                    <span className="text-white font-medium">Strategic Revenue Consultation</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Date & Duration</span>
                    <span className="text-white font-medium">{successInfo.formattedDate} (30 mins)</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Exact Start Time (SAST)</span>
                    <span className="text-[var(--color-tertiary)] font-bold">{successInfo.formattedTime}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[var(--color-muted-dark)] font-mono text(--10px) uppercase tracking-wider">Integration Status</span>
                    <span className={`inline-flex items-center gap-1.5 ${successInfo.status === 'booked' ? 'text-[var(--color-success)]' : 'text-orange-400'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${successInfo.status === 'booked' ? 'bg-[var(--color-success)]' : 'bg-orange-400'}`} />
                      {successInfo.status === 'booked' ? 'Google Calendar Confirmed' : 'Offline Simulated Slot Enqueued'}
                    </span>
                  </div>

                  {successInfo.locationType === 'Meet' ? (
                    <div className="flex flex-col gap-1 sm:col-span-2 pt-2 border-t border-[rgba(255,255,255,0.03)]">
                      <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Google Meet Link (Secure Space)</span>
                      <a 
                        href={successInfo.meetUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[var(--color-tertiary)] hover:underline flex items-center gap-1 font-mono break-all text-[11px] mt-0.5"
                      >
                        <Video className="w-3.5 h-3.5 shrink-0" />
                        <span>{successInfo.meetUrl}</span>
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 sm:col-span-2 pt-2 border-t border-[rgba(255,255,255,0.03)]">
                      <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Dispatch Site Address</span>
                      <span className="text-white flex items-center gap-1.5 mt-0.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[var(--color-tertiary)] shrink-0" />
                        <span>{successInfo.physicalAddress}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Protocol info */}
              <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-xl text-left text-xs text-[var(--color-muted)] mb-8 leading-relaxed flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[var(--color-tertiary)] shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-semibold mb-1">WhatsApp confirmation queued (T+0s Flow):</span>
                  Our automated outreach protocol triggers instant status signals to <span className="text-white font-bold">{successInfo.phone}</span>. Please verify your messaging app is active to receive pre-audit guidelines.
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-6 py-3 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] hover:border-white text-white text-xs font-mono uppercase tracking-widest transition-all duration-300 pointer-events-auto cursor-pointer"
                >
                  <span>Book Another Audit</span>
                </button>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="flex items-center gap-2 px-6 py-3 bg-[rgba(249,115,22,0.1)] hover:bg-[rgba(249,115,22,0.18)] border border-[rgba(249,115,22,0.25)] hover:border-[var(--color-tertiary)] text-[var(--color-tertiary)] hover:text-white text-xs font-mono uppercase tracking-widest transition-all duration-300 pointer-events-auto cursor-pointer"
                  >
                    <span>Return to Dashboard</span>
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
