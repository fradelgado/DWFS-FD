import { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { API_ROUTES } from '../utils/apiConfig';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const stompClient = useRef(null);
  const clientIdRef = useRef(null);

  // Crear el cliente STOMP al cargar la página
  useEffect(() => {
    // Generar un clientId único para esta sesión
    clientIdRef.current = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Usar la configuración del gateway igual que los otros microservicios
    const wsUrl = `${API_ROUTES.COMMUNICATIONS.replace('http', 'ws')}/ws-api/v1/communications`;

    stompClient.current = new Client({
      brokerURL: wsUrl
    });

    stompClient.current.onConnect = (frame) => {
      setIsConnected(true);
      setIsConnecting(false);
      console.log('✅ Connected: ' + frame);

      // Suscribirse al topic con ID fijo 123456 como en el ejemplo
      stompClient.current.subscribe('/topic/support/123456', (message) => {
        console.log('Mensaje recibido:', message.body);

        try {
          const data = JSON.parse(message.body);

          // Solo agregar mensajes que NO sean del tipo CLIENT_MESSAGE para evitar duplicados
          if (data.type !== 'CLIENT_MESSAGE') {
            setMessages(prev => [...prev, {
              id: Date.now() + Math.random(),
              text: data.message,
              sender: data.type === 'SUPPORT_RESPONSE' ? 'support' :
                     data.type === 'SYSTEM_MESSAGE' ? 'system' : 'user',
              timestamp: new Date().toLocaleTimeString(),
              type: data.type
            }]);
          }
        } catch (error) {
          setMessages(prev => [...prev, {
            id: Date.now() + Math.random(),
            text: message.body,
            sender: 'support',
            timestamp: new Date().toLocaleTimeString()
          }]);
        }
      });

      // Mensaje de bienvenida preconfigurado cuando la conexión sea exitosa
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: 'Escribe cualquier duda y nuestros expertos te atenderán...',
        sender: 'support',
        timestamp: new Date().toLocaleTimeString(),
        type: 'SYSTEM_MESSAGE'
      }]);
    };

    stompClient.current.onWebSocketError = (error) => {
      console.error('❌ Error with websocket', error);
      setIsConnected(false);
      setIsConnecting(false);
    };

    stompClient.current.onStompError = (frame) => {
      console.error('❌ Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      setIsConnected(false);
      setIsConnecting(false);
    };

    // Cleanup al desmontar
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, []);

  const connect = () => {
    if (isConnected || isConnecting) {
      return;
    }

    setIsConnecting(true);
    console.log('🔗 Activando conexión...');
    console.log('🆔 Cliente ID:', clientIdRef.current);

    // Solo activar la conexión
    stompClient.current.activate();
  };

  const disconnect = () => {
    console.log('🔌 Desconectando...');

    if (stompClient.current) {
      stompClient.current.deactivate();
    }

    setIsConnected(false);
    setIsConnecting(false);
    setMessages([]);
  };

  const sendMessage = (message) => {
    if (!isConnected || !message.trim()) {
      return;
    }

    // Agregar mensaje del usuario inmediatamente
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString(),
      type: 'CLIENT_MESSAGE'
    }]);

    // Crear el objeto que mapea con SupportChatMessage de Java
    const supportChatMessage = {
      clientId: clientIdRef.current,
      message: message,
      type: 'CLIENT_MESSAGE',
      sender: 'user'
      // timestamp se genera automáticamente en el backend
    };

    console.log('📤 Enviando mensaje:', supportChatMessage);

    // Enviar al servidor usando el nuevo prefijo "unir-supplies"
    stompClient.current.publish({
      destination: '/unir-supplies/support/message',
      body: JSON.stringify(supportChatMessage)
    });
  };

  return {
    messages,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    sendMessage
  };
}
