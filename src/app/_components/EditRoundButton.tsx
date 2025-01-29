import React from "react";

interface EditButtonProps {
  EditClick?: () => void;
  width: string;
  height: string;
}

const EditRoundButton: React.FC<EditButtonProps> = ({EditClick, width, height}) => {
  return(
  <div>
    <button 
      className="flex items-center justify-center rounded-full bg-secondary p-2"
      onClick={EditClick}
      >
      <span  className={`i-material-symbols-light-edit-square-outline ${width} ${height}`}></span>
    </button>
  </div>
  )
}
export default EditRoundButton;
