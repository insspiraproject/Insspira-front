"use client";

import Script from "next/script";

export default function ChatBot() {
  return (
    <>
      {/* Inyector del webchat */}
      <Script
        src="https://cdn.botpress.cloud/webchat/v3.2/inject.js"
        strategy="afterInteractive"
      />
      {/* Config del bot (tu archivo generado por Botpress) */}
      <Script
        src="https://files.bpcontent.cloud/2025/09/09/12/20250909123311-854Q79HQ.js"
        strategy="afterInteractive"
      />
    </>
  );
}
