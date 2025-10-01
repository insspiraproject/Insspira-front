// src/app/pins/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { getPinById } from '@/services/pins.services';
import { useParams } from 'next/navigation';
import Image from 'next/image';

// Deriva el tipo real que devuelve tu servicio (sin null)
type Pin = NonNullable<Awaited<ReturnType<typeof getPinById>>>;

export default function PinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pin, setPin] = useState<Pin | null>(null);

  useEffect(() => {
    (async () => {
      const p = await getPinById(id);
      setPin(p); // ← sin cast
    })();
  }, [id]);

  if (!pin) return <div className="text-white p-6">Loading…</div>;

  return (
    <main className="p-6 text-white">
      <div className="relative w-full max-w-3xl">
        <Image
          src={pin.image}
          alt={pin.name ?? 'Pin image'}
          width={1200}
          height={800}
          className="h-auto w-full rounded-xl"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      <h1 className="mt-4 text-2xl font-semibold">{pin.name ?? 'Untitled'}</h1>
      <p className="mt-2">{pin.description ?? ''}</p>
    </main>
  );
}
