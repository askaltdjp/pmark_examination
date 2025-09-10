-- DropIndex
DROP INDEX "public"."m_test_question_test_id_question_no_key";

-- CreateIndex
CREATE INDEX "m_test_question_test_id_question_no_idx" ON "public"."m_test_question"("test_id", "question_no");
