"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  Laptop,
  Briefcase,
  Music,
  Clapperboard,
  Wrench,
  Layers,
} from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { label: "All", value: "", icon: Layers },
    { label: "Technology", value: "Technology", icon: Laptop },
    { label: "Business", value: "Business", icon: Briefcase },
    { label: "Music", value: "Music", icon: Music },
    { label: "Comedy", value: "Comedy", icon: Clapperboard },
    { label: "Workshop", value: "Workshop", icon: Wrench },
  ];

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  async function loadEvents() {
    try {
      setLoading(true);
      const data = await apiFetch(
        `/events?search=${search}&category=${category}&page=${page}&limit=4`
      );
      setEvents(data.events);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, [page]);

  async function applyFilters(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPage(1);
    loadEvents();
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-purple-200">Events</h1>

        {(role === "ORGANIZER" || role === "ADMIN") && (
          <Link
            href="/events/create"
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-500 
                       rounded-xl font-semibold shadow-lg hover:scale-105 transition"
          >
            + Create Event
          </Link>
        )}
      </div>
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setCategory(cat.value);
              setPage(1);
              loadEvents();
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all
              ${
                category === cat.value
                  ? "bg-purple-600 border-purple-400 scale-105 shadow-lg"
                  : "bg-white/10 border-white/20 hover:bg-white/20"
              }`}
          >
            <cat.icon size={18} />
            {cat.label}
          </button>
        ))}
      </div>
      <form
        onSubmit={applyFilters}
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
          Apply
        </button>
      </form>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white/10 rounded-xl border border-white/20 p-4"
            >
              <div className="w-full h-40 rounded-xl bg-white/20 mb-3"></div>
              <div className="h-5 w-3/4 bg-white/20 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-white/20 rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && events.length === 0 && (
        <div className="mt-20 text-center text-gray-300 flex flex-col items-center">
          <Clapperboard size={60} className="text-purple-400 mb-4" />
          <p className="text-2xl">No events found</p>
          <p className="text-gray-400 mt-2">Try adjusting filters or search</p>
        </div>
      )}

      {/* Event Grid */}
      {!loading && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {events.map((ev) => (
            <Link
              key={ev.id}
              href={`/events/${ev.id}`}
              className="bg-white/10 backdrop-blur-lg border border-white/20 
                      rounded-xl p-4 shadow-[0_0_25px_rgba(142,65,255,0.3)]
                      transition-all hover:scale-[1.05] hover:shadow-[0_0_35px_rgba(142,65,255,0.6)]"
            >
              <img
                src={ev.banner ?? "/default.jpg"}
                alt={ev.title}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />

              <h3 className="text-xl font-semibold text-purple-200">
                {ev.title}
              </h3>

              <p className="text-gray-300">{ev.category}</p>
              <p className="text-gray-300">{ev.location}</p>

              <p className="text-sm text-gray-400 mt-1">
                {new Date(ev.date).toLocaleString()}
              </p>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                       text-white disabled:opacity-40 hover:bg-white/20"
          >
            Previous
          </button>

          <span className="text-lg">
            Page <span className="text-purple-300">{page}</span> / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                       text-white disabled:opacity-40 hover:bg-white/20"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
