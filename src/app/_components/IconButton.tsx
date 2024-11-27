"use client"

import React from "react"

interface ButtonProps {
  iconName: string;
  buttonText: string;
}

const IconButton: React.FC<ButtonProps> = ({iconName, buttonText}) => {
  return(
    <button 
      type="button"
      className="text-white font-bold bg-primary hover:bg-emerald-500 rounded-full text-xs px-3 py-1.5 text-center inline-flex items-center">
      <span className={`${iconName} w-5 h-5 mr-1`}></span>
      {buttonText}
    </button>
  )
}
export default IconButton;