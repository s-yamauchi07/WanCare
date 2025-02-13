/*
  Warnings:

  - You are about to drop the `Summary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Summary" DROP CONSTRAINT "Summary_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."diaries" DROP CONSTRAINT "diaries_summaryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."follows" DROP CONSTRAINT "follows_followerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."follows" DROP CONSTRAINT "follows_followingId_fkey";

-- DropForeignKey
ALTER TABLE "public"."summary_tags" DROP CONSTRAINT "summary_tags_summaryId_fkey";

-- DropTable
DROP TABLE "public"."Summary";

-- CreateTable
CREATE TABLE "public"."summary" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "ownerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "summary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."summary" ADD CONSTRAINT "summary_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."summary_tags" ADD CONSTRAINT "summary_tags_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "public"."summary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."diaries" ADD CONSTRAINT "diaries_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "public"."summary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "public"."owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "public"."owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;
