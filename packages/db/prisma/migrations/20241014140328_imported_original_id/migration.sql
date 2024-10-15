/*
  Warnings:

  - Added the required column `originalId` to the `imported` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "imported" ADD COLUMN     "originalId" TEXT NOT NULL;
