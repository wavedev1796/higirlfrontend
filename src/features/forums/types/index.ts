export interface ForumAuthor {
  id: number;
  nombre?: string;
  apellido?: string;
  usuario?: string;
  foto?: string | null;
}

export interface ForumInterest {
  id: number;
  nombre: string;
}

export interface ForumPost {
  id: number;
  texto: string;
  autor: ForumAuthor;
  interes: ForumInterest | null;
  fecha: string;
  likes: number;
  likedByMe: boolean;
}

export interface ForumFeedResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  publicaciones: ForumPost[];
}

export interface CreateForumPost {
  texto: string;
  interesId?: number;
}

export interface LikeResult {
  publicacionId: number;
  liked: boolean;
  likes: number;
}
