export interface IPins {
  id: string;
  image?: string | null;
  description?: string | null;
  views: number;
  user: string;
  likes?: number;
  likesCount: number,
  commentsCount: number,
  comment?: number;
}
