import React from "react";

interface DeleteButtonProps {
  DeleteClick?: () => void;
  width: string;
  height: string;
}

const DeleteRoundButton: React.FC<DeleteButtonProps> = ({DeleteClick, width, height}) => {
  return(
  <div>
    <button 
      className="flex items-center justify-center rounded-full bg-gray-300 p-2 drop-shadow-lg"
      onClick={DeleteClick}
      >
      <span className={`i-material-symbols-light-delete-outline ${width} ${height}`}></span>
    </button>
  </div>
  )
}
export default DeleteRoundButton;
