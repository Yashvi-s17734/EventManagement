"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const r = localStorage.getItem("role");
    const t = localStorage.getItem("token");

    setRole(r);
    setLoggedIn(!!t);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.reload();
  }

  return (
    <main className="p-6 min-h-screen text-white bg-gradient-to-b from-[#180033] to-[#0b001a]">

      <h1 className="text-4xl font-bold mb-3">Event Management Platform</h1>
      <p className="text-purple-300 mb-10 text-lg">Welcome to your dashboard</p>

      {/* MAIN NAVIGATION BUTTONS */}
      <div className="flex flex-wrap gap-4">

        {/* View Events - everyone can see */}
        <Link
          href="/events"
          className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition shadow-lg"
        >
          View Events
        </Link>

        {/* Create Event - ONLY for organizer or admin */}
        {(role === "ORGANIZER" || role === "ADMIN") && (
          <Link
            href="/events/create"
            className="px-6 py-3 bg-fuchsia-600 rounded-xl hover:bg-fuchsia-700 transition shadow-lg"
          >
            + Create Event
          </Link>
        )}

        {/* Login / Register (only when logged out) */}
        {!loggedIn && (
          <>
            <Link
              href="/auth/login"
              className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-700 transition"
            >
              Register
            </Link>
          </>
        )}

        {/* Logout Button (if logged in) */}
        {loggedIn && (
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>

      {/* ROLE BADGE */}
      {loggedIn && (
        <p className="mt-8 text-gray-300">
          Logged in as:{" "}
          <span className="text-purple-300 font-semibold">{role}</span>
        </p>
      )}
    </main>
  );
}
