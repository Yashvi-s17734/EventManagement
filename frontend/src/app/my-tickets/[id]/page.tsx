"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MyTicketPage() {
  const params = useParams();
  const bookingId = params.id;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth/login";
      return;
    }

    async function load() {
      try {
        const res = await fetch(
          `https://eventmanagement-j5gp.onrender.com/api/bookings/${bookingId}/owner`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        setError("Unable to load ticket. It may not belong to you.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [bookingId]);

  if (loading) return <p>Loading your ticket...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", textAlign: "center" }}>
      <h1>🎫 Your Event Ticket</h1>
      <h2>{booking.event.title}</h2>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(booking.event.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Ticket:</strong> {booking.ticket.name} × {booking.quantity}
      </p>
      <p>
        <strong>Total Paid:</strong> ₹{booking.totalPrice}
      </p>

      <div style={{ margin: "30px 0" }}>
        <h3>Your QR Code</h3>
        <img
          src={booking.qrImage}
          alt="QR Code"
          style={{ maxWidth: "300px", border: "1px solid #ccc" }}
        />
      </div>

      <p style={{ color: "green", fontWeight: "bold" }}>
        ✅ Valid Ticket - Show this at the event
      </p>
    </div>
  );
}
