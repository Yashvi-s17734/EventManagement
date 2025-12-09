"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

type EventType = {
  id: string;
  title: string;
  banner: string | null;
  category: string;
  location: string;
  date: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await apiFetch(`/events?search=${search}`);
      setEvents(data.events);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error loading events";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loadEvents();
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto text-white">

      <h1 className="text-4xl font-bold text-purple-200 mb-6">Events</h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex gap-3 mb-8 bg-white/10 p-4 rounded-xl backdrop-blur-lg border border-white/20"
      >
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20
                     text-white placeholder-gray-300 focus:border-purple-500 focus:ring-2 
                     focus:ring-purple-600 outline-none"
        />

        <button
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-500 
                     rounded-lg font-semibold hover:scale-[1.02] transition-transform shadow-lg"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-purple-300">Loading events...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {events.map((ev) => (
          <Link
            key={ev.id}
            href={`/events/${ev.id}`}
            className="bg-white/10 backdrop-blur-lg border border-white/20 
                       rounded-xl p-4 hover:scale-[1.02] transition-transform 
                       shadow-[0_0_20px_rgba(142,65,255,0.3)]"
          >
      <img
  src={ev.banner ?? "/default.jpg"}  
  alt="event banner"
  className="w-full h-40 object-cover rounded-xl mb-3"
/>


            <h3 className="text-xl font-semibold mb-1 text-purple-200">
              {ev.title}
            </h3>

            <p className="text-gray-300">{ev.category}</p>
            <p className="text-gray-300">{ev.location}</p>

            <p className="mt-2 text-sm text-gray-400">
              {new Date(ev.date).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
