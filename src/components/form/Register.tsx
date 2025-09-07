"use client"

//importaciones
import { useFormik } from "formik"
import {
  RegisterFormValues,
  RegisterInitialValues,
  RegisterValidationSchema,
} from "@/validators/RegisterSchema"

//logica formulario
export default function RegisterComponent() {
  const formik = useFormik<RegisterFormValues>({
    initialValues: RegisterInitialValues,
    validationSchema: RegisterValidationSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log("Register submitted with values:", values)
      setTimeout(() => setSubmitting(false), 500)
    },
  })


 //html formulario
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden 
      bg-[radial-gradient(60%40%_at_50%-10%,#1b2b44_0%,#0e1a2a_100%)] text-slate-100"
    >
      <div
        aria-hidden
        className="absolute inset-0 -z-10 
        bg-[repeating-linear-gradient(180deg,transparent,transparent_120px,#2d215c_120px,#2d215c_220px)] 
        opacity-60"
      />

      <div
        className="relative w-[866px] max-w-[92vw] h-[864px] max-h-[92vh] 
        rounded-[15px] bg-[#121E32] shadow-[2px_2px_33px_10px_rgba(74,74,74,0.99)] 
        overflow-hidden grid grid-cols-[1fr_minmax(300px,351px)] 
        transform-gpu origin-center 
        xl:scale-100 lg:scale-[0.95] md:scale-[0.9] sm:scale-[0.85]"
      >
        <div className="h-full p-8 md:p-10 overflow-y-auto">
          <h1
            className="w-[320px] h-[104px] mx-auto text-center 
            text-[34px] leading-[52px] font-semibold text-slate-200 mb-6"
          >
            Crear cuenta
          </h1>

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-base font-semibold">
                Nombre y apellido:
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-12 rounded-lg px-4 bg-[#DEDEDE] 
                text-black placeholder-black/60 outline-none 
                ring-2 ring-transparent focus:ring-indigo-400"
                placeholder="Nombre y apellido"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-400 text-sm">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="block text-base font-semibold">
                Nombre de usuario:
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-12 rounded-lg px-4 bg-[#DEDEDE] 
                text-black placeholder-black/60 outline-none 
                ring-2 ring-transparent focus:ring-indigo-400"
                placeholder="Tu nombre de usuario"
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-400 text-sm">{formik.errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-base font-semibold">
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-12 rounded-lg px-4 bg-[#DEDEDE] 
                text-black placeholder-black/60 outline-none 
                ring-2 ring-transparent focus:ring-indigo-400"
                placeholder="tu@correo.com"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-400 text-sm">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-base font-semibold">
                Contraseña:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-12 rounded-lg px-4 bg-[#DEDEDE] 
                text-black placeholder-black/60 outline-none 
                ring-2 ring-transparent focus:ring-indigo-400"
                placeholder="••••••••"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-400 text-sm">{formik.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-base font-semibold"
              >
                Confirma tu contraseña:
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full h-12 rounded-lg px-4 bg-[#DEDEDE] 
                text-black placeholder-black/60 outline-none 
                ring-2 ring-transparent focus:ring-indigo-400"
                placeholder="••••••••"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-400 text-sm">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
              className="mt-12 w-40 h-12 rounded-lg font-semibold 
              bg-[var(--morado)] text-white shadow-[inset_6px_6px_24px_rgba(0,0,0,0.28)] 
              hover:brightness-110 active:scale-[0.99] 
              disabled:opacity-50 disabled:cursor-not-allowed 
              transition mx-auto block"
            >
              {formik.isSubmitting ? "Creando..." : "Crear cuenta"}
            </button>
          </form>
        </div>

        <div
          className="h-full p-8 md:p-10 bg-[#121E32] border-l-[2px] border-l-[#424040] 
          rounded-tr-[15px] rounded-br-[15px] box-border"
        >
          <h2 className="text-[28px] font-medium text-slate-200 text-center mb-8">
            También podés registrarte con:
          </h2>

          <div
            className="mx-auto w-[260px] h-[360px] rounded-xl bg-white 
            shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>
    </div>
  )
}