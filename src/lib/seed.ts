import type { AppEvent } from "./types";
import { addDays, formatISO } from "date-fns";

const uid = () => Math.random().toString(36).slice(2, 11);
const today = new Date();

const COVERS = {
  Conference: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&q=80",
  Wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80",
  Birthday: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80",
  Workshop: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&q=80",
  Meetup: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=80",
  Concert: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80",
  Corporate: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80",
};

function makeGuests(n: number, attendingPct = 0.6, maybePct = 0.2) {
  const names = ["Ava Chen", "Liam Patel", "Noah Garcia", "Olivia Kim", "Mia Johnson", "Ethan Brown", "Sofia Nguyen", "Lucas Rivera", "Emma Davis", "Mateo Silva", "Isabella Lee", "Jackson Wu", "Aria Singh", "Logan Reed", "Zoe Martin", "Caleb Park", "Layla Cohen", "Owen Clarke", "Maya Hernandez", "Eli Tanaka"];
  return Array.from({ length: n }).map((_, i) => {
    const r = Math.random();
    const rsvp = r < attendingPct ? "attending" : r < attendingPct + maybePct ? "maybe" : r < attendingPct + maybePct + 0.15 ? "declined" : "pending";
    const name = names[i % names.length];
    return {
      id: uid(),
      name,
      email: name.toLowerCase().replace(" ", ".") + "@example.com",
      rsvp: rsvp as "attending" | "maybe" | "declined" | "pending",
      invitedAt: formatISO(addDays(today, -Math.floor(Math.random() * 14))),
    };
  });
}

