import { MypageDiaryLists } from "./diary";
import { MypageSummaryLists } from "./summary";
import { MypageBookmarkLists } from "./bookmark";

export interface UserMyPage {
  id: string;
  nickname: string;
  dog: { name: string, sex: string, birthDate: string, imageKey: string };
  diaries: MypageDiaryLists[];
  summaries: MypageSummaryLists[];
  bookmarks: MypageBookmarkLists[];
}