export interface Comment{
  comment: string
}

export interface CommentProps {
  id: string;
  comment: string;
  owner: { nickname: string };
}

export interface CommentsProps {
  comments: CommentProps[];
}
