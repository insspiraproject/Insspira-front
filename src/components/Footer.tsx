//src/components/Footer.tsx
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[var(--morado)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo y descripción */}
          <div className="flex flex-col items-center md:items-start">
            <a href="#" className="mb-4">
              <Image 
                src="/icon.png" 
                alt="nombre"
                width={100}
                height={60}
                className="w-auto h-auto hover:scale-105 transition-transform"
              />
            </a>
            <p className="text-sm text-center md:text-left mb-6 text-white/90">
              Tu destino para imagenes de calidad. Insspira 2025.
            </p>
            
            {/* Redes sociales */}
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-[var(--color-rosa)] transition-colors" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-[var(--color-rosa)] transition-colors" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-[var(--color-rosa)] transition-colors" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-[var(--color-rosa)] transition-colors" aria-label="WhatsApp">
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Sección Nosotros */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold mb-4 text-[var(--color-crema)]">Nosotros</h3>
            <ul className="space-y-3 text-center md:text-left">
              <li><a href="#" className="text-white/90 hover:text-[var(--color-crema)] hover:underline transition-colors">Nuestra historia</a></li>
              <li><a href="#" className="text-white/90 hover:text-[var(--color-crema)] hover:underline transition-colors">Equipo</a></li>
              <li><a href="#" className="text-white/90 hover:text-[var(--color-crema)] hover:underline transition-colors">Trabaja con nosotros</a></li>
              <li><a href="#" className="text-white/90 hover:text-[var(--color-crema)] hover:underline transition-colors">Sostenibilidad</a></li>
            </ul>
          </div>

          {/* Información útil */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold mb-4 text-[var(--color-crema)]">Información útil</h3>
            <ul className="space-y-3 text-center md:text-left">
              <li><a href="#" className="text-white/90 hover:text-[var(--color-crema)] hover:underline transition-colors">Guía de tallas</a></li>
              <li><a href="#" className="text-white/90 hover:text-[var(--color-crema)] hover:underline transition-colors">Política de envíos</a></li>
              <li><a href="#" className="text-white/90 hover:text-[var(--color-crema)] hover:underline transition-colors">Devoluciones</a></li>
              <li><a href="#" className="text-white/90 hover:text-[var(--color-crema)] hover:underline transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-bold mb-4 text-[var(--color-crema)]">Contacto</h3>
            <ul className="space-y-3 text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-white/90">Email:</span>
                <a href="mailto:info@dexterstore.com" className="text-white/90 hover:text-[var(--color-crema)] hover:underline">fabianromerolu@gmail.com</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-white/90">Teléfono:</span>
                <a href="tel:+123456789" className="text-white/90 hover:text-[var(--color-crema)] hover:underline">+57 311 270 8453</a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-white/90">Horario:</span>
                <span className="text-white/90">Lun-Vie: 9am - 6pm</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="text-white/90">Ubicación:</span>
                <span className="text-white/90">Argentina, Colombia y México</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--color-crema)/40] my-8"></div>

        {/* Copyright y pagos */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <p className="text-sm text-white/90">
            © 2025 Insspira. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;