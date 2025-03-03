"use client"

import UserForm from "../users/[id]/_components/UserForm"

const SignUp = () => {

  return(
    <UserForm isEdit={false} isGuest={false}/>
  )
}

export default SignUp;