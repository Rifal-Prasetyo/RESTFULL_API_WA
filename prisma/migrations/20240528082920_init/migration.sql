-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `noWa` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `password` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `organization` VARCHAR(191) NOT NULL,
    `name_project` VARCHAR(191) NOT NULL,
    `isVerified` INTEGER NOT NULL DEFAULT 0,
    `isTermsofService` INTEGER NOT NULL DEFAULT 0,
    `isBanned` INTEGER NOT NULL DEFAULT 0,
    `image` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiPush` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('PERSONAL', 'GROUP') NOT NULL,
    `type_msg` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `toMsg` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApiKey` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `api` VARCHAR(191) NOT NULL,
    `totalUse` INTEGER NOT NULL,

    UNIQUE INDEX `ApiKey_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Announcements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `isShow` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `log` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nameUser` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `useBot` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ApiPush` ADD CONSTRAINT `ApiPush_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ApiKey` ADD CONSTRAINT `ApiKey_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcements` ADD CONSTRAINT `Announcements_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
