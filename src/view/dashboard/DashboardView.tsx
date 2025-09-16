"use client";

import { useEffect, useState } from "react";
import ProfileHeader from "@/components/dashboard/ProfileHeader";
import Tabs from "@/components/dashboard/Tabs";
import MasonryGrid from "@/components/dashboard/MasonryGrid";
import SubscriptionModal from "@/components/dashboard/SubscriptionModal";
import ImageEditModal from "@/components/dashboard/ImageEditModal";
import ProfileEditModal from "@/components/dashboard/ProfileEditModal";
import DataFallbackNotice from "@/components/dashboard/DataFallbackNotice";
import { useAuth } from "@/context/AuthContext";

import {
  currentUser as mockUser,
  currentUserLikedPosts,
  currentUserPosts,
  type UserProfile,
} from "@/mocks/userMocks";

const API =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");

export default function DashboardView() {
  const { isHydrated, isAuthenticated, user: authUser, authFetch } = useAuth();

  const [active, setActive] = useState<"posts" | "likes">("posts");
  const [showSub, setShowSub] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  // Cargar datos reales (si existen) y completar con mocks
  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !authUser?.id) return;

    (async () => {
      try {
        let backendUser: any | null = null;
        const res = await authFetch(`${API}/users/${authUser.id}`);
        if (res.ok) backendUser = await res.json();

        const merged: UserProfile = {
          // FALTABA EL ID
          id: backendUser?.id ?? authUser?.id ?? mockUser.id,

          // básicos
          name: backendUser?.name ?? authUser?.name ?? mockUser.name,
          username: backendUser?.username ?? mockUser.username,
          email: backendUser?.email ?? authUser?.email ?? mockUser.email,

          // opcionales con fallback
          avatar: backendUser?.avatar ?? mockUser.avatar,
          bio: backendUser?.bio ?? mockUser.bio,
          joinDate: backendUser?.createdAt ?? mockUser.joinDate,
          postsCount:
            typeof backendUser?.pinsCount === "number"
              ? backendUser.pinsCount
              : mockUser.postsCount,

          // aún sin API real → mantener mock
          subscription: mockUser.subscription,
          payments: mockUser.payments,
        };

        setUser(merged);

        // Detectar si usamos algún fallback de mock
        const usingFallback =
          !backendUser?.avatar ||
          !backendUser?.bio ||
          !backendUser?.createdAt ||
          backendUser?.pinsCount == null;

        const dismissed = localStorage.getItem("fallback_notice_dismissed") === "1";
        if (usingFallback && !dismissed) setShowNotice(true);
      } catch {
        // si falló la API, usar mock pero respetar lo que sabemos del authUser
        setUser({
          ...mockUser,
          name: authUser?.name ?? mockUser.name,
          email: authUser?.email ?? mockUser.email,
        });
        const dismissed = localStorage.getItem("fallback_notice_dismissed") === "1";
        if (!dismissed) setShowNotice(true);
      }
    })();
  }, [isHydrated, isAuthenticated, authUser?.id, authUser?.name, authUser?.email, authFetch]);

  if (!isHydrated) return null;
  if (!user) return <div className="text-white p-6">Loading…</div>;

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
        onOpenEditInfo={() => setShowEdit(true)}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-white text-lg md:text-xl font-semibold">
          {active === "posts" ? "Your Posts" : "Your Likes"}
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
        onSave={(url) => setUser((prev) => (prev ? { ...prev, avatar: url } : prev))}
      />

      <ProfileEditModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        value={user}
        onChange={(u) => setUser(u)}
      />

      <DataFallbackNotice
        open={showNotice}
        onClose={() => {
          setShowNotice(false);
          localStorage.setItem("fallback_notice_dismissed", "1");
        }}
      />
    </div>
  );
}
