"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
    setName(localStorage.getItem("name".toUpperCase()));
  }, []);

  const loggedIn = !!token;

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    window.location.href = "/";
  }

  return (
    <main className="p-6 min-h-screen text-white bg-gradient-to-b from-[#180033] to-[#0b001a]">
      <h1 className="text-4xl font-bold mb-3">Event Management Platform</h1>

      {loggedIn ? (
        <p className="text-purple-300 mb-10 text-lg">
          Welcome back{name ? `, ${name}` : ""}
        </p>
      ) : (
        <p className="text-purple-300 mb-10 text-lg">
          Welcome to your dashboard
        </p>
      )}

      <div className="flex flex-wrap gap-4">
        {/* View Events */}
        <Link
          href="/events"
          className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition shadow-lg"
        >
          View Events
        </Link>

        {/* Create Event (Organizer/Admin) */}
        {(role === "ORGANIZER" || role === "ADMIN") && loggedIn && (
          <Link
            href="/events/create"
            className="px-6 py-3 bg-fuchsia-600 rounded-xl hover:bg-fuchsia-700 transition shadow-lg"
          >
            + Create Event
          </Link>
        )}

        {/* Login / Register */}
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

        {/* Logout */}
        {loggedIn && (
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-700 transition"
          >
            Logout
          </button>
        )}
      </div>

      {loggedIn && (
        <p className="mt-8 text-gray-300">
          Logged in as:{" "}
          <span className="text-purple-300 font-semibold">{role}</span>
        </p>
      )}
    </main>
  );
}
