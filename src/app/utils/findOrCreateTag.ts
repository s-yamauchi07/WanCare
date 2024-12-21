import { Prisma } from "@prisma/client";

export const findOrCreateTag = async(tx: Prisma.TransactionClient, tag: string) => {
  const tagName = await tx.tag.upsert({
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