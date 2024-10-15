/*
  Warnings:

  - You are about to alter the column `status` on the `task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `task` MODIFY `status` ENUM('A_FAIRE', 'EN_COURS', 'TERMINEE', 'ECHEANCE_DEPASSEE') NOT NULL;
