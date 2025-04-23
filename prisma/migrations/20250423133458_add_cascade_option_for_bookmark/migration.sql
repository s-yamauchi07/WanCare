-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_diaryId_fkey";

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_diaryId_fkey" FOREIGN KEY ("diaryId") REFERENCES "diaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
