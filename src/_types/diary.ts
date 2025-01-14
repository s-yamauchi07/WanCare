import { Tag } from "@/_types/tag";

export interface DiaryRequest {
  title: string;
  content: string;
  imageKey?: string | null;
  tags?: string;
  summaryId?: string | null;
}

export interface DiaryDetails {
  id: string;
  title: string;
  content: string;
  imageKey: string | null;
  ownerId: string;
  summaryId: string | null;
  createdAt: string;
  updatedAt: string;
  diaryTags: Tag[] | null;
  comments: {comment: string, nickname: string}
}