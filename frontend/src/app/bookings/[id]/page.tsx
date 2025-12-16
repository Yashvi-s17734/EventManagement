"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function PublicBookingPage() {
  const params = useParams();
  const bookingId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setError("Invalid booking link");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const data = await apiFetch(`/bookings/${bookingId}`);
        setBooking(data);
      } catch (err: any) {
        setError("Invalid or expired ticket");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [bookingId]);

  if (loading) return <p>Loading ticket...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!booking) return <p>Ticket not found</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", textAlign: "center" }}>
      <h1>🎫 Event Ticket</h1>

      <h2>{booking.event.title}</h2>

      <p>
        <strong>Ticket:</strong> {booking.ticket.name} × {booking.quantity}
      </p>

      <p>
        <strong>Total Paid:</strong> ₹{booking.totalPrice}
      </p>

      <p style={{ marginTop: 20, color: "green", fontWeight: "bold" }}>
        ✅ Valid Ticket
      </p>
    </div>
  );
}
