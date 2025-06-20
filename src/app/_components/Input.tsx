"use client"

import React from "react"
import { UseFormRegisterReturn } from "react-hook-form"
import Label from "./Label"

interface InputProps {
  id: string
  labelName: string
  type: string
  step?: string
  placeholder: string
  register: UseFormRegisterReturn
  error?: string
}

const Input: React.FC<InputProps> = ({ id, labelName, type, placeholder, step, register, error }) => {
  return(
    <div className="mb-6">
      <Label id={labelName}/>
      <input 
        className="appearance-none border border-primary rounded w-full h-10 py-2 px-3 bg-white text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
        id={id}
        type={type}
        step={step}
        placeholder={placeholder}
        {...register} 
      />
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      {id === "tags" && (
        <p className="text-xs mt-2 text-gray-800">
          ※タグを複数入力をする際はスペースで区切って入力してください。
        </p>
      )}
    </div>
  )
}
export default Input;