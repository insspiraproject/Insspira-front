export interface IPins {
  id: string;
  image?: string | null;
  description?: string | null;
  views: number;
  user: string;
  likes?: number;
  likesCount: number,
  liked: boolean,
  commentsCount: number,
  comment?: number;
}

export interface IComment {
  id: string;
  text: string;
  createAt: string;
}
