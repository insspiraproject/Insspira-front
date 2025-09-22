export interface IPins {
  id: string;
  image?: string | null;
  description?: string | null;
  likesCount: number;
  commentsCount: number;
  views: number;
  user: string;
  likes?: number;
  comment?: number;
}
