"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6 min-h-screen text-white bg-gradient-to-b from-[#180033] to-[#0b001a]">
      <h1 className="text-3xl font-bold mb-2">Event Management Platform</h1>

      <p className="text-purple-300 mb-6">Day 1 – Auth Completed</p>

      <div className="flex gap-4">
        <Link
          href="/auth/register"
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Register
        </Link>

        <Link
          href="/auth/login"
          className="px-4 py-2 bg-fuchsia-600 rounded-lg hover:bg-fuchsia-700 transition"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
