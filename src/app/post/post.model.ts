export interface Post {
  id: number;
  title: string;
  views: number;
  author: string;
}

export type Posts = Post[];
