-- CreateTable
CREATE TABLE "MTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "question_num" INTEGER NOT NULL,
    "pass_num" INTEGER NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME
);

-- CreateTable
CREATE TABLE "MTestQuestion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "test_id" INTEGER NOT NULL,
    "question_no" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "commentary" TEXT,
    "correct" BOOLEAN NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME
);

-- CreateTable
CREATE TABLE "TEmployee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email_address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "join_date" DATETIME NOT NULL,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME
);

-- CreateTable
CREATE TABLE "TTest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,
    "test_cnt" INTEGER NOT NULL DEFAULT 1,
    "correct_num" INTEGER NOT NULL,
    "result" INTEGER NOT NULL,
    "test_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME
);

-- CreateTable
CREATE TABLE "TTestAnswer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employee_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,
    "test_cnt" INTEGER NOT NULL DEFAULT 1,
    "question_no" INTEGER NOT NULL,
    "answer" BOOLEAN NOT NULL DEFAULT false,
    "create_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delete_at" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "MTestQuestion_test_id_question_no_key" ON "MTestQuestion"("test_id", "question_no");

-- CreateIndex
CREATE UNIQUE INDEX "TTest_employee_id_test_id_test_cnt_key" ON "TTest"("employee_id", "test_id", "test_cnt");

-- CreateIndex
CREATE UNIQUE INDEX "TTestAnswer_employee_id_test_id_test_cnt_question_no_key" ON "TTestAnswer"("employee_id", "test_id", "test_cnt", "question_no");
