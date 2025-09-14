'use client'

import { useState } from "react";
import { IoMdSearch } from "react-icons/io";

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex justify-center items-center bg-[var(--color-blanco)] opacity-45 rounded-xl
    md:h-[40px] lg:h-[50px] md:w-[250px] lg:w-[320px] py-2]">
      <IoMdSearch className="text-[18px] md:text-[25px] lg:text-[30px] m-2" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Buscar..."
        className="h-[30px] md:w-[320px] md:h-[40px] lg:w-[380px] lg:h-[50px] 
        rounded-r-xl roudnede-l-xs bg-[var(--color-blanco)]  pl-2 md:pl-3 
        text-xs md:text-sm lg:text-base"
      />
    </div>
  );
};

export default Search;