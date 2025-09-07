// src/app/page.tsx

import Landing from "@/components/Landing";


export default async function Home() {

  return (
    <main className="w-full h-max-screen flex items-center justify-center bg-[var(--color-violeta)]"> 
      <Landing />
    </main>
  );
}