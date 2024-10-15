-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nom` VARCHAR(191) NOT NULL,
    `siret` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `directeur` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Company_siret_key`(`siret`),
    UNIQUE INDEX `Company_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Employe` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photo` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `fonction` VARCHAR(191) NOT NULL,
    `nombreBlame` INTEGER NOT NULL DEFAULT 0,
    `companyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employe` ADD CONSTRAINT `Employe_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
