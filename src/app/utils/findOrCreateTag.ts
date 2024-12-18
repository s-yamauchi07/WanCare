import prisma from "@/libs/prisma";

export const findOrCreateTag = async(tag: string) => {
  const tagName = await prisma.tag.upsert({
    where: {
      name: tag
    },
    update: {},
    create: {
      name: tag,
    },
  });

  return tagName;
}