// src/components/dashboard/PostCard.tsx
"use client";

import { Post } from "@/mocks/userMocks";
import { FiHeart, FiEye } from "react-icons/fi";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-auto object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/40 flex items-end">
        <div className="w-full p-3 text-white">
          <h3 className="text-sm font-medium line-clamp-1">{post.title}</h3>
          <div className="mt-2 flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-1">
              <FiHeart /> {post.stats.likes}
            </span>
            <span className="inline-flex items-center gap-1">
              <FiEye /> {post.stats.views}
            </span>
            <span className="ml-auto text-xs opacity-80">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
