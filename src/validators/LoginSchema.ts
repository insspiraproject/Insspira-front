import * as Yup from 'yup';

//interface para los valores del formulario de inicio de sesión, ay que ganas de morir dios
export interface LoginFormValues {
    email: string;
    password: string;
}



//valores iniciales del formulario
export const LoginInitialValues : LoginFormValues = {
    email: '',
    password: ''
}


// Esquema de validación para el formulario de inicio de sesión
export const LoginValidationSchema =Yup.object({
    email: Yup.string()
    .email('El email no es válido')
    .required('El email es obligatorio'),
    password : Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .required('La contraseña es obligatoria'),
})