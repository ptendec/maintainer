/*
  Warnings:

  - You are about to drop the column `telegramId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_telegramId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegramId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "firstName" DROP NOT NULL;
DROP SEQUENCE "User_id_seq";
