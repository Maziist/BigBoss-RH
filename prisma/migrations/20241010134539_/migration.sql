/*
  Warnings:

  - You are about to drop the `equipment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `equipment` DROP FOREIGN KEY `Equipment_companyId_fkey`;

-- AlterTable
ALTER TABLE `skill` ADD COLUMN `companyId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `equipment`;

-- AddForeignKey
ALTER TABLE `Skill` ADD CONSTRAINT `Skill_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
