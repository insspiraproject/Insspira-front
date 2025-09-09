// src/components/admin/AdminProfileCard.tsx
"use client";

import { adminProfile } from "@/mocks/adminMocks";
import Image from "next/image";

export default function AdminProfileCard() {
  const a = adminProfile;
  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-4 text-white flex items-center gap-4">
      <Image
        width={64}
        height={64}
        src={a.avatar}
        alt={a.name}
        className="size-16 rounded-full object-cover border border-white/20"
      />
      <div>
        <div className="text-lg font-semibold">{a.name}</div>
        <div className="text-sm opacity-80">{a.email}</div>
        <div className="text-sm mt-1">
          Rol: <span className="font-medium">{a.role}</span> · Desde{" "}
          {new Date(a.since).toLocaleDateString()}
        </div>
      </div>
    </section>
  );
}
