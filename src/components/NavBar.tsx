// import { IoMdSearch } from "react-icons/io"
// import { IoNotificationsCircleSharp } from "react-icons/io5";

// const NavBar = () => {
//     return(
//         <div className="flex w-max-screen justify-around items-center h-[90px] bg-[linear-gradient(to_right,#1C163E_0%,#743596_40%,#743596_60%,#1C163E_100%)]">
//             <div className="flex justify-center items-center ml-1">
//                         <div className="flex justify-center items-center text-[10px] bg-[var(--color-blanco)] w-[50px] h-[50px]"><p>Logotipo</p></div>
//                         <h1 className="text-3xl font-bold text-[var(--color-blanco)] ml-3"
//                         >Insspira</h1>
//             </div>

//             <div className="flex justify-baseline">
//                 <button className="bg-[var(--color-blanco)] opacity-45 rounded-l-lg">
//                     <IoMdSearch size={45}/>
//                 </button>
//                 <input type="text"
//                         placeholder="Search"
//                 className=" w-[550px] h-[50px] rounded-r-xl bg-[var(--color-blanco)] opacity-40 pl-3"/>
//             </div>

//             <div className="flex justify-around items-center mr-1">
//                 <div>
//                     <button className="rounded-full py-2 px-4 bg-gradient-to-tr from-[var(--color-morado)] to-[var(--color-violeta)]
//                     text-xl font-semibold text-[var(--color-blanco)]">
//                         <p>Feed</p>
//                     </button>                
//                 </div>
//                 <div className="ml-3">
//                     <button className="rounded-full py-2 px-4 bg-gradient-to-tl from-[var(--color-morado)] to-[var(--color-violeta)]
//                     text-xl font-semibold text-[var(--color-blanco)]">
//                         <p>tendencies</p>    
//                     </button>
//                 </div>
//                 <div className="flex justify-baseline items-center ml-3">
//                     <IoNotificationsCircleSharp size={45}/>
//                     <button className="h-[35px] w-[35px] rounded-[100%] bg-[var(--color-rosa)]">

//                     </button>
                    
//                 </div>
//             </div>
//         </div>
//     )
// };

// export default NavBar;



import { IoMdSearch } from "react-icons/io";
import { IoNotificationsCircleSharp } from "react-icons/io5";

const NavBar = () => {
  return (
    <div className="flex w-full justify-around items-center h-[60px] md:h-[75px] lg:h-[90px] px-2 sm:px-4 md:px-6 bg-[linear-gradient(to_right,#1C163E_0%,#743596_40%,#743596_60%,#1C163E_100%)]">
      
      {/* Logo */}
      <div className="flex items-center">
        <div className="flex justify-center items-center text-[8px] md:text-[9px] lg:text-[10px] bg-[var(--color-blanco)] w-[30px] h-[30px] md:w-[40px] md:h-[40px] lg:w-[50px] lg:h-[50px]">
          <p>Logo</p>
        </div>
        <h1 className="text-base md:text-2xl lg:text-3xl font-bold text-[var(--color-blanco)] ml-2 md:ml-3">
          Insspira
        </h1>
      </div>

      {/* Search */}
      <div className="flex items-center">
  <button className="bg-[var(--color-blanco)] opacity-45 rounded-l-lg 
                     h-[30px] md:h-[40px] lg:h-[50px] px-2 md:px-3">
    <IoMdSearch className="text-[18px] md:text-[25px] lg:text-[30px]" />
  </button>
  <input
    type="text"
    placeholder="Search"
    className="w-[100px] h-[30px] md:w-[300px] md:h-[40px] lg:w-[550px] lg:h-[50px] 
               rounded-r-xl bg-[var(--color-blanco)] opacity-40 pl-2 md:pl-3 
               text-xs md:text-sm lg:text-base"
  />
</div>

      {/* Menu */}
      <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
        <button className="rounded-full py-1 md:py-1.5 lg:py-2 px-3 md:px-3.5 lg:px-4 bg-gradient-to-tr from-[var(--color-morado)] to-[var(--color-violeta)] text-xs md:text-sm lg:text-xl font-semibold text-[var(--color-blanco)]">
          Feed
        </button>
        <button className="rounded-full py-1 md:py-1.5 lg:py-2 px-3 md:px-3.5 lg:px-4 bg-gradient-to-tl from-[var(--color-morado)] to-[var(--color-violeta)] text-xs md:text-sm lg:text-xl font-semibold text-[var(--color-blanco)]">
          Tendencies
        </button>
        <div className="flex items-center">
          <IoNotificationsCircleSharp size={22} className="md:size-[35px] lg:size-[45px]" />
          <button className="h-[18px] w-[18px] md:h-[25px] md:w-[25px] lg:h-[35px] lg:w-[35px] rounded-full bg-[var(--color-rosa)] ml-1"></button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
