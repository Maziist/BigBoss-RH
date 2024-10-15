/*
  Warnings:

  - A unique constraint covering the columns `[macAddress]` on the table `Ordinateur` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `macAddress` to the `Ordinateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ordinateur` ADD COLUMN `defectiveAt` DATETIME(3) NULL,
    ADD COLUMN `isDefective` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `macAddress` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Ordinateur_macAddress_key` ON `Ordinateur`(`macAddress`);
