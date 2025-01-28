
import React from "react";
import { Modal } from "flowbite-react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  careId?: string;
  children: JSX.Element;
}

const ModalWindow: React.FC<ModalProps> = ({ show, onClose, children }) => {
  return(
    <Modal 
      show={show}
      size="sm"
      onClose={onClose}
      popup
    >
    <Modal.Header className="bg-main"/>
    <Modal.Body className="bg-main rounded-b-lg">
      {children}
    </Modal.Body>
  </Modal>
  )
}
export default ModalWindow;