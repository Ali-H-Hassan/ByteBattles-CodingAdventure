import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./LogoutConfirmModal.css";

const LogoutConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="logout-confirm-modal-overlay" onClick={onCancel}>
      <div className="logout-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="logout-confirm-modal-close" onClick={onCancel}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="logout-confirm-modal-content">
          <div className="logout-confirm-icon">
            <FontAwesomeIcon icon={faSignOutAlt} />
          </div>
          <h2 className="logout-confirm-title">Log Out</h2>
          <p className="logout-confirm-message">Are you sure you want to log out?</p>
          
          <div className="logout-confirm-buttons">
            <button className="logout-confirm-btn logout-confirm-btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button className="logout-confirm-btn logout-confirm-btn-confirm" onClick={onConfirm}>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;

