"use client";
import { useEffect } from "react";

export default function Warmup() {
  useEffect(() => {
    fetch("https://eventmanagement-j5gp.onrender.com/health").catch(() => {});
  }, []);

  return null;
}
