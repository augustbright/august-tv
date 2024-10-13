/*
  Warnings:

  - Added the required column `type` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "type" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "imported" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cursor" SERIAL NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "imported_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "imported" ADD CONSTRAINT "imported_id_fkey" FOREIGN KEY ("id") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
