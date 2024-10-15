/*
  Warnings:

  - You are about to drop the `_employeskills` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endDate` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Skill` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_employeskills` DROP FOREIGN KEY `_EmployeSkills_A_fkey`;

-- DropForeignKey
ALTER TABLE `_employeskills` DROP FOREIGN KEY `_EmployeSkills_B_fkey`;

-- AlterTable
ALTER TABLE `skill` ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `_employeskills`;

-- CreateTable
CREATE TABLE `_EmployeToSkill` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EmployeToSkill_AB_unique`(`A`, `B`),
    INDEX `_EmployeToSkill_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_EmployeToSkill` ADD CONSTRAINT `_EmployeToSkill_A_fkey` FOREIGN KEY (`A`) REFERENCES `Employe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EmployeToSkill` ADD CONSTRAINT `_EmployeToSkill_B_fkey` FOREIGN KEY (`B`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
