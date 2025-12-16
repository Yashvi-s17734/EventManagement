"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserDashboard() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("User");
  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName.charAt(0).toUpperCase() + storedName.slice(1));
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/auth/login";
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    async function fetchBookings() {
      try {
        const res = await fetch(
          "https://eventmanagement-j5gp.onrender.com/api/bookings/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API Response Status:", res.status);

        if (!res.ok) {
          const errorText = await res.text();
          console.log("Error response:", errorText);
        } else {
          const data = await res.json();
          console.log("Bookings received:", data);
          setBookings(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  return (
    <main className="p-6 min-h-screen text-white bg-gradient-to-b from-[#180033] to-[#0b001a]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">My Dashboard</h1>
        <p className="text-xl text-purple-300 mb-10">Welcome back, {name}!</p>

        <div className="flex flex-wrap gap-4 mb-12">
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

        {/* Bookings List */}
        <h2 className="text-3xl font-bold mb-6">My Booked Tickets</h2>

        {loading ? (
          <p>Loading your tickets...</p>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-purple-900/20 rounded-2xl">
            <p className="text-xl text-gray-300 mb-6">
              You haven't booked any tickets yet.
            </p>
            <Link
              href="/events"
              className="px-8 py-4 bg-purple-600 rounded-xl hover:bg-purple-700 text-lg"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-purple-900/30 border border-purple-600 rounded-xl p-6 hover:border-purple-400 transition"
              >
                <h3 className="text-xl font-bold mb-2">
                  {booking.event.title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {new Date(booking.event.date).toLocaleDateString()}
                </p>
                <p>
                  Ticket: {booking.ticket.name} × {booking.quantity}
                </p>
                <p className="font-semibold mb-4">₹{booking.totalPrice}</p>
                <Link href={`/booking/${booking.id}`}>
                  <button className="w-full py-2 bg-green-600 rounded-lg hover:bg-green-700">
                    View Ticket
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/" className="text-purple-300 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
