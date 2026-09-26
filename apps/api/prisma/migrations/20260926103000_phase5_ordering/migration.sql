-- Phase 5 ordering intake metadata. All additions are nullable or have defaults
-- so existing Phase 1-4 rows remain readable during deployment.
CREATE TYPE "IntakeRunStatus" AS ENUM ('OPEN', 'CLOSED', 'ARCHIVED');

CREATE TABLE "IntakeRun" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "deliveryDate" DATE NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 1,
    "cutoffAt" TIMESTAMP(3) NOT NULL,
    "status" "IntakeRunStatus" NOT NULL DEFAULT 'OPEN',
    "closedAt" TIMESTAMP(3),
    "depotId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntakeRun_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Order"
    ADD COLUMN "confirmedAt" TIMESTAMP(3),
    ADD COLUMN "requestedWindowOpen" TIME(0),
    ADD COLUMN "requestedWindowClose" TIME(0),
    ADD COLUMN "accessRequirement" TEXT,
    ADD COLUMN "mallWindow" TEXT,
    ADD COLUMN "intakeRunId" TEXT;

CREATE UNIQUE INDEX "IntakeRun_sourceId_key" ON "IntakeRun"("sourceId");
CREATE UNIQUE INDEX "IntakeRun_depotId_deliveryDate_sequence_key" ON "IntakeRun"("depotId", "deliveryDate", "sequence");
CREATE INDEX "IntakeRun_deliveryDate_status_idx" ON "IntakeRun"("deliveryDate", "status");
CREATE INDEX "Order_intakeRunId_status_idx" ON "Order"("intakeRunId", "status");

ALTER TABLE "IntakeRun"
    ADD CONSTRAINT "IntakeRun_depotId_fkey"
    FOREIGN KEY ("depotId") REFERENCES "Depot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Order"
    ADD CONSTRAINT "Order_intakeRunId_fkey"
    FOREIGN KEY ("intakeRunId") REFERENCES "IntakeRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;