export interface IPins {
  id: number;
  image?: string | null;
  description?: string | null;
  likesCount: number;
  commentsCount: number;
  views: number;
  user: string;
}
