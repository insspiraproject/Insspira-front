export interface IPins {
    id: number;
    image?: string | null;           // ← opcional / null
    description?: string | null;
    likesCount: number;
    commentsCount: number;
    views: number;
    user: string;
  }
  