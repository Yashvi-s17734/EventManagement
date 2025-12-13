"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function BookingDetailsPage() {
  const params = useParams();
  const bookingId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setError("No booking ID in URL");
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const bookings = await apiFetch("/bookings/me");

        if (!Array.isArray(bookings)) {
          throw new Error("Invalid response from server");
        }

        const found = bookings.find((b: any) => b.id === bookingId);

        if (!found) {
          console.log(
            "Available bookings:",
            bookings.map((b: any) => b.id)
          );
          setError(`Booking ${bookingId} not found in your account`);
        }

        setBooking(found);
      } catch (err: any) {
        setError(err.message || "Failed to load booking");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [bookingId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!booking) return <p>Booking not found.</p>;

  return (
    <div
      style={{ maxWidth: 800, margin: "20px auto", fontFamily: "sans-serif" }}
    >
      <h1>Your Ticket</h1>
      <h2>{booking.event.title}</h2>
      <p>
        <strong>Ticket:</strong> {booking.ticket.name} × {booking.quantity}
      </p>
      <p>
        <strong>Total:</strong> ₹{booking.totalPrice}
      </p>

      <div style={{ textAlign: "center", margin: "30px 0" }}>
        <img
          src={booking.qrImage}
          alt="QR Code"
          style={{ width: 300, height: 300, border: "1px solid #000" }}
        />
      </div>

      <p>
        <strong>Code:</strong> {booking.qrCode}
      </p>
    </div>
  );
}
