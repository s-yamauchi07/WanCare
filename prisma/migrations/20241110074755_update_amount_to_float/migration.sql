/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `care_lists` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `tags` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order` to the `breeds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `care_lists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `care_lists` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "breeds" ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "care_lists" ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "cares" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "care_lists_name_key" ON "care_lists"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");
