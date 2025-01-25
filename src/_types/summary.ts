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

export interface SummaryDetails {
  id: string
  title: string
  explanation: string
  createdAt: string
  summaryTags: Tag[]
}