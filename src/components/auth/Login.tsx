// src/components/auth/Login.tsx
"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { LoginInitialValues, LoginValidationSchema } from "@/validators/LoginSchema";
import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function FormLogin() {
  const router = useRouter();
  const { login, isHydrated, user } = useAuth();

  // fallback por si el re-render del contexto no llegó aún
  const getRoleFromStorage = (): "admin" | "user" | undefined => {
    try {
      const raw = localStorage.getItem("auth:user");
      if (!raw) return undefined;
      const parsed = JSON.parse(raw) as { role?: "admin" | "user" };
      return parsed.role;
    } catch {
      return undefined;
    }
  };

  const formik = useFormik({
    initialValues: LoginInitialValues,
    validationSchema: LoginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const ok = await login(values);
        if (ok) {
          const role = user?.role ?? getRoleFromStorage();
          router.push(role === "admin" ? "/admin" : "/dashboard"); // <-- antes "/dashboard/admin" y "/home"
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (!isHydrated) return null; // evita parpadeo

  const inputBase =
    "w-full h-12 px-4 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/60 outline-none focus:border-white/40 transition";
  const labelBase = "block text-sm font-medium text-white";
  const errorText = "mt-1 text-[13px] text-red-300";

  return (
    <main className="min-h-[calc(100dvh-0px)] w-full flex items-center justify-center px-4 py-10 bg-[linear-gradient(to_right,rgba(28,22,62,.9)_0%,rgba(116,53,150,.85)_40%,rgba(116,53,150,.85)_60%,rgba(28,22,62,.9)_100%)]">
      <section className="w-full max-w-md">
        {/* Back button */}
        <div className="mb-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/20 text-white hover:border-white/40 text-sm"
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,.35)] p-6 sm:p-8">
          <header className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">Log in</h1>
            <p className="mt-1 text-sm text-white/80">Welcome back to Insspira</p>
          </header>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className={labelBase}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={(e) => formik.setFieldValue("email", e.target.value.trimStart())}
                onBlur={formik.handleBlur}
                placeholder="you@email.com"
                className={inputBase}
                aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
              />
              {formik.touched.email && formik.errors.email && <p className={errorText}>{formik.errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className={labelBase}>Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={(e) => formik.setFieldValue("password", e.target.value)}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                className={inputBase}
                aria-invalid={Boolean(formik.touched.password && formik.errors.password)}
              />
              {formik.touched.password && formik.errors.password && <p className={errorText}>{formik.errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="mt-2 w-full h-12 rounded-xl font-semibold bg-[var(--color-morado)] text-white border border-white/10 shadow disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-95 active:scale-[0.99] transition"
            >
              {formik.isSubmitting ? "Logging in..." : "Log in"}
            </button>

            <div className="relative my-3">
              <div className="h-px bg-white/10" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-transparent px-2 text-[11px] text-white/60">or</span>
            </div>

            <button
              type="button"
              onClick={() => {
                // window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google`;
                console.log("Login with Google");
              }}
              className="w-full h-12 rounded-xl bg-white text-[var(--color-violeta)] font-medium border border-white/20 hover:opacity-95 active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-xl" />
              Log in with Google
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-white/80">
          Don’t have an account?{" "}
          <a href="/register" className="underline underline-offset-4 decoration-white/40 hover:decoration-white">
            Sign up
          </a>
        </p>
      </section>
    </main>
  );
}
