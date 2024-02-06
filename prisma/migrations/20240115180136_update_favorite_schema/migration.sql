/*
  Warnings:

  - A unique constraint covering the columns `[movie_id,author_id]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Favorite_movie_id_author_id_key` ON `Favorite`(`movie_id`, `author_id`);
