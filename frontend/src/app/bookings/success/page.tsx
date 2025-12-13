import { Suspense } from "react";
import BookingSuccessClient from "./BookingSuccessClient";

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
      <BookingSuccessClient />
    </Suspense>
  );
}
