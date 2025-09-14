export interface IPins {
  id: string;
  image: string;
  description?: string | null;
  likesCount: number;
  commentsCount: number;
  views: number;
  user: string;
}
