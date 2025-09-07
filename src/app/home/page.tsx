import Home from "@/view/Home";
import NavBar from "@/components/NavBar";


const home = () => {
    return(
        <>
            <div>
                <NavBar/>
            </div>
            <div>
                <Home/>
            </div>
        </>
    )
}

export default home;