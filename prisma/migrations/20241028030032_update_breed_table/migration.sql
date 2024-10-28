/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `breeds` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateIndex
CREATE UNIQUE INDEX "breeds_name_key" ON "public"."breeds"("name");
