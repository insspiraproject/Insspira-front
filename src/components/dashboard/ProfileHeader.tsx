"use client";

import { FiMail, FiCalendar, FiEdit2 } from "react-icons/fi";
import type { UserProfile } from "@/mocks/userMocks";
import Image from "next/image";

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

  return (
    <section className="w-full rounded-2xl bg-white/5 p-5 md:p-6 border border-white/10 shadow">
      <div className="flex items-center gap-4 md:gap-6">
        {/* contenedor cuadrado + fill => círculo perfecto */}
        <div className="relative group w-16 h-16 md:w-28 md:h-28">
          <Image
            src={u.avatar}
            alt={u.name}
            fill
            sizes="(min-width: 768px) 112px, 64px"
            className="rounded-full object-cover border border-white/20"
            priority={false}
          />
          <button
            onClick={onOpenAvatarEdit}
            className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition
                       bg-[var(--color-morado)] text-white p-2 rounded-full border border-white/20 shadow
                       hover:scale-105 focus:opacity-100"
            aria-label="Editar foto de perfil"
            title="Editar foto"
          >
            <FiEdit2 />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <h1 className="text-xl md:text-2xl font-semibold text-white">{u.name}</h1>
            <span className="text-sm md:text-base text-[var(--color-gris)]">@{u.username}</span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={onOpenEditInfo}
                className="text-sm md:text-base px-3 py-1.5 rounded-lg border border-white/20 text-white hover:border-white"
              >
                Editar información
              </button>
              <button
                onClick={onOpenSubscription}
                className="text-sm md:text-base px-3 py-1.5 rounded-lg bg-[var(--color-morado)] text-white hover:opacity-90"
              >
                Ver suscripción
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
              <span>Desde {new Date(u.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-blanco)]">
              <span>
                <strong>{u.postsCount}</strong> publicaciones
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
