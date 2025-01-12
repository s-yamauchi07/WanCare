"use client"

import React from "react"

interface ButtonProps {
  iconName: string;
  buttonText: string;
  color: string;
  textColor: string;
}

const IconButton: React.FC<ButtonProps> = ({iconName, buttonText, color, textColor}) => {
  return(
    <button 
      type="button"
      className={`${textColor} ${color} rounded-full text-sm px-3 py-1.5 text-center inline-flex items-center`}>
      <span className={`${iconName} w-5 h-5 mr-1`}></span>
      {buttonText}
    </button>
  )
}
export default IconButton;