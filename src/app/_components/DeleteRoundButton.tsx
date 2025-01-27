import React from "react";

const DeleteRoundButton: React.FC = () => {
  return(
  <div>
    <button className="flex items-center justify-center rounded-full bg-gray-300 p-2">
      <span className="i-material-symbols-light-delete-outline w-8 h-8"></span>
    </button>
  </div>
  )
}
export default DeleteRoundButton;
