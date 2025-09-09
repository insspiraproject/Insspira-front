import * as Yup from "yup";

// Valores del formulario
export interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginInitialValues: LoginFormValues = {
  email: "",
  password: "",
};

// Reglas reforzadas:
// - Email válido y sin espacios alrededor
// - Password:
//   • mínimo 8
//   • al menos 1 minúscula
//   • al menos 1 mayúscula
//   • al menos 1 número
//   • al menos 1 símbolo
//   • sin espacios
export const LoginValidationSchema = Yup.object({
  email: Yup.string()
    .transform((v) => (v ? v.trim() : "")) // recorta espacios
    .email("El email no es válido")
    .max(254, "El email es demasiado largo")
    .required("El email es obligatorio"),

  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[a-z]/, "Debe incluir al menos una letra minúscula")
    .matches(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
    .matches(/\d/, "Debe incluir al menos un número")
    .matches(/[^A-Za-z0-9]/, "Debe incluir al menos un símbolo")
    .test("no-spaces", "No debe contener espacios", (value) => !/\s/.test(value ?? ""))
    .required("La contraseña es obligatoria"),
});
