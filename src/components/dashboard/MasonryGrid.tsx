// src/components/dashboard/MasonryGrid.tsx
"use client";

import { Post } from "@/mocks/userMocks";
import PostCard from "./PostCard";

export default function MasonryGrid({ items }: { items: Post[] }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {items.map((p) => (
        <div key={p.id} className="break-inside-avoid">
          <PostCard post={p} />
        </div>
      ))}
    </div>
  );
}
