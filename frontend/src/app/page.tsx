"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (role === "ORGANIZER" || role === "ADMIN") {
      router.push("/organizer/dashboard");
    } else {
      router.push("/user/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-b from-[#180033] to-[#0b001a]">
      <p className="text-xl">Redirecting to your dashboard...</p>
    </div>
  );
}
