//src/app/not-found.tsx
import Image from "next/image";
import Link from "next/link";

const notFound = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="justify-center  bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
        <h1 className="text-6xl font-bold text-[#5417eb] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Ruta o producto no encontrado</h2>
        <p className="text-gray-600 mb-6 text-center">
          Lo sentimos, lo que buscas no existe o ha sido movido.
        </p>
        <Link href={"/home"} className="inline-block px-6 py-2 bg-[#5417eb] text-white rounded hover:bg-indigo-800 transition">Volver al inicio</Link>
          <Image 
            src="https://miro.medium.com/v2/resize:fit:512/1*YWUpnY_zNbSfK62GSJIBbw.png"
            alt="Not Found Illustration"
            width={150} // Ancho real de tu imagen en píxeles
            height={50} // Alto real de tu imagen en píxeles
            className="w-64 mt-8" // Mantiene el aspect ratio
          />
      </div>
    </div>
  );
};

export default notFound;