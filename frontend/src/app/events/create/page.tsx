"use client";

import { useState } from "react";
import { apiFetch, BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [banner, setBanner] = useState<File | null>(null);

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!banner) throw new Error("Please upload a banner image");

      // STEP 1: Upload banner
      const formData = new FormData();
      formData.append("banner", banner);

      const uploadRes = await fetch(BASE_URL + "/events/upload-banner", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")!,
        },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || "Upload failed");

      const bannerUrl = uploadData.url;

      // STEP 2: Create event
      await apiFetch("/events", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          category,
          location,
          date,
          banner: bannerUrl,
        }),
      });

      alert("Event created successfully!");
      router.push("/events");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen p-6 flex justify-center bg-gradient-to-b from-[#180033] to-[#0b001a] text-white">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-[0_0_40px_rgba(142,65,255,0.4)]">

        <h1 className="text-3xl font-bold text-center mb-6 text-purple-200">
          Create New Event
        </h1>

        {error && (
          <p className="text-red-400 text-center mb-4 font-medium">{error}</p>
        )}

        {/* Banner Preview */}
        {bannerPreview && (
          <img
            src={bannerPreview}
            alt="Banner Preview"
            className="w-full rounded-xl mb-6 shadow-lg"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-purple-200 mb-1">Event Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
                         text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
                         text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none min-h-[100px]"
            ></textarea>
          </div>

          <div>
            <label className="block text-purple-200 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
                         text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none"
            >
              <option className="text-black">Technology</option>
              <option className="text-black">Business</option>
              <option className="text-black">Comedy</option>
              <option className="text-black">Music</option>
              <option className="text-black">Workshop</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-200 mb-1">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
                         text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-1">Event Date</label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl 
                         text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-1">Event Banner</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="w-full text-white p-2"
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 
                       text-white font-semibold hover:scale-[1.02] transition-transform 
                       shadow-lg shadow-purple-700/40 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}
