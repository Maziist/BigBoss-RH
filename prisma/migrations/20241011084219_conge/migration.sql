-- AlterTable
ALTER TABLE `leaverequest` ADD COLUMN `alternativeEndDate` DATETIME(3) NULL,
    ADD COLUMN `alternativeStartDate` DATETIME(3) NULL,
    MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'EN_ATTENTE';
