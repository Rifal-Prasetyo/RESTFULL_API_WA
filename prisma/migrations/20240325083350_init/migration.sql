/*
  Warnings:

  - You are about to drop the column `api` on the `ApiKey` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_noWa_key";

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "api";
