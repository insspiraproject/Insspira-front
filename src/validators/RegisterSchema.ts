import * as Yup from "yup";

// Interface for the registration form
export interface RegisterFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Initial values
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

// Validation schema
export const RegisterValidationSchema = Yup.object({
  name: Yup.string()
    .transform((v) => (v ?? "").trim().replace(/\s+/g, " "))
    .min(2, "Name must be at least 2 characters long")
    .max(60, "Name cannot exceed 60 characters")
    // Allows unicode letters + spaces, apostrophes and hyphens (José Luis, O’Connor, Ana-María)
    .matches(/^\p{L}+(?:[ '\-]\p{L}+)*$/u, "Name can only contain letters and spaces")
    .required("Name is required"),

  username: Yup.string()
    .transform((v) => (v ?? "").trim().toLowerCase())
    .min(4, "Username must be at least 4 characters long")
    .max(20, "Username cannot exceed 20 characters")
    // Must start and end with alphanumeric, can contain _ in the middle, no consecutive __, no spaces
    .matches(
      /^(?!.*__)[a-z0-9](?:[a-z0-9_]{2,18})[a-z0-9]$/,
      "Only lowercase letters, numbers, and underscores; no consecutive '__', cannot start or end with _"
    )
    .notOneOf(RESERVED_USERNAMES, "This username is reserved")
    .required("Username is required"),

  email: Yup.string()
    .transform((v) => (v ?? "").trim().toLowerCase())
    .email("Invalid email address")
    .max(254, "Email is too long")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password cannot exceed 64 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter (A-Z)")
    .matches(/[a-z]/, "Must contain at least one lowercase letter (a-z)")
    .matches(/\d/, "Must contain at least one number (0-9)")
    .matches(/[^\w\s]/, "Must contain at least one special character")
    .matches(/^\S+$/, "Spaces are not allowed in the password")
    // Should not contain name/username/email prefix
    .test(
      "no-personal-data",
      "Password must not contain your name, username, or email prefix",
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
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});