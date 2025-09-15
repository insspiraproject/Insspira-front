"use client";

import { useState } from "react";
import type { UserProfile } from "@/mocks/userMocks";

export default function ProfileEditForm({
  value,
  onChange,
  onSaved,
}: {
  value: UserProfile;
  onChange: (next: UserProfile) => void;
  onSaved?: () => void; // <-- NEW
}) {
  const [form, setForm] = useState({
    name: value.name,
    username: value.username,
    email: value.email,
    bio: value.bio ?? "",
  });

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const save = () => {
    onChange({ ...value, ...form });
    onSaved?.();
  };

  return (
    <section className="rounded-2xl bg-white/5 p-5 border border-white/10 text-white">
      <h3 className="text-lg font-semibold mb-3">Update Information</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="text-sm">
          Name
          <input
            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </label>
        <label className="text-sm">
          Username
          <input
            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
          />
        </label>
        <label className="text-sm md:col-span-2">
          Email
          <input
            type="email"
            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </label>
        <label className="text-sm md:col-span-2">
          Bio
          <textarea
            rows={3}
            className="mt-1 w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none resize-y"
            value={form.bio}
            onChange={(e) => set("bio", e.target.value)}
          />
        </label>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          onClick={() =>
            setForm({
              name: value.name,
              username: value.username,
              email: value.email,
              bio: value.bio ?? "",
            })
          }
          className="px-4 py-2 rounded-lg border border-white/20 hover:border-white"
        >
          Undo
        </button>
        <button
          onClick={save}
          className="px-4 py-2 rounded-lg bg-white text-[var(--color-violeta)]"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
}