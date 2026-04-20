export type RsvpStatus = "attending" | "maybe" | "declined" | "pending";
export type EventCategory = "Conference" | "Wedding" | "Birthday" | "Workshop" | "Meetup" | "Concert" | "Corporate" | "Other";

export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvp: RsvpStatus;
  invitedAt: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export interface BudgetItem {
  id: string;
  label: string;
  category: string;
  amount: number;
  createdAt: string;
}

export interface EventNote {
  id: string;
  content: string;
  createdAt: string;
}

export interface AppEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date
  time: string; // HH:mm
  venue: string;
  coverImage: string;
  category: EventCategory;
  capacity: number;
  budget: number;
  createdAt: string;
  guests: Guest[];
  checklist: ChecklistItem[];
  expenses: BudgetItem[];
  notes: EventNote[];
}

export interface Activity {
  id: string;
  type: "event_created" | "rsvp" | "task" | "expense" | "guest_added";
  message: string;
  eventId?: string;
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
}
