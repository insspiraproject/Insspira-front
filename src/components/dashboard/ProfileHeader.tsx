//src/components/dashboard/ProfileHeader.tsx
"use client";

import { FiMail, FiCalendar, FiEdit2 } from "react-icons/fi";
import type { UserProfile } from "@/types/ui";
import Image from "next/image";

/* ---- helpers ---- */
function placeholderAvatar(name?: string | null, email?: string | null) {
  const base = (name || email || "User").trim();
  const initial = base ? base[0]!.toUpperCase() : "U";
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
  <rect width="100%" height="100%" fill="#6B46C1"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
        font-size="72" fill="#ffffff" font-family="Inter,Arial,Helvetica,sans-serif">${initial}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function safeDateLabel(v?: string | null) {
  if (!v) return "—";
  const t = Date.parse(v);
  if (Number.isNaN(t)) return "—";
  return new Date(t).toLocaleDateString();
}
/* ---- /helpers ---- */

export default function ProfileHeader({
  user,
  onOpenSubscription,
  onOpenAvatarEdit,
  onOpenEditInfo,
}: {
  user: UserProfile;
  onOpenSubscription: () => void;
  onOpenAvatarEdit: () => void;
  onOpenEditInfo: () => void;
}) {
  const u = user;
  const src =
    typeof u.avatar === "string" && u.avatar.trim().length > 0
      ? u.avatar
      : placeholderAvatar(u.name, u.email);

  return (
    <section className="w-full rounded-2xl bg-white/5 p-5 md:p-6 border border-white/10 shadow">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative group w-16 h-16 md:w-28 md:h-28">
          <Image
            src={src}
            alt={u.name}
            fill
            sizes="(min-width: 768px) 112px, 64px"
            className="rounded-full object-cover border border-white/20"
            priority={false}
            unoptimized={src.startsWith("data:")} // evita optimización en data URI
          />
          <button
            onClick={onOpenAvatarEdit}
            className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition
                       bg-[var(--color-morado)] text-white p-2 rounded-full border border-white/20 shadow
                       hover:scale-105 focus:opacity-100"
            aria-label="Edit profile picture"
            title="Edit photo"
          >
            <FiEdit2 />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <h1 className="text-xl md:text-2xl font-semibold text-white">{u.name}</h1>
            {u.username && <span className="text-sm md:text-base text-[var(--color-gris)]">@{u.username}</span>}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={onOpenEditInfo}
                className="text-sm md:text-base px-3 py-1.5 rounded-lg border border-white/20 text-white hover:border-white"
              >
                Edit info
              </button>
              <button
                onClick={onOpenSubscription}
                className="text-sm md:text-base px-3 py-1.5 rounded-lg bg-[var(--color-morado)] text-white hover:opacity-90"
              >
                View subscription
              </button>
            </div>
          </div>

          {u.bio && (
            <p className="mt-2 text-sm md:text-base text-[var(--color-blanco)]/80">{u.bio}</p>
          )}

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm md:text-base">
            <div className="flex items-center gap-2 text-[var(--color-blanco)]">
              <FiMail />
              <span>{u.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-blanco)]">
              <FiCalendar />
              <span>Member since {safeDateLabel(u.joinDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-blanco)]">
              <span>
                <strong>{u.postsCount}</strong> posts
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
