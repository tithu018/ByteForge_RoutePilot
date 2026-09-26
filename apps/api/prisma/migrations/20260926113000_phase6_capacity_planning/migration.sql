-- Phase 6 capacity planning facts and validation history.
-- Additive migration: existing plans, vehicles and orders remain readable.

CREATE TYPE "PlanValidationStatus" AS ENUM ('NOT_RUN', 'PASSED', 'BLOCKED');

CREATE TABLE "PlanValidation" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planVersion" INTEGER NOT NULL,
    "status" "PlanValidationStatus" NOT NULL DEFAULT 'NOT_RUN',
    "blockingIssues" JSONB,
    "advisoryIssues" JSONB,
    "checkedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanValidation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlanCapacitySnapshot" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "vehicleType" "VehicleType" NOT NULL,
    "temperature" "TemperatureType" NOT NULL,
    "available" BOOLEAN NOT NULL,
    "tripCount" INTEGER NOT NULL DEFAULT 0,
    "weightCapacityKg" DECIMAL(12,3) NOT NULL,
    "volumeCapacityM3" DECIMAL(12,3) NOT NULL,
    "weightUsedKg" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "volumeUsedM3" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "weeklyFuelQuotaL" DECIMAL(12,3) NOT NULL,
    "reservedFuelL" DECIMAL(12,3),
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanCapacitySnapshot_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CapacityPlanningScenario" (
    "id" TEXT NOT NULL,
    "depotId" TEXT NOT NULL,
    "brandId" TEXT,
    "isoYear" INTEGER NOT NULL,
    "isoWeek" INTEGER NOT NULL,
    "horizonStart" DATE NOT NULL,
    "horizonEnd" DATE NOT NULL,
    "totalVolumeM3" DECIMAL(12,3) NOT NULL,
    "chilledVolumeM3" DECIMAL(12,3) NOT NULL,
    "sourceLabel" TEXT NOT NULL,
    "sourceRunDate" TIMESTAMP(3),
    "assumptions" JSONB,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CapacityPlanningScenario_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PlanValidation_planId_planVersion_key"
    ON "PlanValidation"("planId", "planVersion");
CREATE INDEX "PlanValidation_status_checkedAt_idx"
    ON "PlanValidation"("status", "checkedAt");
CREATE UNIQUE INDEX "PlanCapacitySnapshot_planId_vehicleId_key"
    ON "PlanCapacitySnapshot"("planId", "vehicleId");
CREATE INDEX "PlanCapacitySnapshot_vehicleId_capturedAt_idx"
    ON "PlanCapacitySnapshot"("vehicleId", "capturedAt");
CREATE UNIQUE INDEX "CapacityPlanningScenario_depotId_brandId_isoYear_isoWeek_key"
    ON "CapacityPlanningScenario"("depotId", "brandId", "isoYear", "isoWeek");
CREATE INDEX "CapacityPlanningScenario_isoYear_isoWeek_idx"
    ON "CapacityPlanningScenario"("isoYear", "isoWeek");

ALTER TABLE "PlanValidation"
    ADD CONSTRAINT "PlanValidation_planId_fkey"
    FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PlanCapacitySnapshot"
    ADD CONSTRAINT "PlanCapacitySnapshot_planId_fkey"
    FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PlanCapacitySnapshot"
    ADD CONSTRAINT "PlanCapacitySnapshot_vehicleId_fkey"
    FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CapacityPlanningScenario"
    ADD CONSTRAINT "CapacityPlanningScenario_depotId_fkey"
    FOREIGN KEY ("depotId") REFERENCES "Depot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CapacityPlanningScenario"
    ADD CONSTRAINT "CapacityPlanningScenario_brandId_fkey"
    FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PlanCapacitySnapshot"
    ADD CONSTRAINT "PlanCapacitySnapshot_nonnegative_check"
    CHECK (
        "tripCount" >= 0
        AND "weightCapacityKg" >= 0
        AND "volumeCapacityM3" >= 0
        AND "weightUsedKg" >= 0
        AND "volumeUsedM3" >= 0
        AND "weeklyFuelQuotaL" >= 0
        AND ("reservedFuelL" IS NULL OR "reservedFuelL" >= 0)
    );
ALTER TABLE "CapacityPlanningScenario"
    ADD CONSTRAINT "CapacityPlanningScenario_volume_check"
    CHECK (
        "isoWeek" BETWEEN 1 AND 53
        AND "horizonEnd" >= "horizonStart"
        AND "totalVolumeM3" >= 0
        AND "chilledVolumeM3" >= 0
        AND "chilledVolumeM3" <= "totalVolumeM3"
    );
