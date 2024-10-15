/*
  Warnings:

  - You are about to drop the column `subProjectId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `subproject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `subproject` DROP FOREIGN KEY `SubProject_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_subProjectId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `subProjectId`;

-- DropTable
DROP TABLE `subproject`;
