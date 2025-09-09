"use client";

import { useFormik } from "formik";
import { LoginInitialValues, LoginValidationSchema } from "@/validators/LoginSchema";
import { FcGoogle } from "react-icons/fc";

export default function FormLogin() {
  const formik = useFormik({
    initialValues: LoginInitialValues,
    validationSchema: LoginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log("Login submitted with values:", values);
      // TODO: integra tu login real
      setTimeout(() => setSubmitting(false), 600);
    },
  });

  const inputBase =
    "w-full h-12 px-4 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/60 outline-none focus:border-white/40 transition";
  const labelBase = "block text-sm font-medium text-white";
  const errorText = "mt-1 text-[13px] text-red-300";

  return (
    <main className="min-h-[calc(100dvh-0px)] w-full flex items-center justify-center px-4 py-10 bg-[linear-gradient(to_right,rgba(28,22,62,.9)_0%,rgba(116,53,150,.85)_40%,rgba(116,53,150,.85)_60%,rgba(28,22,62,.9)_100%)]">
      <section className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,.35)] p-6 sm:p-8">
          {/* Header */}
          <header className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">Iniciar sesión</h1>
            <p className="mt-1 text-sm text-white/80">Bienvenido de nuevo a Insspira</p>
          </header>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className={labelBase}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={(e) => formik.setFieldValue("email", e.target.value.trimStart())}
                onBlur={formik.handleBlur}
                placeholder="tu@correo.com"
                className={inputBase}
                aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
              />
              {formik.touched.email && formik.errors.email && (
                <p className={errorText}>{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className={labelBase}>
                Contraseña
              </label>
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
              {formik.touched.password && formik.errors.password && (
                <p className={errorText}>{formik.errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="mt-2 w-full h-12 rounded-xl font-semibold bg-[var(--color-morado)] text-white border border-white/10 shadow disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-95 active:scale-[0.99] transition"
            >
              {formik.isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>

            {/* Divider */}
            <div className="relative my-3">
              <div className="h-px bg-white/10" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-transparent px-2 text-[11px] text-white/60">
                o
              </span>
            </div>

            {/* Google Sign-in */}
            <button
              type="button"
              onClick={() => {
                // TODO: integra Google OAuth real
                console.log("Login con Google");
              }}
              className="w-full h-12 rounded-xl bg-white text-[var(--color-violeta)] font-medium border border-white/20 hover:opacity-95 active:scale-[0.99] transition inline-flex items-center justify-center gap-2"
            >
              <FcGoogle className="text-xl" />
              Iniciar sesión con Google
            </button>
          </form>
        </div>

        {/* Footer mini */}
        <p className="mt-4 text-center text-sm text-white/80">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="underline underline-offset-4 decoration-white/40 hover:decoration-white">
            Regístrate
          </a>
        </p>
      </section>
    </main>
  );
}