export function seedEvents(): AppEvent[] {
  return [
    {
      id: uid(),
      title: "Aurora Tech Summit 2026",
      description: "A two-day flagship conference exploring the future of AI, design systems, and product engineering. Keynotes from industry leaders, hands-on workshops, and an unforgettable networking experience.",
      date: formatISO(addDays(today, 14), { representation: "date" }),
      time: "09:00",
      venue: "The Grand Hall, San Francisco",
      coverImage: COVERS.Conference,
      category: "Conference",
      capacity: 500,
      budget: 45000,
      createdAt: formatISO(addDays(today, -20)),
      guests: makeGuests(18, 0.65, 0.2),
      checklist: [
        { id: uid(), text: "Confirm keynote speakers", done: true, createdAt: formatISO(today) },
        { id: uid(), text: "Order branded merchandise", done: true, createdAt: formatISO(today) },
        { id: uid(), text: "Finalize AV setup", done: false, createdAt: formatISO(today) },
        { id: uid(), text: "Send reminder emails", done: false, createdAt: formatISO(today) },
        { id: uid(), text: "Brief volunteer team", done: false, createdAt: formatISO(today) },
      ],
      expenses: [
        { id: uid(), label: "Venue rental", category: "Venue", amount: 18000, createdAt: formatISO(today) },
        { id: uid(), label: "Catering (lunch + breaks)", category: "Catering", amount: 9500, createdAt: formatISO(today) },
        { id: uid(), label: "AV equipment", category: "Production", amount: 4200, createdAt: formatISO(today) },
        { id: uid(), label: "Speaker travel", category: "Travel", amount: 6800, createdAt: formatISO(today) },
      ],
      notes: [
        { id: uid(), content: "VIP lounge needs to be ready by 8am sharp on day 1.", createdAt: formatISO(today) },
      ],
    },
    {
      id: uid(),
      title: "Maya & Jordan's Wedding",
      description: "An intimate garden wedding celebrating the union of Maya and Jordan, surrounded by family and close friends.",
      date: formatISO(addDays(today, 38), { representation: "date" }),
      time: "16:30",
      venue: "Rosewood Gardens, Napa Valley",
      coverImage: COVERS.Wedding,
      category: "Wedding",
      capacity: 120,
      budget: 32000,
      createdAt: formatISO(addDays(today, -45)),
      guests: makeGuests(14, 0.75, 0.15),
      checklist: [
        { id: uid(), text: "Final dress fitting", done: true, createdAt: formatISO(today) },
        { id: uid(), text: "Confirm florist delivery", done: false, createdAt: formatISO(today) },
        { id: uid(), text: "Print seating chart", done: false, createdAt: formatISO(today) },
      ],
      expenses: [
        { id: uid(), label: "Venue & ceremony", category: "Venue", amount: 12000, createdAt: formatISO(today) },
        { id: uid(), label: "Catering", category: "Catering", amount: 8500, createdAt: formatISO(today) },
        { id: uid(), label: "Photography", category: "Production", amount: 4500, createdAt: formatISO(today) },
        { id: uid(), label: "Florals", category: "Decor", amount: 3200, createdAt: formatISO(today) },
      ],
      notes: [],
    },
    {
      id: uid(),
      title: "Indie Founders Meetup",
      description: "Monthly gathering for indie hackers and bootstrapped founders. Lightning talks, Q&A, and drinks.",
      date: formatISO(addDays(today, 5), { representation: "date" }),
      time: "18:30",
      venue: "Pier 27, San Francisco",
      coverImage: COVERS.Meetup,
      category: "Meetup",
      capacity: 80,
      budget: 1500,
      createdAt: formatISO(addDays(today, -10)),
      guests: makeGuests(12, 0.55, 0.25),
      checklist: [
        { id: uid(), text: "Confirm 3 lightning speakers", done: true, createdAt: formatISO(today) },
        { id: uid(), text: "Order pizza & drinks", done: false, createdAt: formatISO(today) },
      ],
      expenses: [
        { id: uid(), label: "Food & drinks", category: "Catering", amount: 600, createdAt: formatISO(today) },
        { id: uid(), label: "Stickers & swag", category: "Marketing", amount: 220, createdAt: formatISO(today) },
      ],
      notes: [],
    },
    {
      id: uid(),
      title: "Design Systems Workshop",
      description: "A hands-on workshop covering tokens, theming, and component libraries at scale.",
      date: formatISO(addDays(today, -12), { representation: "date" }),
      time: "10:00",
      venue: "Studio 88, Brooklyn",
      coverImage: COVERS.Workshop,
      category: "Workshop",
      capacity: 40,
      budget: 5000,
      createdAt: formatISO(addDays(today, -50)),
      guests: makeGuests(16, 0.8, 0.1),
      checklist: [
        { id: uid(), text: "Send recording to attendees", done: true, createdAt: formatISO(today) },
        { id: uid(), text: "Collect feedback survey", done: true, createdAt: formatISO(today) },
      ],
      expenses: [
        { id: uid(), label: "Studio rental", category: "Venue", amount: 1800, createdAt: formatISO(today) },
        { id: uid(), label: "Lunch", category: "Catering", amount: 900, createdAt: formatISO(today) },
      ],
      notes: [],
    },
    {
      id: uid(),
      title: "Sasha's 30th Birthday Bash",
      description: "Rooftop birthday party with DJ, cocktails, and a panoramic skyline view.",
      date: formatISO(addDays(today, 22), { representation: "date" }),
      time: "20:00",
      venue: "Skyline Rooftop, Brooklyn",
      coverImage: COVERS.Birthday,
      category: "Birthday",
      capacity: 60,
      budget: 4500,
      createdAt: formatISO(addDays(today, -8)),
      guests: makeGuests(10, 0.7, 0.2),
      checklist: [
        { id: uid(), text: "Book DJ", done: true, createdAt: formatISO(today) },
        { id: uid(), text: "Order custom cake", done: false, createdAt: formatISO(today) },
      ],
      expenses: [
        { id: uid(), label: "Rooftop reservation", category: "Venue", amount: 1500, createdAt: formatISO(today) },
        { id: uid(), label: "DJ", category: "Production", amount: 800, createdAt: formatISO(today) },
        { id: uid(), label: "Cocktails & catering", category: "Catering", amount: 1600, createdAt: formatISO(today) },
      ],
      notes: [],
    },
    {
      id: uid(),
      title: "Q1 All-Hands Offsite",
      description: "Company-wide kickoff covering strategy, OKRs, and team-building activities.",
      date: formatISO(addDays(today, 60), { representation: "date" }),
      time: "09:00",
      venue: "Lakeside Resort, Tahoe",
      coverImage: COVERS.Corporate,
      category: "Corporate",
      capacity: 150,
      budget: 28000,
      createdAt: formatISO(addDays(today, -5)),
      guests: makeGuests(8, 0.85, 0.1),
      checklist: [{ id: uid(), text: "Book transport", done: false, createdAt: formatISO(today) }],
      expenses: [{ id: uid(), label: "Resort booking", category: "Venue", amount: 18000, createdAt: formatISO(today) }],
      notes: [],
    },
  ];
}
