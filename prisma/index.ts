import { PrismaClient } from "@prisma/client";

// "Make sure next js hot reloading doesn't create a new prisma instance every hot reload"
// FROM: https://github.com/prisma/prisma/issues/1983#issuecomment-620621213

namespace global {
  export let prisma: PrismaClient;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }

  prisma = global.prisma;
}

export { prisma };
