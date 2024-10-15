/*
  Warnings:

  - You are about to drop the column `role` on the `employe` table. All the data in the column will be lost.
  - You are about to drop the `_employetrainings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `training` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_employetrainings` DROP FOREIGN KEY `_EmployeTrainings_A_fkey`;

-- DropForeignKey
ALTER TABLE `_employetrainings` DROP FOREIGN KEY `_EmployeTrainings_B_fkey`;

-- AlterTable
ALTER TABLE `employe` DROP COLUMN `role`;

-- DropTable
DROP TABLE `_employetrainings`;

-- DropTable
DROP TABLE `training`;
