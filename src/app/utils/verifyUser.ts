export const verifyUser = async<T extends {ownerId: string}>(
  userId: string, 
  recordId: string, 
  model: { findUnique: (args : { where: { id: string } }) => Promise<T | null>}
) => {
  const record = await model.findUnique({
    where: {
      id: recordId
    },
  })

  if(!record) {
    throw new Error("record not found.")
  }

  if ( userId !== record.ownerId) {
    throw new Error("this authentication user doesn't match this record's writer.")
  }
}
