-- CreateTable
CREATE TABLE "public"."m_test" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64),
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "question_num" INTEGER NOT NULL,
    "pass_num" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3),
    "update_at" TIMESTAMP(3),
    "delete_at" TIMESTAMP(3),

    CONSTRAINT "m_test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."m_test_question" (
    "id" SERIAL NOT NULL,
    "test_id" INTEGER NOT NULL,
    "question_no" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "commentary" TEXT,
    "correct" BOOLEAN NOT NULL,
    "create_at" TIMESTAMP(3),
    "update_at" TIMESTAMP(3),
    "delete_at" TIMESTAMP(3),

    CONSTRAINT "m_test_question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "m_test_question_test_id_question_no_key" ON "public"."m_test_question"("test_id", "question_no");
