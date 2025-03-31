export interface Care{
  careDate: string;
  amount?: string;
  memo?: string;
  imageKey?: string;
  careListId: string;
}

export interface TodayCareInfo {
  id: string;
  careDate: string;
  careList: { name: string, icon: string };
}

export interface CareLists {
  careDate: string;
  amount: number;
  memo: string;
  careList: { name: string }
}

export interface CareUnit {
  title :string;
  unit: string;
}

export interface CareDetails {
  id: string;
  careDate: string;
  amount?: number | null;
  memo?: string | null ;
  imageKey: string | null;
  ownerId: string;
  careListId: string;
  careList: { name: string, icon: string };
}