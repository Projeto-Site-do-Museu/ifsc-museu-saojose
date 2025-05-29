-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senhaHash` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Categoria_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Midia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `arquivo` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `altText` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `tamanhoArquivo` INTEGER NOT NULL,
    `largura` INTEGER NOT NULL,
    `altura` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Galeria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `midiaId` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Carousel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `midiaId` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `texto` VARCHAR(191) NOT NULL,
    `linkExterno` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Artigo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `resumo` VARCHAR(191) NOT NULL,
    `conteudo` VARCHAR(191) NOT NULL,
    `imagemDestaqueId` INTEGER NOT NULL,
    `categoriaId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `dataPublicacao` DATETIME(3) NOT NULL,
    `destaque` BOOLEAN NOT NULL DEFAULT false,
    `visualizacoes` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Artigo_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArtigoMidia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `artigoId` INTEGER NOT NULL,
    `midiaId` INTEGER NOT NULL,
    `legenda` VARCHAR(191) NOT NULL,
    `ordem` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VideoEspecial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `midiaId` INTEGER NOT NULL,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `thumbnailId` INTEGER NOT NULL,
    `duracao` INTEGER NOT NULL,
    `ordem` INTEGER NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContadorVisitante` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contador` INTEGER NOT NULL,
    `dataRegistro` DATETIME(3) NOT NULL,
    `ipOrigem` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Configuracao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chave` VARCHAR(191) NOT NULL,
    `valor` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Configuracao_chave_key`(`chave`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogAtividade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `acao` VARCHAR(191) NOT NULL,
    `tabelaAfetada` VARCHAR(191) NOT NULL,
    `idRegistro` INTEGER NOT NULL,
    `dadosAnteriores` JSON NOT NULL,
    `dadosNovos` JSON NOT NULL,
    `ipOrigem` VARCHAR(191) NOT NULL,
    `userAgent` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Midia` ADD CONSTRAINT `Midia_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Midia` ADD CONSTRAINT `Midia_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Galeria` ADD CONSTRAINT `Galeria_midiaId_fkey` FOREIGN KEY (`midiaId`) REFERENCES `Midia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Carousel` ADD CONSTRAINT `Carousel_midiaId_fkey` FOREIGN KEY (`midiaId`) REFERENCES `Midia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Artigo` ADD CONSTRAINT `Artigo_imagemDestaqueId_fkey` FOREIGN KEY (`imagemDestaqueId`) REFERENCES `Midia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Artigo` ADD CONSTRAINT `Artigo_categoriaId_fkey` FOREIGN KEY (`categoriaId`) REFERENCES `Categoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Artigo` ADD CONSTRAINT `Artigo_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArtigoMidia` ADD CONSTRAINT `ArtigoMidia_artigoId_fkey` FOREIGN KEY (`artigoId`) REFERENCES `Artigo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArtigoMidia` ADD CONSTRAINT `ArtigoMidia_midiaId_fkey` FOREIGN KEY (`midiaId`) REFERENCES `Midia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoEspecial` ADD CONSTRAINT `VideoEspecial_midiaId_fkey` FOREIGN KEY (`midiaId`) REFERENCES `Midia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VideoEspecial` ADD CONSTRAINT `VideoEspecial_thumbnailId_fkey` FOREIGN KEY (`thumbnailId`) REFERENCES `Midia`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogAtividade` ADD CONSTRAINT `LogAtividade_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
