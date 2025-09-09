import { LoginFormValues } from "@/validators/LoginSchema";
import { RegisterFormValues } from "@/validators/RegisterSchema";
import { toast } from "react-toastify"


export const RegisterUser = async (userData: RegisterFormValues) => {
  try {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();
    toast.success("User registered successfully!");

    return data; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Registration error:", error);
    toast.error(error.message || "Something went wrong during registration");
    return null;
  }
};



export const LoginUser = async (userData : LoginFormValues) => {
    try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    toast.success("User logged successfully!")
   
    return data; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Login error:", error);
    toast.error(error.message || "Something went wrong during login");
    return null;
  }
};

