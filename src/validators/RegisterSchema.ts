import * as Yup from "yup";

// Interface para el formulario de registro
export interface RegisterFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Valores iniciales
export const RegisterInitialValues: RegisterFormValues = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RESERVED_USERNAMES = [
  "admin",
  "root",
  "support",
  "null",
  "undefined",
  "system",
  "owner",
  "help",
  "contact",
];

// Esquema de validación
export const RegisterValidationSchema = Yup.object({
  name: Yup.string()
    .transform((v) => (v ?? "").trim().replace(/\s+/g, " "))
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(60, "El nombre no puede superar 60 caracteres")
    // Permite letras unicode + espacios, apóstrofos y guiones (José Luis, O’Connor, Ana-María)
    .matches(/^\p{L}+(?:[ '\-]\p{L}+)*$/u, "El nombre solo puede contener letras y espacios")
    .required("El nombre es obligatorio"),

  username: Yup.string()
    .transform((v) => (v ?? "").trim().toLowerCase())
    .min(4, "El nombre de usuario debe tener al menos 4 caracteres")
    .max(20, "El nombre de usuario no puede superar 20 caracteres")
    // Debe empezar y terminar en alfanumérico, puede tener _ en medio, sin __ consecutivos, sin espacios
    .matches(
      /^(?!.*__)[a-z0-9](?:[a-z0-9_]{2,18})[a-z0-9]$/,
      "Solo letras minúsculas, números y guiones bajos; sin '__' consecutivos, ni empezar/terminar con _"
    )
    .notOneOf(RESERVED_USERNAMES, "Ese nombre de usuario está reservado")
    .required("El nombre de usuario es obligatorio"),

  email: Yup.string()
    .transform((v) => (v ?? "").trim().toLowerCase())
    .email("Dirección de email inválida")
    .max(254, "El email es demasiado largo")
    .required("El email es obligatorio"),

  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(64, "La contraseña no puede superar 64 caracteres")
    .matches(/[A-Z]/, "Debe contener al menos una mayúscula (A-Z)")
    .matches(/[a-z]/, "Debe contener al menos una minúscula (a-z)")
    .matches(/\d/, "Debe contener al menos un número (0-9)")
    .matches(/[^\w\s]/, "Debe contener al menos un carácter especial")
    .matches(/^\S+$/, "No se permiten espacios en la contraseña")
    // No contener nombre/username/prefijo del email
    .test(
      "no-personal-data",
      "La contraseña no debe contener tu nombre, usuario o prefijo de email",
      function (value) {
        if (!value) return false;
        const v = value.toLowerCase();
        const { name, username, email } = this.parent as RegisterFormValues;
        const emailLocal = (email ?? "").toLowerCase().split("@")[0] || "";
        const nameFlat = (name ?? "").toLowerCase().replace(/\s+/g, "");
        return !(
          (username && v.includes(username.toLowerCase())) ||
          (emailLocal && v.includes(emailLocal)) ||
          (name && nameFlat && v.includes(nameFlat))
        );
      }
    )
    .required("La contraseña es obligatoria"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
    .required("Confirmar contraseña es obligatorio"),
});
