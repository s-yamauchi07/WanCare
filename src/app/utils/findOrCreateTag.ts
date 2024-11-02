import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

export const findOrCreateTag = async(tag: string) => {
  let tagName = await prisma.tag.findUnique({
    where: {
      name: tag
    },
  });

  if (!tagName) {
    tagName = await prisma.tag.create({
      data: {
        name: tag
      },
    });
  }

  return tagName;
}