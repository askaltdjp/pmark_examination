-- CreateTable
CREATE TABLE "public"."t_employee" (
    "id" SERIAL NOT NULL,
    "employee_no" VARCHAR(64) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "email_address" VARCHAR(256) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "join_date" DATE NOT NULL,
    "create_at" TIMESTAMP(3),
    "update_at" TIMESTAMP(3),
    "delete_at" TIMESTAMP(3),

    CONSTRAINT "t_employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."t_test" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,
    "test_cnt" INTEGER NOT NULL DEFAULT 1,
    "correct_num" INTEGER NOT NULL,
    "result" INTEGER NOT NULL,
    "test_at" TIMESTAMP(3) NOT NULL,
    "create_at" TIMESTAMP(3),
    "update_at" TIMESTAMP(3),
    "delete_at" TIMESTAMP(3),

    CONSTRAINT "t_test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."t_test_answer" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "test_id" INTEGER NOT NULL,
    "test_cnt" INTEGER NOT NULL DEFAULT 1,
    "question_no" INTEGER NOT NULL,
    "answer" BOOLEAN NOT NULL DEFAULT false,
    "create_at" TIMESTAMP(3),
    "update_at" TIMESTAMP(3),
    "delete_at" TIMESTAMP(3),

    CONSTRAINT "t_test_answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "t_employee_employee_no_idx" ON "public"."t_employee"("employee_no");

-- CreateIndex
CREATE INDEX "t_employee_email_address_idx" ON "public"."t_employee"("email_address");

-- CreateIndex
CREATE UNIQUE INDEX "t_test_employee_id_test_id_test_cnt_key" ON "public"."t_test"("employee_id", "test_id", "test_cnt");

-- CreateIndex
CREATE UNIQUE INDEX "t_test_answer_employee_id_test_id_test_cnt_question_no_key" ON "public"."t_test_answer"("employee_id", "test_id", "test_cnt", "question_no");
