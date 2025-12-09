"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/lib/api";


export default function CreateEvent() {
  const router = useRouter();

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technology");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [banner, setBanner] = useState<File | null>(null);

  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle banner image selection
  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setBanner(file);
      setBannerPreview(URL.createObjectURL(file)); // preview image
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!banner) {
        throw new Error("Please upload a banner image");
      }

      // STEP 1 → Upload banner to backend
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

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || "Upload failed");
      }

      const bannerUrl = uploadData.url;

      // STEP 2 → Create event using uploaded banner URL
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
      router.push("/events"); // redirect to event list
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "30px auto" }}>
      <h1>Create Event</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Image Preview */}
      {bannerPreview && (
        <img
          src={bannerPreview}
          alt="Banner preview"
          style={{ width: "100%", marginBottom: 20, borderRadius: 8 }}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Technology</option>
            <option>Business</option>
            <option>Comedy</option>
            <option>Music</option>
            <option>Workshop</option>
          </select>
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div>
          <label>Event Date</label>
          <input
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label>Event Banner</label>
          <input type="file" accept="image/*" onChange={handleBannerChange} />
        </div>

        <button disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
