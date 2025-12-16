"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Organizer");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/auth/login";
  }

  useEffect(() => {
    // ✅ browser-only code
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }

    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    async function fetchEvents() {
      try {
        const res = await fetch(
          "https://eventmanagement-j5gp.onrender.com/api/events/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error("Error loading events", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <main className="p-6 min-h-screen text-white bg-gradient-to-b from-[#180033] to-[#0b001a]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Organizer Dashboard</h1>
        <p className="text-xl text-fuchsia-300 mb-10">
          Hello, {name.charAt(0).toUpperCase() + name.slice(1)}!
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            href="/events/create"
            className="px-6 py-3 bg-fuchsia-600 rounded-xl hover:bg-fuchsia-700 transition shadow-lg"
          >
            + Create Event
          </Link>

          <Link
            href="/events"
            className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition shadow-lg"
          >
            View Events
          </Link>

          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-6">My Created Events</h2>

        {loading ? (
          <p>Loading your events...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-fuchsia-900/20 rounded-2xl">
            <p className="text-xl text-gray-300 mb-6">
              You haven't created any events yet.
            </p>
            <Link
              href="/events/create"
              className="px-8 py-4 bg-fuchsia-600 rounded-xl hover:bg-fuchsia-700 text-lg"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-fuchsia-900/30 border border-fuchsia-600 rounded-xl p-8"
              >
                <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                <p className="text-gray-300 mb-4">
                  {new Date(event.date).toLocaleDateString()} • {event.location}
                </p>
                <p className="text-lg mb-6">
                  Total Bookings: <strong>{event._count?.bookings || 0}</strong>
                </p>

                <div className="flex gap-4">
                  <Link href={`/events/${event.id}/manage`}>
                    <button className="px-5 py-2 bg-purple-600 rounded-lg">
                      Manage Bookings
                    </button>
                  </Link>
                  <Link href={`/events/${event.id}`}>
                    <button className="px-5 py-2 bg-blue-600 rounded-lg">
                      Public View
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
