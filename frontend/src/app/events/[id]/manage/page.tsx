"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ManageBookingsPage() {
  const params = useParams();
  const eventId = params.id as string; // ✅ THIS IS THE FIX

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    async function fetchBookings() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `https://eventmanagement-j5gp.onrender.com/bookings/event/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to load bookings");
        }

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [eventId]);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        bookings.map((b: any) => (
          <div
            key={b.id}
            className="mb-4 p-4 border border-fuchsia-600 rounded-lg"
          >
            <p>
              <b>User:</b> {b.user.email}
            </p>
            <p>
              <b>Ticket:</b> {b.ticket.name}
            </p>
            <p>
              <b>Seats:</b> {b.quantity}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
