-- CreateTable
CREATE TABLE "subscribers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "source" TEXT,
    "is_waitlist" BOOLEAN NOT NULL DEFAULT false,
    "is_newsletter" BOOLEAN NOT NULL DEFAULT false,
    "waitlist_joined_at" DATETIME,
    "newsletter_joined_at" DATETIME,
    "subscribed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "welcome_email_sent" BOOLEAN NOT NULL DEFAULT false,
    "welcome_email_type" TEXT,
    "welcome_sent_at" DATETIME,
    "ip_address" TEXT,
    "country" TEXT,
    "city" TEXT,
    "region" TEXT,
    "timezone" TEXT,
    "user_agent" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "device_type" TEXT,
    "referrer_url" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_term" TEXT,
    "utm_content" TEXT,
    "consent_given" BOOLEAN NOT NULL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "subscribers_email_key" ON "subscribers"("email");
