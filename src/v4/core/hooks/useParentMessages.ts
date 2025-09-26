import { useEffect } from 'react';

type MessageHandler = (event: MessageEvent) => void;

function useParentMessage(eventName: string, onMessage: MessageHandler) {
  useEffect(() => {
    window.addEventListener(eventName, onMessage);

    return () => {
      window.removeEventListener(eventName, onMessage);
    };
  }, [onMessage]);
}

export default useParentMessage;

// Usage example:
/*  useParentMessage((event) => {
    // Verifica la provenienza del messaggio
    if (event.origin !== "https://dominio-del-padre.com") return;

    // Gestisci i dati
    console.log("Messaggio ricevuto dal padre:", event.data);
    // Puoi aggiornare lo stato o eseguire azioni qui
  });
 });
 */
