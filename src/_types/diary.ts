export interface Diary {
  title: string
  content: string
  imageKey?: string | null
  tags?: string[] 
  summaryId?: string | null
}