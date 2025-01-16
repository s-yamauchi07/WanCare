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