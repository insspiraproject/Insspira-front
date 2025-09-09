"use client";

import { useState } from "react";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import Tabs from "@/components/dashboard/Tabs";
import MasonryGrid from "@/components/dashboard/MasonryGrid";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";
import ImageEditModal from "@/components/dashboard/ImageEditModal";
import ProfileEditModal from "@/components/dashboard/ProfileEditModal"; // <-- NUEVO
import {
  currentUser as initialUser,
  currentUserLikedPosts,
  currentUserPosts,
  type UserProfile,
} from "@/mocks/userMocks";

export default function DashboardView() {
  const [active, setActive] = useState<"posts" | "likes">("posts");
  const [showSub, setShowSub] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showEdit, setShowEdit] = useState(false); // <-- NUEVO
  const [user, setUser] = useState<UserProfile>(initialUser);

  const counts = {
    posts: currentUserPosts.length,
    likes: currentUserLikedPosts.length,
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <ProfileHeader
        user={user}
        onOpenSubscription={() => setShowSub(true)}
        onOpenAvatarEdit={() => setShowAvatar(true)}
        onOpenEditInfo={() => setShowEdit(true)} // <-- NUEVO
      />

      {/* --- Quitamos el formulario inline --- */}
      {/* <ProfileEditForm value={user} onChange={(u) => setUser(u)} /> */}

      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg md:text-xl font-semibold">
          {active === "posts" ? "Tus publicaciones" : "Tus Me gusta"}
        </h2>
        <Tabs active={active} onChange={setActive} counts={counts} />
      </div>

      <MasonryGrid items={active === "posts" ? currentUserPosts : currentUserLikedPosts} />

      <SubscriptionModal
        open={showSub}
        onClose={() => setShowSub(false)}
        subscription={user.subscription}
        payments={user.payments}
      />

      <ImageEditModal
        open={showAvatar}
        onClose={() => setShowAvatar(false)}
        currentUrl={user.avatar}
        onSave={(url) => setUser((prev) => ({ ...prev, avatar: url }))}
      />

      <ProfileEditModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        value={user}
        onChange={(u) => setUser(u)}
      />
    </div>
  );
}
