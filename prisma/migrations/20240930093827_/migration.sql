/*
  Warnings:

  - You are about to drop the column `directeur` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `nom` on the `company` table. All the data in the column will be lost.
  - You are about to alter the column `siret` on the `company` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Char(14)`.
  - You are about to drop the column `nom` on the `employe` table. All the data in the column will be lost.
  - You are about to drop the column `nombreBlame` on the `employe` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Employe` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ordinateurId]` on the table `Employe` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `director` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Employe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sexe` to the `Employe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` DROP COLUMN `directeur`,
    DROP COLUMN `nom`,
    ADD COLUMN `director` VARCHAR(255) NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    MODIFY `siret` CHAR(14) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `password` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `employe` DROP COLUMN `nom`,
    DROP COLUMN `nombreBlame`,
    ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `email` VARCHAR(255) NOT NULL,
    ADD COLUMN `firstname` VARCHAR(255) NOT NULL,
    ADD COLUMN `lastname` VARCHAR(255) NOT NULL,
    ADD COLUMN `ordinateurId` INTEGER NULL,
    ADD COLUMN `password` VARCHAR(255) NOT NULL,
    ADD COLUMN `sexe` VARCHAR(255) NOT NULL,
    MODIFY `photo` TEXT NULL,
    MODIFY `fonction` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `Blame` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeId` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ordinateur` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Employe_email_key` ON `Employe`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Employe_ordinateurId_key` ON `Employe`(`ordinateurId`);

-- AddForeignKey
ALTER TABLE `Blame` ADD CONSTRAINT `Blame_employeId_fkey` FOREIGN KEY (`employeId`) REFERENCES `Employe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Blame` ADD CONSTRAINT `Blame_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Employe` ADD CONSTRAINT `Employe_ordinateurId_fkey` FOREIGN KEY (`ordinateurId`) REFERENCES `Ordinateur`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ordinateur` ADD CONSTRAINT `Ordinateur_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
