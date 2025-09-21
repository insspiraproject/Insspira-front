// src/view/dashboard/DashboardView.tsx
'use client';

import { useEffect, useState } from 'react';
import ProfileHeader from '@/components/dashboard/ProfileHeader';
import Tabs from '@/components/dashboard/Tabs';
import MasonryGrid from '@/components/dashboard/MasonryGrid';
import SubscriptionModal from '@/components/dashboard/SubscriptionModal';
import ImageEditModal from '@/components/dashboard/ImageEditModal';
import ProfileEditModal from '@/components/dashboard/ProfileEditModal';
import DataFallbackNotice from '@/components/dashboard/DataFallbackNotice';
import { useAuth } from '@/context/AuthContext';

import {
  currentUser as mockUser,
  currentUserLikedPosts as mockLiked,
  currentUserPosts as mockPosts,
  type UserProfile,
  type Post, // <- tipo que exige tags: string[]
} from '@/mocks/userMocks';

import {
  fetchUserPins,
  fetchUserLikedPins,
  fetchUserPinsCount,
  type UIPost,
} from '@/services/dashboard';

type APIUser = {
  id: string;
  name?: string | null;
  username?: string | null;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: string | Date | null;
  pinsCount?: number | null;
};

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

function toIsoStringSafe(v: string | Date | null | undefined): string | undefined {
  if (!v) return undefined;
  try {
    const d = v instanceof Date ? v : new Date(v);
    return d.toISOString();
  } catch {
    return undefined;
  }
}

// ⬇️ ahora incluimos tags para satisfacer el tipo Post
function uiPostToMockPost(p: UIPost): Post {
  return {
    id: p.id,
    title: p.title,
    imageUrl: p.imageUrl,
    stats: { likes: p.stats.likes, views: p.stats.views },
    createdAt: p.createdAt,
    tags: p.tags ?? [], // <- clave para evitar el error TS
  };
}

export default function DashboardView() {
  const { isHydrated, isAuthenticated, user: authUser, authFetch } = useAuth();

  const [active, setActive] = useState<'posts' | 'likes'>('posts');
  const [showSub, setShowSub] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState<Post[]>([]);
  const [postsCount, setPostsCount] = useState<number>(0);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated || !authUser?.id) return;

    (async () => {
      try {
        // 1) datos del usuario
        let backendUser: APIUser | null = null;
        const res = await authFetch(`${API}/users/${authUser.id}`);
        if (res.ok) backendUser = (await res.json()) as APIUser;

        const merged: UserProfile = {
          id: backendUser?.id ?? authUser.id ?? mockUser.id,
          name: backendUser?.name ?? authUser.name ?? mockUser.name,
          username: backendUser?.username ?? mockUser.username,
          email: backendUser?.email ?? authUser.email ?? mockUser.email,
          avatar: backendUser?.avatar ?? mockUser.avatar,
          bio: backendUser?.bio ?? mockUser.bio,
          joinDate: toIsoStringSafe(backendUser?.createdAt) ?? mockUser.joinDate,
          postsCount:
            typeof backendUser?.pinsCount === 'number'
              ? backendUser.pinsCount
              : mockUser.postsCount,
          subscription: mockUser.subscription,
          payments: mockUser.payments,
        };
        setUser(merged);

        // 2) posts propios + likes + contador real
        try {
          const [p, l, c] = await Promise.all([
            fetchUserPins(merged.id),
            fetchUserLikedPins(merged.id),
            fetchUserPinsCount(merged.id),
          ]);
          setPosts(p.map(uiPostToMockPost));
          setLiked(l.map(uiPostToMockPost));
          setPostsCount(c);
        } catch {
          // fallback a mocks si falla la API de listados
          setPosts(mockPosts);
          setLiked(mockLiked);
          setPostsCount(merged.postsCount ?? mockUser.postsCount);
        }

        // 3) aviso de fallback si faltan campos
        const usingFallback =
          !backendUser?.avatar ||
          !backendUser?.bio ||
          !backendUser?.createdAt ||
          backendUser?.pinsCount == null;
        const dismissed = localStorage.getItem('fallback_notice_dismissed') === '1';
        if (usingFallback && !dismissed) setShowNotice(true);
      } catch {
        // si falla /users/:id
        setUser({
          ...mockUser,
          id: authUser?.id ?? mockUser.id,
          name: authUser?.name ?? mockUser.name,
          email: authUser?.email ?? mockUser.email,
        });
        setPosts(mockPosts);
        setLiked(mockLiked);
        setPostsCount(mockUser.postsCount);
        const dismissed = localStorage.getItem('fallback_notice_dismissed') === '1';
        if (!dismissed) setShowNotice(true);
      }
    })();
  }, [isHydrated, isAuthenticated, authUser?.id, authUser?.name, authUser?.email, authFetch]);

  if (!isHydrated) return null;
  if (!user) return <div className="text-white p-6">Loading…</div>;

  const counts = {
    posts: postsCount || posts.length,
    likes: liked.length,
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
          {active === 'posts' ? 'Your Posts' : 'Your Likes'}
        </h2>
        <Tabs active={active} onChange={setActive} counts={counts} />
      </div>

      <MasonryGrid items={active === 'posts' ? posts : liked} />

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
          localStorage.setItem('fallback_notice_dismissed', '1');
        }}
      />
    </div>
  );
}
