import { Tag } from "./tag";

export interface Summary {
  title: string
  explanation: string
  tags? : string[] | null
  diaryIds? : string[] | null
}

export interface SummaryResponse {
  id: string;
  title: string;
} 

export interface SummaryRequest {
  title: string
  explanation: string
  tags? : string | null;
  diaryIds? : string[] | null;
}

export interface AllSummary {
  id: string
  title: string
  explanation: string
  createdAt: string
  summaryTags: Tag[]
}

export interface SummaryDetails {
  id: string
  title: string
  explanation: string
  summaryTags: Tag[]
  diaries: { id: string, title: string, createdAt: string }[]
  owner: { id: string, nickname: string }
  createdAt: string
  updatedAt: string
}

export interface MypageSummaryLists {
  id: string;
  title: string;
  imageKey: string;
  createdAt: string;
}