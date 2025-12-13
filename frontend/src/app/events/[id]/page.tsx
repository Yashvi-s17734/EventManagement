"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

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

  async function handleBuyTicket(ticketId: string) {
    try {
      setBookingLoading(ticketId);

      const booking = await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          ticketId: ticketId,
          quantity: 1,
        }),
      });

      router.push(`/bookings/success?bookingId=${booking.id}`);
    } catch (err) {
      alert("Booking failed");
      console.error(err);
    } finally {
      setBookingLoading(null);
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
      {event.banner && (
        <img
          src={event.banner}
          alt="event banner"
          className="w-full h-80 object-cover rounded-2xl shadow-[0_0_30px_rgba(142,65,255,0.4)]"
        />
      )}

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

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-purple-200">
            Available Tickets
          </h2>

          {event.tickets?.map((ticket: any) => (
            <div
              key={ticket.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold">{ticket.name}</h3>
                <p className="text-gray-300">
                  ₹{ticket.price} • {ticket.availableSeats} seats left
                </p>
              </div>

              <button
                onClick={() => handleBuyTicket(ticket.id)}
                disabled={
                  bookingLoading !== null || ticket.availableSeats === 0
                }
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-500 
                           rounded-xl font-semibold disabled:opacity-50"
              >
                {ticket.availableSeats === 0
                  ? "Sold Out"
                  : bookingLoading === ticket.id
                  ? "Booking..."
                  : "Buy Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
