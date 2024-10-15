/*
  Warnings:

  - You are about to drop the column `ordinateurId` on the `employe` table. All the data in the column will be lost.
  - You are about to alter the column `modele` on the `ordinateur` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- DropForeignKey
ALTER TABLE `employe` DROP FOREIGN KEY `Employe_ordinateurId_fkey`;

-- DropIndex
DROP INDEX `Ordinateur_macAddress_key` ON `ordinateur`;

-- AlterTable
ALTER TABLE `employe` DROP COLUMN `ordinateurId`;

-- AlterTable
ALTER TABLE `ordinateur` ADD COLUMN `employeId` INTEGER NULL,
    MODIFY `modele` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Ordinateur` ADD CONSTRAINT `Ordinateur_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employe`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
