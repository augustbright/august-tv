-- CreateEnum
CREATE TYPE "VideoStatus" AS ENUM ('PROCESSING', 'ERROR', 'READY', 'DELETED');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('DRAFT', 'PRIVATE', 'UNLISTED', 'PUBLIC');

-- CreateTable
CREATE TABLE "videos" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "status" "VideoStatus" NOT NULL DEFAULT 'PROCESSING',
    "visibility" "Visibility" NOT NULL DEFAULT 'DRAFT',
    "authorId" TEXT NOT NULL,
    "thumbnailId" UUID,
    "thumbnailSetId" UUID NOT NULL,
    "masterId" UUID NOT NULL,
    "fileSetId" UUID NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nickname" VARCHAR(100),
    "pictureId" UUID,
    "pictureSetId" UUID NOT NULL,
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "username" TEXT,
    "email" TEXT,
    "password" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "originalWidth" INTEGER NOT NULL,
    "originalHeight" INTEGER NOT NULL,
    "setId" UUID,
    "smallId" UUID NOT NULL,
    "mediumId" UUID NOT NULL,
    "largeId" UUID NOT NULL,
    "originalId" UUID NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "publicUrl" TEXT NOT NULL,
    "fileSetId" UUID,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image_sets" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "image_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_sets" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "file_sets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "videos_thumbnailId_key" ON "videos"("thumbnailId");

-- CreateIndex
CREATE UNIQUE INDEX "videos_thumbnailSetId_key" ON "videos"("thumbnailSetId");

-- CreateIndex
CREATE UNIQUE INDEX "videos_masterId_key" ON "videos"("masterId");

-- CreateIndex
CREATE UNIQUE INDEX "videos_fileSetId_key" ON "videos"("fileSetId");

-- CreateIndex
CREATE INDEX "videos_authorId_idx" ON "videos"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "users_pictureId_key" ON "users"("pictureId");

-- CreateIndex
CREATE UNIQUE INDEX "users_pictureSetId_key" ON "users"("pictureSetId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "images_smallId_key" ON "images"("smallId");

-- CreateIndex
CREATE UNIQUE INDEX "images_mediumId_key" ON "images"("mediumId");

-- CreateIndex
CREATE UNIQUE INDEX "images_largeId_key" ON "images"("largeId");

-- CreateIndex
CREATE UNIQUE INDEX "images_originalId_key" ON "images"("originalId");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_thumbnailId_fkey" FOREIGN KEY ("thumbnailId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_thumbnailSetId_fkey" FOREIGN KEY ("thumbnailSetId") REFERENCES "image_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_fileSetId_fkey" FOREIGN KEY ("fileSetId") REFERENCES "file_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "images"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pictureSetId_fkey" FOREIGN KEY ("pictureSetId") REFERENCES "image_sets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_setId_fkey" FOREIGN KEY ("setId") REFERENCES "image_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_smallId_fkey" FOREIGN KEY ("smallId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_mediumId_fkey" FOREIGN KEY ("mediumId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_largeId_fkey" FOREIGN KEY ("largeId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_originalId_fkey" FOREIGN KEY ("originalId") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_fileSetId_fkey" FOREIGN KEY ("fileSetId") REFERENCES "file_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
