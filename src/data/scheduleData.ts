export const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"
];

export const INDUSTRIES_LIST = [
  "Plumbing Services", "Electrical Services", "Health & Dental Studios", 
  "Salons & Beauté", "Automotive Outlets", "Restaurants & Hospitality", 
  "Property Cleaners", "Lawn & Landscaping", "Construction & Building", 
  "Roofing contractor", "HVAC Technical", "Mechanical Workshop", 
  "Lawyers & Legal Professionals", "Gyms & Personal Fitness", "Professional Painters"
];

export const BOTTLENECKS_OPTIONS = [
  "Smart Website (Lead Capture & Conversion)",
  "Automated Workflows (Backend Logistics & Bottleneck)",
  "AI Agent Employee (24/7 Missed Call Safety Net)",
  "AI Strategy (Full Business Audit & Roadmap)"
];

export const ENQUIRY_CHANNELS = [
  "Incoming phone calls manually answered",
  "WhatsApp chat responses (asynchronous)",
  "Email inbox leads processed late",
  "Instagram/Facebook Direct Messages",
  "No operational system — purely manual"
];

export const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

export const getNext30Days = (): Date[] => {
  const days: Date[] = [];
  const current = new Date();
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(current.getDate() + i);
    days.push(d);
  }
  return days;
};

export const isBlackoutDay = (date: Date): boolean => {
  const day = date.getDay();
  return day === 5 || day === 0; // Friday (5) or Sunday (0)
};

export const isNextAvailableMonday = (date: Date, allDates: Date[]): boolean => {
  if (date.getDay() !== 1) return false;
  if (isDateInPast(date)) return false;
  if (isBlackoutDay(date)) return false;
  
  // Find the first operational, future Monday in our array
  const firstMonday = allDates.find(d => d.getDay() === 1 && !isDateInPast(d) && !isBlackoutDay(d));
  return firstMonday ? firstMonday.toDateString() === date.toDateString() : false;
};

export interface ScheduleSuccessInfo {
  formattedDate: string;
  formattedTime: string;
  locationType: 'Meet' | 'Physical';
  meetUrl?: string;
  physicalAddress?: string;
  phone: string;
  businessName: string;
  status: 'booked' | 'simulated';
}
