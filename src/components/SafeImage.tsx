import Image, { ImageProps } from "next/image";

type SafeImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;            // puede venir vacío
  alt?: string | null;
  fallbackSrc?: string;           // fallback local en /public
  fallbackAlt?: string;
};

const isNonEmpty = (v?: string | null): v is string =>
  typeof v === "string" && v.trim().length > 0;

export default function SafeImage({
  src,
  alt,
  fallbackSrc = "/images/architecture.jpg", // <— alineado con tu carpeta
  fallbackAlt = "image",
  ...rest
}: SafeImageProps) {
  const finalSrc = isNonEmpty(src) ? src : fallbackSrc;
  const finalAlt = isNonEmpty(alt) ? alt : fallbackAlt;
  return <Image {...rest} src={finalSrc} alt={finalAlt} />;
}
