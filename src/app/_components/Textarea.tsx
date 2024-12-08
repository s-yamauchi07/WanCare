"use client"

import React from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import Label from "./Label"

interface InputProps {
  id: string;
  labelName: string;
  placeholder: string
  register: UseFormRegisterReturn
  error?: string
}

const Textarea: React.FC<InputProps> = ({
  id,
  labelName,
  placeholder,
  register,
  error
}) => {
  return(
    <div className="mb-6">
      <Label id={labelName} />
      <textarea
        className="border border-primary rounded w-full py-2 px-3 border-primary bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        placeholder={placeholder}
        {...register}
      ></textarea>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
export default Textarea;