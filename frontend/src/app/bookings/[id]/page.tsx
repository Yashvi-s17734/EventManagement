"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadBooking() {
    try {
      const data = await apiFetch("/bookings/me");

      console.log("URL bookingId:", bookingId);
      console.log(
        "My bookings:",
        data.map((b: any) => b.id)
      );

      const found = data.find((b: any) => b.id === bookingId);

      setBooking(found || null);
    } catch (err) {
      console.error("Failed to load booking", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (bookingId) loadBooking();
  }, [bookingId]);

  if (loading) return <p>Loading booking...</p>;
  if (!booking) return <p>Booking not found.</p>;

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h1>Your Ticket</h1>

      <h2>{booking.event.title}</h2>

      <p>
        <strong>Ticket Type:</strong> {booking.ticket.name}
      </p>

      <p>
        <strong>Quantity:</strong> {booking.quantity}
      </p>

      <p>
        <strong>Total Paid:</strong> ₹{booking.totalPrice}
      </p>

      <img
        src={booking.qrImage}
        alt="QR Code"
        style={{
          width: 250,
          height: 250,
          marginTop: 20,
          border: "1px solid #ccc",
          padding: 10,
          background: "white",
        }}
      />

      <p style={{ marginTop: 15 }}>
        <strong>QR Code:</strong> {booking.qrCode}
      </p>
    </div>
  );
}
