"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get("bookingId");

  // Auto redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (bookingId) {
        router.push(`/bookings/${bookingId}`);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [bookingId, router]);

  if (!bookingId) {
    return <p>Invalid booking.</p>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h1>🎉 Booking Successful!</h1>

      <p>Your ticket has been booked successfully.</p>

      <p>You will be redirected to your ticket shortly.</p>

      <button
        style={{ marginTop: 20, padding: "10px 20px", fontSize: 16 }}
        onClick={() => router.push(`/bookings/${bookingId}`)}
      >
        View Ticket
      </button>
    </div>
  );
}
