import * as Yup from 'yup';



// Interface for the registration form values
export interface RegisterFormValues {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}


// Initial values for the registration form
export const RegisterInitialValues : RegisterFormValues = {
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
}

// Validation schema for the registration form
export const RegisterValidationSchema = Yup.object({
  name: Yup.string()
    .required("El nombre es obligatorio")
    .matches(/^[A-Za-z\s]+$/, "El nombre solo puede contener letras y espacios"),

  username: Yup.string()
    .required("El nombre de usuario es obligatorio")
    .min(4, "El nombre de usuario debe tener al menos 4 caracteres")
    .max(20, "El nombre de usuario no puede superar los 20 caracteres")
    .matches(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos"),

  email : Yup.string() 
    .email("Dirección de email inválida")     
    .required("El email es obligatorio"),  

  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .matches(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
    .matches(/[0-9]/, "La contraseña debe contener al menos un número")
    .matches(/[@$!%*?&]/, "La contraseña debe contener al menos un carácter especial (@$!%*?&)")
    .required("La contraseña es obligatoria"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir")
    .required("Confirmar contraseña es obligatorio"),

})