-- CreateTable
CREATE TABLE `t_employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_no` VARCHAR(64) NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    `email_address` VARCHAR(256) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `join_date` DATE NOT NULL,
    `create_at` DATETIME(3) NULL,
    `update_at` DATETIME(3) NULL,
    `delete_at` DATETIME(3) NULL,

    INDEX `t_employee_employee_no_idx`(`employee_no`),
    INDEX `t_employee_email_address_idx`(`email_address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `t_test` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `test_id` INTEGER NOT NULL,
    `test_cnt` INTEGER NOT NULL DEFAULT 1,
    `correct_num` INTEGER NOT NULL,
    `result` INTEGER NOT NULL,
    `test_at` DATETIME(3) NOT NULL,
    `create_at` DATETIME(3) NULL,
    `update_at` DATETIME(3) NULL,
    `delete_at` DATETIME(3) NULL,

    UNIQUE INDEX `t_test_employee_id_test_id_test_cnt_key`(`employee_id`, `test_id`, `test_cnt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `t_test_answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employee_id` INTEGER NOT NULL,
    `test_id` INTEGER NOT NULL,
    `test_cnt` INTEGER NOT NULL DEFAULT 1,
    `question_no` INTEGER NOT NULL,
    `answer` BOOLEAN NOT NULL DEFAULT false,
    `create_at` DATETIME(3) NULL,
    `update_at` DATETIME(3) NULL,
    `delete_at` DATETIME(3) NULL,

    UNIQUE INDEX `t_test_answer_employee_id_test_id_test_cnt_question_no_key`(`employee_id`, `test_id`, `test_cnt`, `question_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
