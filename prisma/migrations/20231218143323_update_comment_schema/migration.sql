/*
  Warnings:

  - Added the required column `movie_id` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` ADD COLUMN `movie_id` INTEGER NOT NULL;
