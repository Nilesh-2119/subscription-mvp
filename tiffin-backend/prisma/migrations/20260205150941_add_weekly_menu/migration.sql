-- CreateTable
CREATE TABLE "weekly_menus" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vendorId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "lunch" TEXT NOT NULL,
    "dinner" TEXT,
    "isVeg" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "weekly_menus_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor_profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "weekly_menus_vendorId_day_key" ON "weekly_menus"("vendorId", "day");
