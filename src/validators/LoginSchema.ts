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
  .email("Invalid email")
  .required("Email is required"),
password: Yup.string()
  .min(8, "Password must be at least 8 characters long")
  .max(64, "Password cannot exceed 64 characters")
  .matches(/^\S+$/, "Spaces are not allowed in the password")
  .required("Password is required"),
});
