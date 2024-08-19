export interface Comment {
  id: string;
  text: string;
  postId: number;
  completed: boolean;
}

export type Comments = Comment[];
