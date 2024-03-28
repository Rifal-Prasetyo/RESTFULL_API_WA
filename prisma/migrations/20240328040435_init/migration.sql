/*
  Warnings:

  - Added the required column `name_project` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name_project" TEXT NOT NULL;
