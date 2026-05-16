-- CreateTable
CREATE TABLE "email_jobs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriber_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" TEXT,
    "job_type" TEXT NOT NULL,
    "email_type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "scheduled_for" DATETIME NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "last_error" TEXT,
    "locked_at" DATETIME,
    "locked_by" TEXT,
    "processed_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "email_jobs_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "subscribers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "email_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subscriber_id" TEXT NOT NULL,
    "email_job_id" TEXT,
    "email" TEXT NOT NULL,
    "email_type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_message_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "error_message" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "sent_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "email_events_subscriber_id_fkey" FOREIGN KEY ("subscriber_id") REFERENCES "subscribers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "email_events_email_job_id_fkey" FOREIGN KEY ("email_job_id") REFERENCES "email_jobs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);


-- CreateIndex
CREATE INDEX "email_jobs_status_idx" ON "email_jobs"("status");

-- CreateIndex
CREATE INDEX "email_jobs_scheduled_for_idx" ON "email_jobs"("scheduled_for");

-- CreateIndex
CREATE INDEX "email_jobs_subscriber_id_idx" ON "email_jobs"("subscriber_id");

-- CreateIndex
CREATE INDEX "email_jobs_status_scheduled_for_idx" ON "email_jobs"("status", "scheduled_for");

-- CreateIndex
CREATE INDEX "email_events_subscriber_id_idx" ON "email_events"("subscriber_id");

-- CreateIndex
CREATE INDEX "email_events_email_type_idx" ON "email_events"("email_type");

-- CreateIndex
CREATE INDEX "email_events_status_idx" ON "email_events"("status");

-- CreateIndex
CREATE INDEX "email_events_subscriber_id_email_type_idx" ON "email_events"("subscriber_id", "email_type");

