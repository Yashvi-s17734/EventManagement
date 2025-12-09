"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadEvent() {
    try {
      const data = await apiFetch(`/events/${id}`);
      setEvent(data);
    } catch (err) {
      console.error("Failed to load event", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
  }, []);

  if (loading)
    return (
      <p className="text-center text-purple-300 mt-10 text-xl">
        Loading event...
      </p>
    );

  if (!event)
    return (
      <p className="text-center text-red-400 mt-10 text-xl">Event not found.</p>
    );

  return (
    <div className="min-h-screen px-6 py-10 max-w-4xl mx-auto text-white space-y-8">
      {/* Banner */}
      {event.banner && (
       <img
  src={event.banner}
  alt="event banner"
  className="w-full h-80 object-cover rounded-2xl shadow-[0_0_30px_rgba(142,65,255,0.4)]"
/>

      )}

      {/* Event Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-[0_0_40px_rgba(142,65,255,0.3)] space-y-4">
        <h1 className="text-4xl font-bold text-purple-200">{event.title}</h1>

        <p className="text-gray-300">
          <span className="font-semibold text-purple-300">Category:</span>{" "}
          {event.category}
        </p>

        <p className="text-gray-300">
          <span className="font-semibold text-purple-300">Location:</span>{" "}
          {event.location}
        </p>

        <p className="text-gray-300">
          <span className="font-semibold text-purple-300">Date:</span>{" "}
          {new Date(event.date).toLocaleString()}
        </p>

        <p className="text-gray-200 leading-7 pt-4 whitespace-pre-line">
          {event.description || "No description provided."}
        </p>

        {/* Buy Ticket Button */}
        <button
          onClick={() => alert("Ticket booking (coming Day 5!)")}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 
                     rounded-xl font-semibold text-white transition-transform 
                     hover:scale-[1.03] shadow-lg shadow-purple-700/40"
        >
          Buy Ticket
        </button>
      </div>
    </div>
  );
}
