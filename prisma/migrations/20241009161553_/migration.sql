/*
  Warnings:

  - You are about to drop the column `photo` on the `employe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employe` DROP COLUMN `photo`,
    ADD COLUMN `avatar` TEXT NULL;
