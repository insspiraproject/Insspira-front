import RegisterComponent from "@/components/form/Register";


const FormRegister = () => {
    return(
       <div className="min-h-screen flex flex-col items-center justify-center text-white"
        style={{ backgroundColor: "var(--violeta)" }}>
        <RegisterComponent />
       </div>
    )
};

export default FormRegister;