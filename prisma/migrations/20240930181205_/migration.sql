/*
  Warnings:

  - Added the required column `modele` to the `Ordinateur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ordinateur` ADD COLUMN `modele` VARCHAR(255) NOT NULL;
