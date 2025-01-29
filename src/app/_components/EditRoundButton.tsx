import React from "react";

interface EditButtonProps {
  editClick?: () => void;
  width: string;
  height: string;
}

const EditRoundButton: React.FC<EditButtonProps> = ({editClick, width, height}) => {
  return(
  <div>
    <button 
      className="flex items-center justify-center rounded-full bg-secondary p-2"
      onClick={editClick}
      >
      <span  className={`i-material-symbols-light-edit-square-outline ${width} ${height}`}></span>
    </button>
  </div>
  )
}
export default EditRoundButton;
