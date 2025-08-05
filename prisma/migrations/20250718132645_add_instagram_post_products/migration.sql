-- CreateTable
CREATE TABLE "InstagramPostProduct" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productTitle" TEXT,
    "productHandle" TEXT,
    "productImage" TEXT,
    "productPrice" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InstagramPostProduct_postId_fkey" FOREIGN KEY ("postId") REFERENCES "InstagramPost" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "InstagramPostProduct_postId_idx" ON "InstagramPostProduct"("postId");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramPostProduct_postId_productId_key" ON "InstagramPostProduct"("postId", "productId");
