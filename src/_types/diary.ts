import { Tag } from "@/_types/tag";
import { CommentProps } from "./comment";

export interface DiaryRequest {
  title: string;
  content: string;
  imageKey?: string | null;
  tags?: string | null;
  summaryId?: string | null;
}

export interface BaseDiary {
  id: string;
  title: string;
  content: string;
  imageKey: string | null;
  diaryTags: Tag[] | null;
  summaryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DiaryDetails extends BaseDiary {
  owner: { id: string, nickname: string }
  comments: CommentProps[];
}

export interface MypageDiaryLists {
  id: string;
  title: string;
  imageKey: string;
  createdAt: string;
}