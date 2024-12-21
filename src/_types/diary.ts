export interface DiaryRequest {
  title: string
  content: string
  imageKey?: string | null
  tags?: string[] 
  summaryId?: string | null
}