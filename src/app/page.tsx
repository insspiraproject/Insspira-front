// src/app/page.tsx

import Landing from "@/components/landing";


export default async function Home() {

  return (
     <main className="w-full h-full flex items-center justify-center bg-[var(--violeta)]"> 
      <Landing />
    </main>
  );
}