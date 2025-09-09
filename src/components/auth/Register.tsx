"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import {
  RegisterFormValues,
  RegisterInitialValues,
  RegisterValidationSchema,
} from "@/validators/RegisterSchema";
import { RegisterUser } from "@/services/authservice";

export default function RegisterComponent() {
  const router = useRouter();

  const formik = useFormik<RegisterFormValues>({
    initialValues: RegisterInitialValues,
    validationSchema: RegisterValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await RegisterUser(values);
        if (!res) return; // el servicio ya avisa con toast

        // Si tu backend devuelve token/usuario, puedes guardarlos aquí:
        if (res.token) localStorage.setItem("token", res.token);
        if (res.user) localStorage.setItem("user", JSON.stringify(res.user));

        router.push("/home"); // o "/dashboard"
      } catch (err) {
        console.error("❌ Error en registro:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const inputBase =
    "w-full h-12 px-4 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/60 outline-none focus:border-white/40 transition";
  const labelBase = "block text-sm font-medium text-white";
  const errorText = "mt-1 text-[13px] text-red-300";

  return (
    <main className="min-h-[calc(100dvh-0px)] w-full flex items-center justify-center px-4 py-10 bg-[linear-gradient(to_right,rgba(28,22,62,.9)_0%,rgba(116,53,150,.85)_40%,rgba(116,53,150,.85)_60%,rgba(28,22,62,.9)_100%)]">
      <section className="w-full max-w-md">
        <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,.35)] p-6 sm:p-8">
          <header className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">Crear cuenta</h1>
            <p className="mt-1 text-sm text-white/80">Únete a Insspira</p>
          </header>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className={labelBase}>Nombre y apellido</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Nombre y apellido"
                className={inputBase}
              />
              {formik.touched.name && formik.errors.name && (
                <p className={errorText}>{formik.errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className={labelBase}>Nombre de usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Tu nombre de usuario"
                className={inputBase}
              />
              {formik.touched.username && formik.errors.username && (
                <p className={errorText}>{formik.errors.username}</p>
              )}
            </div>

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
                placeholder="tu@correo.com"
                className={inputBase}
              />
              {formik.touched.email && formik.errors.email && (
                <p className={errorText}>{formik.errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={labelBase}>Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                className={inputBase}
              />
              {formik.touched.password && formik.errors.password && (
                <p className={errorText}>{formik.errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className={labelBase}>Confirma tu contraseña</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                className={inputBase}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className={errorText}>{formik.errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="mt-2 w-full h-12 rounded-xl font-semibold bg-[var(--color-morado)] text-white border border-white/10 shadow disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-95 active:scale-[0.99] transition"
            >
              {formik.isSubmitting ? "Creando..." : "Crear cuenta"}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-white/80">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="underline underline-offset-4 decoration-white/40 hover:decoration-white">
            Inicia sesión
          </a>
        </p>
      </section>
    </main>
  );
}
