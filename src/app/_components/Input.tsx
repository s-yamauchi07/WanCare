"use client"

import React from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import Label from "./Label"

interface InputProps {
  id: string
  labelName: string
  type: string
  placeholder: string
  register: UseFormRegisterReturn
  error?: string
}

const Input: React.FC<InputProps> = ({ id, labelName, type, placeholder, register, error }) => {
  return(
    <div className="mb-6">
      <Label id={labelName}/>
      <input 
        className="appearance-none border border-primary rounded w-full h-10 py-2 px-3 border-primary bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        type={type}
        placeholder={placeholder}
        {...register} 
      />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  )
}
export default Input;