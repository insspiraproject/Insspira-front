// src/components/dashboard/ProfileEditModal.tsx
"use client";

import { FiX } from "react-icons/fi";
import type { UserProfile } from "@/mocks/userMocks";
import ProfileEditForm from "./ProfileEditForm";

export default function ProfileEditModal({
  open,
  onClose,
  value,
  onChange,
}: {
  open: boolean;
  onClose: () => void;
  value: UserProfile;
  onChange: (next: UserProfile) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[var(--color-violeta)] text-white border border-white/10 shadow-2xl">
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <h2 className="text-lg font-semibold">Edit Information</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="p-5">
          <ProfileEditForm value={value} onChange={onChange} onSaved={onClose} />
        </div>
      </div>
    </div>
  );
}
