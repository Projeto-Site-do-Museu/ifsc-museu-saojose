/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `Artigo` table. All the data in the column will be lost.
  - You are about to drop the column `destaque` on the `Artigo` table. All the data in the column will be lost.
  - You are about to drop the column `imagemDestaqueId` on the `Artigo` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Artigo` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Artigo` table. All the data in the column will be lost.
  - You are about to drop the column `visualizacoes` on the `Artigo` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Configuracao` table. All the data in the column will be lost.
  - You are about to drop the column `duracao` on the `VideoEspecial` table. All the data in the column will be lost.
  - You are about to drop the column `midiaId` on the `VideoEspecial` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailId` on the `VideoEspecial` table. All the data in the column will be lost.
  - You are about to drop the `ArtigoMidia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Carousel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Galeria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LogAtividade` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Midia` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `VideoEspecial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `VideoEspecial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video` to the `VideoEspecial` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Artigo` DROP FOREIGN KEY `Artigo_categoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `Artigo` DROP FOREIGN KEY `Artigo_imagemDestaqueId_fkey`;

-- DropForeignKey
ALTER TABLE `ArtigoMidia` DROP FOREIGN KEY `ArtigoMidia_artigoId_fkey`;

-- DropForeignKey
ALTER TABLE `ArtigoMidia` DROP FOREIGN KEY `ArtigoMidia_midiaId_fkey`;

-- DropForeignKey
ALTER TABLE `Carousel` DROP FOREIGN KEY `Carousel_midiaId_fkey`;

-- DropForeignKey
ALTER TABLE `Galeria` DROP FOREIGN KEY `Galeria_midiaId_fkey`;

-- DropForeignKey
ALTER TABLE `LogAtividade` DROP FOREIGN KEY `LogAtividade_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `Midia` DROP FOREIGN KEY `Midia_categoriaId_fkey`;

-- DropForeignKey
ALTER TABLE `Midia` DROP FOREIGN KEY `Midia_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `VideoEspecial` DROP FOREIGN KEY `VideoEspecial_midiaId_fkey`;

-- DropForeignKey
ALTER TABLE `VideoEspecial` DROP FOREIGN KEY `VideoEspecial_thumbnailId_fkey`;

-- DropIndex
DROP INDEX `Artigo_categoriaId_fkey` ON `Artigo`;

-- DropIndex
DROP INDEX `Artigo_imagemDestaqueId_fkey` ON `Artigo`;

-- DropIndex
DROP INDEX `Artigo_slug_key` ON `Artigo`;

-- DropIndex
DROP INDEX `VideoEspecial_midiaId_fkey` ON `VideoEspecial`;

-- DropIndex
DROP INDEX `VideoEspecial_thumbnailId_fkey` ON `VideoEspecial`;

-- AlterTable
ALTER TABLE `Artigo` DROP COLUMN `categoriaId`,
    DROP COLUMN `destaque`,
    DROP COLUMN `imagemDestaqueId`,
    DROP COLUMN `slug`,
    DROP COLUMN `status`,
    DROP COLUMN `visualizacoes`,
    ADD COLUMN `ativo` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `imagem` VARCHAR(191) NULL,
    ADD COLUMN `video` VARCHAR(191) NULL,
    MODIFY `resumo` TEXT NULL,
    MODIFY `conteudo` LONGTEXT NOT NULL,
    MODIFY `dataPublicacao` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Configuracao` DROP COLUMN `tipo`,
    MODIFY `valor` TEXT NOT NULL,
    MODIFY `descricao` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ContadorVisitante` MODIFY `ipOrigem` VARCHAR(191) NULL,
    MODIFY `userAgent` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `VideoEspecial` DROP COLUMN `duracao`,
    DROP COLUMN `midiaId`,
    DROP COLUMN `thumbnailId`,
    ADD COLUMN `thumbnail` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `usuarioId` INTEGER NOT NULL,
    ADD COLUMN `video` VARCHAR(191) NOT NULL,
    MODIFY `descricao` TEXT NULL,
    MODIFY `ordem` INTEGER NULL;

-- DropTable
DROP TABLE `ArtigoMidia`;

-- DropTable
DROP TABLE `Carousel`;

-- DropTable
DROP TABLE `Categoria`;

-- DropTable
DROP TABLE `Galeria`;

-- DropTable
DROP TABLE `LogAtividade`;

-- DropTable
DROP TABLE `Midia`;

-- CreateTable
CREATE TABLE `Acervo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `imagem` VARCHAR(191) NULL,
    `video` VARCHAR(191) NULL,
    `ordem` INTEGER NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Acervo` ADD CONSTRAINT `Acervo_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoEspecial` ADD CONSTRAINT `VideoEspecial_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
