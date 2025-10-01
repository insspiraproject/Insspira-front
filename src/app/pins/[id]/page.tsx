// src/app/pins/[id]/page.tsx  (o pages/pins/[id].tsx si usas pages)
'use client';
import { useEffect, useState } from 'react';
import { getPinById } from '@/services/pins.services';
import { notFound, useParams } from 'next/navigation';

export default function PinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pin, setPin] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const p = await getPinById(id);
      setPin(p);
    })();
  }, [id]);

  if (!pin) return <div className="text-white p-6">Loading…</div>;
  // render bonito aquí
  return (
    <main className="p-6 text-white">
      <img src={pin.image} alt="" className="max-w-full rounded-xl" />
      <h1 className="mt-4 text-2xl font-semibold">{pin.name}</h1>
      <p className="mt-2">{pin.description}</p>
      {/* likes/views */}
    </main>
  );
}
