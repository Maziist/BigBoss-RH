/*
  Warnings:

  - You are about to drop the column `projectId` on the `task` table. All the data in the column will be lost.
  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `Project_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `task` DROP FOREIGN KEY `Task_projectId_fkey`;

-- AlterTable
ALTER TABLE `task` DROP COLUMN `projectId`;

-- DropTable
DROP TABLE `project`;
