// src/components/dashboard/Tabs.tsx
"use client";

type TabKey = "posts" | "likes";

export default function Tabs({
  active,
  onChange,
  counts,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
  counts: { posts: number; likes: number };
}) {
  const btn =
    "px-4 py-2 rounded-full text-sm md:text-base border transition";
  const activeCls =
    "bg-white text-[var(--color-violeta)] border-white";
  const inactiveCls =
    "bg-transparent text-white border-white/20 hover:border-white/40";

  return (
    <div className="flex items-center gap-3">
      <button
        className={`${btn} ${active === "posts" ? activeCls : inactiveCls}`}
        onClick={() => onChange("posts")}
      >
        Publicaciones ({counts.posts})
      </button>
      <button
        className={`${btn} ${active === "likes" ? activeCls : inactiveCls}`}
        onClick={() => onChange("likes")}
      >
        Me gusta ({counts.likes})
      </button>
    </div>
  );
}
