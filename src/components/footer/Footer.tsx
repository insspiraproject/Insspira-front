// src/components/Footer.tsx
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-[linear-gradient(to_right,#1C163E_0%,#743596_40%,#743596_60%,#1C163E_100%)] text-[var(--color-blanco)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo y descripción */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-4 inline-block" aria-label="Ir al inicio">
              <Image
                src="/icon.png"
                alt="Insspira"
                width={100}
                height={60}
                className="h-auto w-auto transition-transform hover:scale-105"
              />
            </Link>
            <p className="text-sm text-center md:text-left opacity-90">
              Tu destino para imágenes de calidad. Insspira 2025.
            </p>

            {/* Redes sociales */}
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="transition-colors text-[var(--color-blanco)] hover:text-[var(--color-rosa)]"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="transition-colors text-[var(--color-blanco)] hover:text-[var(--color-rosa)]"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="#"
                className="transition-colors text-[var(--color-blanco)] hover:text-[var(--color-rosa)]"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="#"
                className="transition-colors text-[var(--color-blanco)] hover:text-[var(--color-rosa)]"
                aria-label="WhatsApp"
              >
                <FaWhatsapp size={20} />
              </a>
            </div>
          </div>

          {/* Sección Nosotros */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-lg font-bold text-[var(--color-rosa)]">Nosotros</h3>
            <ul className="space-y-3 text-center md:text-left">
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-rosa)] hover:underline transition-colors">
                  Nuestra historia
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-rosa)] hover:underline transition-colors">
                  Equipo
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-rosa)] hover:underline transition-colors">
                  Trabaja con nosotros
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-rosa)] hover:underline transition-colors">
                  Sostenibilidad
                </a>
              </li>
            </ul>
          </div>

          {/* Información útil */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-lg font-bold text-[var(--color-rosa)]">Información útil</h3>
            <ul className="space-y-3 text-center md:text-left">
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-rosa)] hover:underline transition-colors">
                  Guía de tallas
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-rosa)] hover:underline transition-colors">
                  Política de envíos
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-rosa)] hover:underline transition-colors">
                  Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 hover:text-[var(--color-rosa)] hover:underline transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-4 text-lg font-bold text-[var(--color-rosa)]">Contacto</h3>
            <ul className="space-y-3 text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-90">Email:</span>
                <a
                  href="mailto:fabianromerolu@gmail.com"
                  className="opacity-90 hover:opacity-100 hover:text-[var(--color-rosa)] hover:underline transition-colors"
                >
                  fabianromerolu@gmail.com
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-90">Teléfono:</span>
                <a
                  href="tel:+573112708453"
                  className="opacity-90 hover:opacity-100 hover:text-[var(--color-rosa)] hover:underline transition-colors"
                >
                  +57 311 270 8453
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-90">Horario:</span>
                <span className="opacity-90">Lun–Vie: 9am – 6pm</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <span className="opacity-90">Ubicación:</span>
                <span className="opacity-90">Argentina, Colombia y México</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-white/10"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm opacity-80">
            © 2025 Insspira. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
