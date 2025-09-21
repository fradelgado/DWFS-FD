import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useLogin } from '../../hooks/useLogin';
import './SessionRenewalModal.css';

export default function SessionRenewalModal() {
  const { accessToken, showRenewalModal, setShowRenewalModal, clearSession } = useContext(AuthContext);
  const { renewSession } = useLogin();

  const handleRenewSession = async () => {
    const result = await renewSession(accessToken);
    if (result.success) {
      setShowRenewalModal(false);
    }
  };

  const handleCloseSession = () => {
    clearSession();
    setShowRenewalModal(false);
  };

  if (!showRenewalModal) return null;

  return (
    <div className="modal-overlay">
      <div className="renewal-modal">
        <h3>⏰ Sesión próxima a expirar</h3>
        <p>Tu sesión expirará en breve. ¿Deseas mantenerla activa?</p>
        <div className="modal-buttons">
          <button
            className="btn-primary"
            onClick={handleRenewSession}
          >
            Mantener sesión activa
          </button>
          <button
            className="btn-secondary"
            onClick={handleCloseSession}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
