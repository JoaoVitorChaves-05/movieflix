/*
  Warnings:

  - Made the column `content` on table `comment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `comment` MODIFY `content` LONGTEXT NOT NULL;
