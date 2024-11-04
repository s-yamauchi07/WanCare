import { PrismaClient } from "@prisma/client"

export const verifyUser = async(userId: string, recordId: string, prisma: PrismaClient) => {
  const record = await prisma.diary.findUnique({
    where: {
      id: recordId
    },
  })

  if(!record) {
    throw new Error("diary record not found.")
  }

  if ( userId !== record.ownerId) {
    throw new Error("this authentication user doesn't match this diary record writer.")
  }
}
