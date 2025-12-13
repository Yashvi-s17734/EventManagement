"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    fetch("https://eventmanagement-j5gp.onrender.com/health").catch(() => {});
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");

    setToken(token);
    setRole(role);
    setName(name);
  }, []);

  const loggedIn = !!token;

  function logout() {
    // Clear cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Clear UI state
    localStorage.removeItem("name");
    localStorage.removeItem("role");

    window.location.href = "/auth/login";
  }

  return (
    <main className="p-6 min-h-screen text-white bg-gradient-to-b from-[#180033] to-[#0b001a]">
      <h1 className="text-4xl font-bold mb-3">Event Management Platform</h1>

      {loggedIn ? (
        <p className="text-purple-300 mb-10 text-lg">
          Welcome back
          {name ? `, ${name.charAt(0).toUpperCase()}${name.slice(1)}` : ""}
        </p>
      ) : (
        <p className="text-purple-300 mb-10 text-lg">
          Welcome to your dashboard
        </p>
      )}

      <div className="flex flex-wrap gap-4">
        <Link
          href="/events"
          className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition shadow-lg"
        >
          View Events
        </Link>
        {(role === "ORGANIZER" || role === "ADMIN") && loggedIn && (
          <Link
            href="/events/create"
            className="px-6 py-3 bg-fuchsia-600 rounded-xl hover:bg-fuchsia-700 transition shadow-lg"
          >
            + Create Event
          </Link>
        )}
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
