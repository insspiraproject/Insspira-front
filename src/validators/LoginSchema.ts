import * as Yup from "yup";

export interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginInitialValues: LoginFormValues = {
  email: "",
  password: "",
};

export const LoginValidationSchema = Yup.object({
  email: Yup.string()
    .transform((v) => (v ?? "").trim().toLowerCase())
    .email("El email no es válido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(64, "La contraseña no puede superar 64 caracteres")
    .matches(/^\S+$/, "No se permiten espacios en la contraseña")
    .required("La contraseña es obligatoria"),
});
