import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppEvent, Activity, User, Guest, ChecklistItem, BudgetItem, EventNote, RsvpStatus } from "./types";
import { seedEvents } from "./seed";

const uid = () => Math.random().toString(36).slice(2, 11);

interface State {
  user: User | null;
  events: AppEvent[];
  activity: Activity[];
  hydrated: boolean;

  login: (email: string, name?: string) => void;
  logout: () => void;

  addEvent: (e: Omit<AppEvent, "id" | "createdAt" | "guests" | "checklist" | "expenses" | "notes">) => string;
  updateEvent: (id: string, patch: Partial<AppEvent>) => void;
  deleteEvent: (id: string) => void;

  addGuest: (eventId: string, g: Omit<Guest, "id" | "invitedAt">) => void;
  setRsvp: (eventId: string, guestId: string, status: RsvpStatus) => void;
  removeGuest: (eventId: string, guestId: string) => void;

  addTask: (eventId: string, text: string) => void;
  toggleTask: (eventId: string, taskId: string) => void;
  removeTask: (eventId: string, taskId: string) => void;

  addExpense: (eventId: string, e: Omit<BudgetItem, "id" | "createdAt">) => void;
  removeExpense: (eventId: string, expenseId: string) => void;

  addNote: (eventId: string, content: string) => void;
  removeNote: (eventId: string, noteId: string) => void;

  pushActivity: (a: Omit<Activity, "id" | "createdAt">) => void;
  resetSeed: () => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      events: [],
      activity: [],
      hydrated: false,

      login: (email, name) =>
        set({ user: { email, name: name || email.split("@")[0] } }),
      logout: () => set({ user: null }),

      addEvent: (e) => {
        const id = uid();
        const ev: AppEvent = {
          ...e,
          id,
          createdAt: new Date().toISOString(),
          guests: [],
          checklist: [],
          expenses: [],
          notes: [],
        };
        set((s) => ({ events: [ev, ...s.events] }));
        get().pushActivity({ type: "event_created", message: `Created event "${e.title}"`, eventId: id });
        return id;
      },
      updateEvent: (id, patch) =>
        set((s) => ({ events: s.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),
      deleteEvent: (id) =>
        set((s) => ({ events: s.events.filter((e) => e.id !== id) })),

      addGuest: (eventId, g) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId
              ? { ...e, guests: [...e.guests, { ...g, id: uid(), invitedAt: new Date().toISOString() }] }
              : e
          ),
        })),
      setRsvp: (eventId, guestId, status) => {
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId
              ? { ...e, guests: e.guests.map((g) => (g.id === guestId ? { ...g, rsvp: status } : g)) }
              : e
          ),
        }));
        const ev = get().events.find((x) => x.id === eventId);
        const guest = ev?.guests.find((g) => g.id === guestId);
        if (guest) get().pushActivity({ type: "rsvp", message: `${guest.name} marked ${status} for "${ev!.title}"`, eventId });
      },
      removeGuest: (eventId, guestId) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId ? { ...e, guests: e.guests.filter((g) => g.id !== guestId) } : e
          ),
        })),

      addTask: (eventId, text) => {
        const item: ChecklistItem = { id: uid(), text, done: false, createdAt: new Date().toISOString() };
        set((s) => ({
          events: s.events.map((e) => (e.id === eventId ? { ...e, checklist: [...e.checklist, item] } : e)),
        }));
      },
      toggleTask: (eventId, taskId) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId
              ? { ...e, checklist: e.checklist.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
              : e
          ),
        })),
      removeTask: (eventId, taskId) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId ? { ...e, checklist: e.checklist.filter((t) => t.id !== taskId) } : e
          ),
        })),

      addExpense: (eventId, e) => {
        const item: BudgetItem = { ...e, id: uid(), createdAt: new Date().toISOString() };
        set((s) => ({
          events: s.events.map((ev) => (ev.id === eventId ? { ...ev, expenses: [...ev.expenses, item] } : ev)),
        }));
        get().pushActivity({ type: "expense", message: `Added expense $${e.amount} (${e.category})`, eventId });
      },
      removeExpense: (eventId, expenseId) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId ? { ...e, expenses: e.expenses.filter((x) => x.id !== expenseId) } : e
          ),
        })),

      addNote: (eventId, content) => {
        const n: EventNote = { id: uid(), content, createdAt: new Date().toISOString() };
        set((s) => ({
          events: s.events.map((e) => (e.id === eventId ? { ...e, notes: [n, ...e.notes] } : e)),
        }));
      },
      removeNote: (eventId, noteId) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId ? { ...e, notes: e.notes.filter((n) => n.id !== noteId) } : e
          ),
        })),

      pushActivity: (a) =>
        set((s) => ({
          activity: [{ ...a, id: uid(), createdAt: new Date().toISOString() }, ...s.activity].slice(0, 50),
        })),

      resetSeed: () => set({ events: seedEvents(), activity: [] }),
    }),
    {
      name: "eventflow-store",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
          if (state.events.length === 0) {
            state.events = seedEvents();
          }
        }
      },
    }
  )
);
