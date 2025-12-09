"use client";

import { useState } from "react";
import { apiFetch, BASE_URL } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Image as ImageIcon } from "lucide-react";

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

      // 1. Upload banner
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

      // 2. Create event
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
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
 const role =
  typeof window !== "undefined" ? localStorage.getItem("role") : null;

if (role !== "ORGANIZER" && role !== "ADMIN") {
  return (
    <p className="text-center text-red-400 mt-20 text-xl">
      You are not allowed to create events.
    </p>
  );
}
  return (
    <div className="min-h-screen px-6 py-10 bg-[#0b001a] flex justify-center text-white">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 
                      bg-white/5 backdrop-blur-2xl border border-white/10 
                      p-10 rounded-3xl shadow-[0_0_50px_rgba(142,65,255,0.35)]">

        {/* LEFT PANEL — FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <h1 className="text-3xl font-bold text-purple-200 mb-4">
            Create Event
          </h1>

          {error && (
            <p className="text-red-400 text-center mb-4 font-medium">{error}</p>
          )}

          {/* Event Title */}
          <div>
            <label className="block mb-1 text-purple-200">Event Name</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block mb-1 text-purple-200">Event Date</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 
                            rounded-xl focus-within:border-purple-500">
              <Calendar size={20} />
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent w-full outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-1 text-purple-200">Location</label>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/10 border border-white/20 
                            rounded-xl focus-within:border-purple-500">
              <MapPin size={20} />
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent w-full outline-none"
                placeholder="Online or Offline Event"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 text-purple-200">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none text-white"
            >
              <option className="text-black">Technology</option>
              <option className="text-black">Business</option>
              <option className="text-black">Comedy</option>
              <option className="text-black">Music</option>
              <option className="text-black">Workshop</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-purple-200">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl min-h-[120px]
                         focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none"
            ></textarea>
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block mb-1 text-purple-200">Event Banner</label>
            <div className="flex items-center gap-4 bg-white/10 p-3 rounded-xl border border-white/20">
              <ImageIcon size={24} className="text-purple-300" />
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="text-white"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-500 
                       text-white font-semibold hover:scale-[1.02] transition-transform 
                       shadow-lg shadow-purple-700/40 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>

        {/* RIGHT PANEL — BANNER PREVIEW */}
        <div className="flex justify-center items-center">
          <div className="w-full max-w-md bg-white/5 p-5 rounded-2xl border border-white/10 
                          shadow-[0_0_35px_rgba(142,65,255,0.35)]">
            <h2 className="text-xl font-semibold mb-3 text-purple-200">
              Banner Preview
            </h2>

            {bannerPreview ? (
              <img
                src={bannerPreview}
                className="w-full rounded-xl shadow-lg"
                alt="preview"
              />
            ) : (
              <div className="w-full h-64 bg-white/10 rounded-xl flex items-center justify-center 
                              text-gray-400 border border-white/20">
                No banner selected
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
