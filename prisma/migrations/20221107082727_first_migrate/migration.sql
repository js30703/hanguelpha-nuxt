-- CreateTable
CREATE TABLE "Verbs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "verb" STRING NOT NULL,
    "type" STRING NOT NULL,
    "level" STRING NOT NULL,
    "regularType" STRING NOT NULL,
    "eng" STRING NOT NULL,
    "exp" STRING NOT NULL,

    CONSTRAINT "Verbs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "uid" STRING NOT NULL,
    "email" STRING NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "VerbsOnUsers" (
    "verbId" UUID NOT NULL,
    "userId" STRING NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" STRING NOT NULL,

    CONSTRAINT "VerbsOnUsers_pkey" PRIMARY KEY ("verbId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "VerbsOnUsers" ADD CONSTRAINT "VerbsOnUsers_verbId_fkey" FOREIGN KEY ("verbId") REFERENCES "Verbs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerbsOnUsers" ADD CONSTRAINT "VerbsOnUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
