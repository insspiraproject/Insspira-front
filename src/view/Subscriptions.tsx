'use client'
import React from "react";

const Subscriptions = ()=> {
  return (
    
    <div className="w-full min-h-screen flex justify-center items-center bg-[var(--color-violeta)] px-4 py-8 gap-8">
      <style jsx>{`
        @property --border-angle {
          syntax: "<angle>";
          inherits: true;
          initial-value: 0deg;
        }

        @keyframes border-spin {
          100% {
            --border-angle: 360deg;
          }
        }

        .animate-border {
          animation: border-spin 6s linear infinite;
        }
      `}</style>

      <div className="relative w-80 p-[4px] rounded-2xl animate-border [background:conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,theme(colors.teal.500)_86%,theme(colors.cyan.300)_90%,theme(colors.teal.500)_94%,theme(colors.slate.600/.48))]">
        
        <div className="bg-[var(--color-gris)] rounded-2xl shadow-md p-6 flex flex-col justify-between hover:scale-105 transition-transform ">
          <h2 className="text-2xl font-bold mb-4 text-center">Monthly</h2>
          <p className="text-gray-600 mb-6 text-center">Pay month-to-month</p>
          <p className="text-3xl font-semibold mb-6 text-center">$10 / month</p>
          <ul className="mb-6 space-y-2">
            <li>✔ Access to all content</li>
            <li>✔ Some premium features</li>
          </ul>
          <button className="w-full bg-[var(--color-morado)] text-white py-2 rounded-full hover:bg-[var(--color-rosa)] transition-colors">
            Choose Monthly
          </button>
        </div>
      </div>


        <div className="relative w-80 p-[4px] rounded-2xl animate-border [background:conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,theme(colors.teal.500)_86%,theme(colors.cyan.300)_90%,theme(colors.teal.500)_94%,theme(colors.slate.600/.48))]">
         <div className="bg-[var(--color-gris)] rounded-2xl shadow-md p-6 flex flex-col justify-between hover:scale-105 transition-transform">
      <h2 className="text-2xl font-bold mb-4 text-center">Annual</h2>
      <p className="text-gray-600 mb-6 text-center">Save 20% with yearly payment</p>
      <p className="text-3xl font-semibold mb-6 text-center">$100 / year</p>
      <ul className="mb-6 space-y-2">
        <li>✔ Access to all content</li>
        <li>✔ All premium features</li>
      </ul>
      <button className="w-full bg-[var(--color-morado)] text-white py-2 rounded-full hover:bg-[var(--color-rosa)] transition-colors">
        Choose Annual
      </button>
    </div>
 

</div>
    </div>
  )

}



 export default Subscriptions