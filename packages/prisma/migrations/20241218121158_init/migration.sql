-- CreateTable
CREATE TABLE "EventType" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "length" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "key" JSONB NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT,
    "name" TEXT,
    "email" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
