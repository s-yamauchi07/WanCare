import { Tag } from "@/_types/tag";

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
  ownerId: string;
  comments: {comment: string, nickname: string}
}
