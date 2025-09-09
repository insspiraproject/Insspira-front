import FormLogin from "@/components/auth/Login";


const FormLoginView = () => {
    return(
        <div className="min-h-screen flex flex-col items-center justify-center text-white"
        style={{ backgroundColor: "var(--violeta)" }}
        >
        <FormLogin />  
        </div>
    )
};

export default FormLoginView;