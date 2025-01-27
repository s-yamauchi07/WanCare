import React from "react";

interface DeleteButtonProps {
  DeleteClick?: () => void;
}

const DeleteRoundButton: React.FC<DeleteButtonProps> = ({DeleteClick}) => {
  return(
  <div>
    <button 
      className="flex items-center justify-center rounded-full bg-gray-300 p-2"
      onClick={DeleteClick}
      >
      <span className="i-material-symbols-light-delete-outline w-8 h-8"></span>
    </button>
  </div>
  )
}
export default DeleteRoundButton;
