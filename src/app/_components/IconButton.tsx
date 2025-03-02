"use client"

import React from "react"

interface ButtonProps {
  iconName: string;
  buttonText: string;
  color: string;
  textColor: string;
  width?: string
}

const IconButton: React.FC<ButtonProps> = ({iconName, buttonText, color, textColor, width}) => {
  return(
    <button 
      type="button"
      className={`${textColor} ${color} rounded-full text-sm px-3 py-1.5 text-center inline-flex items-center justify-center ${width}`}>
      <span className={`${iconName} w-5 h-5 mr-1`}></span>
      {buttonText}
    </button>
  )
}
export default IconButton;