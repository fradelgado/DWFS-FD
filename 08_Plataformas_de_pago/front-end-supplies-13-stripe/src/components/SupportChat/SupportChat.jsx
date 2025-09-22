import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import './SupportChat.css';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  const { messages, isConnected, isConnecting, connect, disconnect, sendMessage } = useChat();

  // Auto-scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      if (!isConnected && !isConnecting) {
        connect();
      }
    } else {
      setIsOpen(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim() && isConnected) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    disconnect();
  };

  return (
    <div className="support-chat">
      {/* Botón flotante para abrir el chat */}
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={handleToggleChat}>
          <span className="chat-icon">💬</span>
          <span className="chat-text">Soporte</span>
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="chat-window">
          {/* Header del chat */}
          <div className="chat-header">
            <h3>Chat de Soporte</h3>
            <div className="chat-status">
              {isConnecting && <span className="status connecting">Conectando...</span>}
              {isConnected && <span className="status connected">En línea</span>}
              {!isConnected && !isConnecting && <span className="status disconnected">Desconectado</span>}
            </div>
            <button className="chat-close-btn" onClick={handleCloseChat}>
              ✕
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="chat-messages">
            {messages.length === 0 && !isConnecting && (
              <div className="chat-welcome">
                <p>Haz clic en "Conectar" para iniciar el chat con soporte</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'user-message' : 'support-message'}`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">{message.timestamp}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input para enviar mensajes */}
          <div className="chat-input-area">
            {!isConnected && !isConnecting && (
              <button className="connect-btn" onClick={connect}>
                Conectar al soporte
              </button>
            )}

            {isConnected && (
              <form onSubmit={handleSendMessage} className="chat-form">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="chat-input"
                  disabled={!isConnected}
                />
                <button
                  type="submit"
                  className="chat-send-btn"
                  disabled={!messageInput.trim() || !isConnected}
                >
                  Enviar
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
