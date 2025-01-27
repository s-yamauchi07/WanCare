import React from "react";

interface EditButtonProps {
  EditClick?: () => void;

}

const EditRoundButton: React.FC<EditButtonProps> = ({EditClick}) => {
  return(
  <div>
    <button 
      className="flex items-center justify-center rounded-full bg-secondary p-2"
      onClick={EditClick}
      >
      <span  className="i-material-symbols-light-edit-square-outline w-8 h-8"></span>
    </button>
  </div>
  )
}
export default EditRoundButton;
