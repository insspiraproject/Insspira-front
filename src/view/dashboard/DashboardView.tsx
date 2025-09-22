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
  type Post,
} from '@/mocks/userMocks';

import {
  fetchUserPins,
  fetchUserLikedPins,
  // fetchUserPinsCount, // opcional si confías en posts.length
  type UIPost,
  getCloudinarySignature,
  uploadAvatarToCloudinary,
  setProfilePicture,
  type BackendUser,
} from '@/services/dashboard';

type APIUser = BackendUser; // usamos los nombres reales del backend

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

function uiPostToMockPost(p: UIPost): Post {
  return {
    id: p.id,
    title: p.title,
    imageUrl: p.imageUrl,
    stats: { likes: p.stats.likes, views: p.stats.views },
    createdAt: p.createdAt,
    tags: p.tags ?? [],
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

          // 🔁 nombres correctos del backend
          avatar: backendUser?.profilePicture ?? mockUser.avatar,
          bio: backendUser?.biography ?? mockUser.bio,

          joinDate: toIsoStringSafe(backendUser?.createdAt) ?? mockUser.joinDate,

          // lo actualizaremos tras cargar posts reales
          postsCount:
            typeof backendUser?.pinsCount === 'number'
              ? backendUser.pinsCount
              : mockUser.postsCount,

          // de momento siguen mock
          subscription: mockUser.subscription,
          payments: mockUser.payments,
        };
        setUser(merged);

        // 2) posts propios + likes (reales)
        try {
          const [p, l] = await Promise.all([
            fetchUserPins(merged.id),
            fetchUserLikedPins(merged.id),
          ]);

          const pUi = p.map(uiPostToMockPost);
          const lUi = l.map(uiPostToMockPost);

          setPosts(pUi);
          setLiked(lUi);

          // 🔢 fuente de verdad = cantidad real obtenida
          setUser((prev) => (prev ? { ...prev, postsCount: pUi.length } : prev));
        } catch {
          // fallback a mocks si falla la API de listados
          setPosts(mockPosts);
          setLiked(mockLiked);
          setUser((prev) => (prev ? { ...prev, postsCount: mockUser.postsCount } : prev));
        }

        // 3) aviso de fallback si faltan campos clave
        const usingFallback =
          !backendUser?.profilePicture ||
          !backendUser?.biography ||
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
        const dismissed = localStorage.getItem('fallback_notice_dismissed') === '1';
        if (!dismissed) setShowNotice(true);
      }
    })();
  }, [isHydrated, isAuthenticated, authUser?.id, authUser?.name, authUser?.email, authFetch]);

  if (!isHydrated) return null;
  if (!user) return <div className="text-white p-6">Loading…</div>;

  const counts = {
    posts: posts.length, // 👈 contador real
    likes: liked.length,
  };

  // 🖼️ flujo para guardar avatar en backend
  const handleSaveAvatar = async (file: File) => {
    try {
      const sig = await getCloudinarySignature();
      const { secure_url, public_id } = await uploadAvatarToCloudinary(file, sig);
      const updated = await setProfilePicture(user.id, public_id); // backend devuelve User

      setUser((prev) =>
        prev
          ? {
              ...prev,
              // Preferimos el valor del backend, si no viene usamos secure_url
              avatar: updated.profilePicture ?? secure_url ?? prev.avatar,
            }
          : prev
      );
    } catch (e) {
      console.error('Error updating avatar:', e);
    }
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
        onSave={handleSaveAvatar} // 👈 ahora sube y guarda en backend
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
