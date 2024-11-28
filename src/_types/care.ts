export interface Care{
  careDate: Date
  amount?: number
  memo?: string
  imageKey?: string
  careListId: string
}

export interface TodayCareInfo {
  id: string;
  careDate: string;
  amount: number;
  memo: string;
  imageKey: string;
  ownerId: string;
  careList: { name: string, icon: string };
  createdAt: string;
  updatedAt: string;
}

export interface CareLists {
  careDate: string;
  amount: number;
  memo: string;
  careList: { name: string }
}