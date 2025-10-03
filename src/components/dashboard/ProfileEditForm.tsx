// src/components/dashboard/ProfileEditForm.tsx
"use client";

import { useState } from "react";
import type { UserProfile } from "@/types/ui";
import { updateUserProfile } from "@/services/dashboard";

export default function ProfileEditForm({
  value,
  onChange,
  onSaved,
}: {
  value: UserProfile;
  onChange: (next: UserProfile) => void;
  onSaved?: () => void;
}) {
  const [form] = useState({
    name: value.name,
    username: value.username ?? "",
    email: value.email,
    bio: value.bio ?? "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    try {
      setSaving(true);
      const updated = await updateUserProfile(value.id, {
        name: form.name,
        username: form.username,
        email: form.email,
        biography: form.bio,
      });
      // refleja en el estado de la vista
      onChange({
        ...value,
        name: updated.name ?? form.name,
        username: updated.username ?? form.username,
        email: updated.email ?? form.email,
        bio: updated.biography ?? form.bio,
      });
      onSaved?.();
    } catch (e) {
      console.error("updateUserProfile failed:", e);
      // aquí puedes mostrar un toast si usas react-toastify
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white/5 p-5 border border-white/10 text-white">
      {/* …inputs iguales… */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <button /* Undo … */>Undo</button>
        <button onClick={save} disabled={saving}
          className="px-4 py-2 rounded-lg bg-white text-[var(--color-violeta)]">
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </section>
  );
}
