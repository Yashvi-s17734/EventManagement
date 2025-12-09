"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  async function loadEvents() {
    try {
      setLoading(true);

      const data = await apiFetch(
        `/events?search=${search}&category=${category}&page=${page}&limit=4`
      );

      setEvents(data.events);
      setTotalPages(data.totalPages);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load events";
      setError(message);
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
    <div className="min-h-screen px-6 py-10 max-w-5xl mx-auto text-white">
      <h1 className="text-4xl font-bold text-purple-200 mb-8">Events</h1>

      {/* Filters */}
      <form
        onSubmit={applyFilters}
        className="flex flex-col sm:flex-row gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-lg border border-white/20 mb-8"
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

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 
                     text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600"
        >
          <option value="" className="text-black">All Categories</option>
          <option className="text-black">Technology</option>
          <option className="text-black">Business</option>
          <option className="text-black">Comedy</option>
          <option className="text-black">Music</option>
          <option className="text-black">Workshop</option>
        </select>

        <button
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-500 
                     rounded-lg font-semibold hover:scale-[1.02] transition-transform shadow-lg"
        >
          Apply
        </button>
      </form>

      {/* Loading / Error */}
      {loading && <p className="text-purple-300">Loading events...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* Event Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {events.map((ev) => (
          <Link
            key={ev.id}
            href={`/events/${ev.id}`}
            className="bg-white/10 backdrop-blur-lg border border-white/20 
                       rounded-xl p-4 hover:scale-[1.02] transition-transform 
                       shadow-[0_0_25px_rgba(142,65,255,0.3)]"
          >
            
     <img
  src={ev.banner ?? "/default.jpg"}  
  alt="event banner"
  className="w-full h-40 object-cover rounded-xl mb-3"
/>

            <h3 className="text-xl font-semibold text-purple-200">{ev.title}</h3>

            <p className="text-gray-300">{ev.category}</p>
            <p className="text-gray-300">{ev.location}</p>

            <p className="text-sm text-gray-400 mt-1">
              {new Date(ev.date).toLocaleString()}
            </p>
          </Link>
        ))}
      </div>

      {/* Pagination */}
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
    </div>
  );
}
