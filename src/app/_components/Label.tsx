"use client"

import React from "react"

interface LabelProps {
  id: string
}

const Label: React.FC<LabelProps> = ({id}) => {
  return(
    <label 
      className="block text-primary text-sm font-bold mb-2"
      id={id}
    >
    {id}
    </label>
  )
}
export default Label;
