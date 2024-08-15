export interface Comment {
  id: number;
  text: string;
  postId: number;
  completed: boolean;
}

export type Comments = Comment[];
