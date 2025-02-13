import { breedSeed }from "./breedSeed";
import { careSeed } from "./careSeed";
import prisma from "../../src/libs/prisma.js";

async function main() {
  try {
    await breedSeed(prisma);
    await careSeed(prisma);
  } catch (error) {
    console.log(error)
    process.exit(1) 
  } finally {
    await prisma.$disconnect();
  }
}

main();
