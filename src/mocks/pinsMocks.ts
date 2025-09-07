export interface IPinsMocks {
  id: number;
  image?: string | null;
  description?: string | null;
  likesCount: number;
  commentsCount: number;
  views: number;
  user: string;
}

const rawPins: IPinsMocks[] = [
    {
        id: 1,
    image: "https://i.pinimg.com/736x/d3/3d/6b/d33d6b8adfa24b98f526dfcf7c5c2466.jpg",
    description: "",
    likesCount: 573,
    commentsCount: 15,
    views: 875,
    user: "Alberto Ramirez"
    },
    {
        id: 2,
    image: "https://i.pinimg.com/1200x/78/f9/a1/78f9a13177277e5700837613190cabe6.jpg",
    description: "Les dejo un pequeño vistazo de lo que estoy trabajando.",
    likesCount: 23,
    commentsCount: 15,
    views: 41,
    user: "Ulises Caser"
    },
    {
        id: 3,
    image: "https://i.pinimg.com/736x/0a/2f/6c/0a2f6c5f618f89b3dce18fade7b7246a.jpg",
    description: "Un hermoso dia en la naturaleza acompañado de un hermoso atardecer",
    likesCount: 412,
    commentsCount: 14,
    views: 435,
    user: "Carina Olivera"
    },
    {
        id: 4,
    image: "https://i.pinimg.com/1200x/c6/0f/d9/c60fd9aff016d5dacc5e707ffbb29dc6.jpg",
    description: "",
    likesCount: 9,
    commentsCount: 15,
    views: 30,
    user: "Albert Ramir"
    },
    {
        id: 5,
    image: "https://i.pinimg.com/736x/d6/83/4d/d6834da5557f357860f06f455c3942d6.jpg",
    description: "",
    likesCount: 573,
    commentsCount: 197,
    views: 925,
    user: "Carolina Fezre"
    },
    {
        id: 6,
    image: "https://i.pinimg.com/736x/3e/bd/db/3ebddb38fc1e1d3363b04e1ba9969539.jpg",
    description: "",
    likesCount: 532,
    commentsCount: 145,
    views: 855,
    user: "Lautaro  Zapu"
    },
    {
        id: 7,
    image: "https://i.pinimg.com/736x/80/bb/c0/80bbc0098241a384d740efc0b511da65.jpg",
    description: "",
    likesCount: 73,
    commentsCount: 56,
    views: 85,
    user: "Mateo Gonzales"
    },
    {
        id: 8,
    image: "https://i.pinimg.com/736x/aa/83/02/aa83027fb807f34f8df95a8c40260b9e.jpg",
    description: "",
    likesCount: 5737,
    commentsCount: 1500,
    views: 8075,
    user: "Lucía Fernández"
    },
    {
        id: 9,
    image: "https://i.pinimg.com/736x/26/e0/77/26e077424242fdf770f12bd542b057c0.jpg",
    description: "",
    likesCount: 573,
    commentsCount: 15,
    views: 875,
    user: "Santiago Martinez"
    },
    {
        id: 10,
    image: "https://i.pinimg.com/736x/e6/5f/c1/e65fc18c738d43d4f9e3f22c3aa901b2.jpg",
    description: "No pudes usar algunas herramientas por su costo?? aqui te traigo la solucion",
    likesCount: 71,
    commentsCount: 46,
    views: 93,
    user: "Vanlentina Sánchez"
    },
];

const FALLBACK = "/architecture.jpg";

const pinsMock: IPinsMocks[] = rawPins.map((p) => ({
  ...p,
  image:
    typeof p.image === "string" && p.image.trim().length > 0
      ? p.image
      : FALLBACK,
}));

export default pinsMock;