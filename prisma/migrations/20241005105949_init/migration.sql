-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('PROCESSING', 'ERROR', 'DRAFT', 'READY', 'DELETED');

-- CreateTable
CREATE TABLE "Video" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "VideoStatus" NOT NULL DEFAULT 'PROCESSING',
    "authorId" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "masterUrl" TEXT,
    "folder" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);
