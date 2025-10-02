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
import type { UserProfile, Post, UISubscription, UIPayment } from '@/types/ui';

import {
  fetchUserPins,
  fetchUserLikedPins,
  type UIPost,
  getAvatarSignature,
  uploadAvatarToCloudinary,
  setProfilePicture,
  type BackendUser,
  fetchSubscriptionStatus,
  fetchPaymentHistory,
  type SubStatusResponse,
} from '@/services/dashboard';

type APIUser = BackendUser;
type PlanLike = string | { type?: string; features?: string[] | string } | null | undefined;

const API = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');

/* ===== Helpers de UI ===== */
function toIsoStringSafe(v: string | Date | null | undefined): string | undefined {
  if (!v) return undefined;
  try {
    const d = v instanceof Date ? v : new Date(v);
    return d.toISOString();
  } catch {
    return undefined;
  }
}

function uiPostToUI(p: UIPost): Post {
  return {
    id: p.id,
    title: p.title,
    imageUrl: p.imageUrl,
    stats: { likes: p.stats.likes, views: p.stats.views },
    createdAt: p.createdAt,
    tags: p.tags ?? [],
  };
}

function isPlanObject(p: PlanLike): p is { type?: string; features?: string[] | string } {
  return !!p && typeof p === 'object';
}

function mapStatusToUISubscription(
  status: SubStatusResponse | null,
  history: Awaited<ReturnType<typeof fetchPaymentHistory>>
): UISubscription {
  const latest = history?.[0];

  const rawType =
    (typeof status?.plan === 'string' && status?.plan) ||
    (isPlanObject(status?.plan) ? status?.plan?.type : undefined) ||
    (latest?.description ?? '').toLowerCase();

  let plan: UISubscription['plan'] = 'Free';
  if (rawType?.includes('annual')) plan = 'Business';
  else if (rawType?.includes('monthly')) plan = 'Pro';
  else if (rawType?.includes('free')) plan = 'Free';

  const normalizedStatus: UISubscription['status'] =
    status?.hasActivePayment ? 'active' : plan === 'Free' ? 'active' : 'past_due';

  const featuresFromPlan =
    isPlanObject(status?.plan)
      ? Array.isArray(status.plan.features)
        ? status.plan.features
        : typeof status.plan.features === 'string'
          ? status.plan.features
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : []
      : status?.benefits?.features ?? [];

  const pricePerMonth: number =
    typeof latest?.usdPrice === 'number'
      ? latest.usdPrice
      : plan === 'Pro'
        ? 10
        : plan === 'Business'
          ? 100
          : 0;

  const currency: UISubscription['currency'] = 'USD';

  return {
    plan,
    status: normalizedStatus,
    startedAt: latest?.startsAt ?? new Date().toISOString(),
    renewsAt: status?.hasActivePayment ? status?.endsAt : undefined,
    pricePerMonth,
    currency,
    features: featuresFromPlan.length ? featuresFromPlan : ['10 pins/month', 'Basic search'],
  };
}

function mapHistoryToUIPayments(history: Awaited<ReturnType<typeof fetchPaymentHistory>>): UIPayment[] {
  return (history ?? []).map((p) => {
    const method: UIPayment['method'] = 'CARD';
    const status = p.status as UIPayment['status'];
    return {
      id: String(p.id),
      date: p.date,
      description: p.description,
      method,
      status,
      amount: p.usdPrice,
      currency: 'USD',
    };
  });
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

  const id = authUser?.id;
  const name = authUser?.name;
  const email = authUser?.email;

  useEffect(() => {
    // Evitamos depender de todo el objeto authUser:
    console.log("[DashboardView] auth:", { isHydrated, isAuthenticated, id, name });

    if (!isHydrated || !isAuthenticated || !id) return;

    (async () => {
      try {
        // 1) datos del usuario
        let backendUser: APIUser | null = null;
        const res = await authFetch(`${API}/users/${id}`);
        if (res.ok) backendUser = (await res.json()) as APIUser;

        const baseUser: UserProfile = {
          id: backendUser?.id ?? id,
          name: backendUser?.name ?? name ?? email ?? '',
          username: backendUser?.username ?? null,
          email: backendUser?.email ?? email ?? '',
          avatar: backendUser?.profilePicture ?? "",
          bio: backendUser?.biography ?? "",
          joinDate: toIsoStringSafe(backendUser?.createdAt) ?? "",
          postsCount: typeof backendUser?.pinsCount === 'number' ? backendUser.pinsCount : 0,
          subscription: {
            plan: "Free",
            status: "active",
            startedAt: new Date().toISOString(),
            pricePerMonth: 0,
            currency: "USD",
            features: ['10 pins/month', 'Basic search'],
          },
          payments: [],
        };

        // 2) posts propios + likes
        const [p, l] = await Promise.all([
          fetchUserPins(baseUser.id),
          fetchUserLikedPins(baseUser.id),
        ]);

        const pUi = p.map(uiPostToUI);
        const lUi = l.map(uiPostToUI);

        // 3) suscripción/pagos
        const [status, history] = await Promise.all([
          fetchSubscriptionStatus(baseUser.id),
          fetchPaymentHistory(baseUser.id),
        ]);

        const subUI = mapStatusToUISubscription(status, history);
        const payUI = mapHistoryToUIPayments(history);

        setUser({
          ...baseUser,
          postsCount: pUi.length,
          subscription: subUI,
          payments: payUI,
        });
        setPosts(pUi);
        setLiked(lUi);

      } catch {
        setUser({
          id: id,
          name: name ?? email ?? '',
          username: null,
          email: email ?? '',
          avatar: "",
          bio: "",
          joinDate: new Date().toISOString(),
          postsCount: 0,
          subscription: {
            plan: "Free",
            status: "active",
            startedAt: new Date().toISOString(),
            pricePerMonth: 0,
            currency: "USD",
            features: ['10 pins/month', 'Basic search'],
          },
          payments: [],
        });
        setPosts([]);
        setLiked([]);
        const dismissed = localStorage.getItem('fallback_notice_dismissed') === '1';
        if (!dismissed) setShowNotice(true);
      }
    })();
  }, [isHydrated, isAuthenticated, id, name, email, authFetch]);

  if (!isHydrated) return null;
  if (!user) return <div className="text-white p-6">Loading…</div>;

  const counts = { posts: posts.length, likes: liked.length };

  const handleSaveAvatar = async (file: File) => {
    try {
      const sig = await getAvatarSignature(user.id);
      const { secure_url, public_id } = await uploadAvatarToCloudinary(file, sig);
      const updated = await setProfilePicture(user.id, public_id);
      setUser((prev) =>
        prev ? { ...prev, avatar: updated.profilePicture ?? secure_url ?? prev.avatar } : prev
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
        onSave={handleSaveAvatar}
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
