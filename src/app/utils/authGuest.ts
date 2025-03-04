export const authGuest = (email: string | null | undefined) : boolean => {
  return email === process.env.NEXT_PUBLIC_GUEST_USER_EMAIL;
}
