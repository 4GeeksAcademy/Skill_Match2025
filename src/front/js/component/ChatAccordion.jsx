import React, { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../store/appContext";
import MessageThread from "./MessageThread.jsx";
import "../../styles/ChatAccordion.css";
import pattern from "../../img/chat-pattern.png";

const ChatAccordion = () => {
  const { actions } = useContext(Context);

  // 1) controles de UI
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([]);
  const [reloadConvosFlag, setReloadConvosFlag] = useState(0);

  // 2) chat activo
  const [activeChat, setActiveChat] = useState(null);
  const [activeName, setActiveName] = useState("");

  // 3) nuevo mensaje
  const [newMessage, setNewMessage] = useState("");
  const [reloadThreadFlag, setReloadThreadFlag] = useState(0);

  // 4) ref para scroll automático
  const chatBodyRef = useRef(null);

  // 5) trae conversaciones siempre que cambie el flag
  useEffect(() => {
    async function loadConversations() {
      const res = await actions.getConversations();
      if (res.success) setList(res.conversations);
    }
    loadConversations();
  }, [actions, reloadConvosFlag]);

  // 6) total unreads para el badge
  const totalUnread = list.reduce((sum, c) => sum + (c.unread_count || 0), 0);

  // 7) abrir un chat: además de setear el activo, recarga convos
  const openChat = (userId, name) => {
    setActiveChat(userId);
    setActiveName(name);
    setReloadConvosFlag(f => f + 1);
  };

  // 8) enviar mensaje
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const res = await actions.sendMessage({
      recipient_id: activeChat,
      content: newMessage
    });
    if (res.success) {
      setNewMessage("");
      setReloadThreadFlag(f => f + 1);
      setReloadConvosFlag(f => f + 1);
    }
  };

  // 9) efecto para scrollear al fondo cuando cambia chat o llegan nuevos mensajes
  useEffect(() => {
    if (chatBodyRef.current) {
      // Pequeño delay para que el DOM pinte el contenido
      setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }, 0);
    }
  }, [activeChat, reloadThreadFlag]);

  return (
    <div style={{ width: "100%" }}>
      {/* -- Botón Mensajes con badge -- */}
      <button
        className="btn btn-outline-secondary w-100 mb-2 d-flex align-items-center justify-content-center"
        onClick={() => setOpen(o => !o)}
      >
        <i className="bi bi-envelope-fill me-2"></i>
        Mensajes
        {totalUnread > 0 && (
          <span className="badge bg-danger ms-2">{totalUnread}</span>
        )}
        <i className={`bi ms-auto ${open ? "bi-caret-up-fill" : "bi-caret-down-fill"}`}></i>
      </button>

      {/* -- Lista de conversaciones -- */}
      {open && (
        <div className="list-group mb-3" style={{ maxHeight: "200px", overflowY: "auto" }}>
          {list.length > 0 ? (
            list.map(c => (
              <button
                key={c.user_id}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => openChat(c.user_id, c.name)}
              >
                <div>
                  <i className="bi bi-person-circle me-2"></i>
                  {c.name}
                </div>
                {c.unread_count > 0 && <span className="unread-dot"></span>}
              </button>
            ))
          ) : (
            <div className="list-group-item text-muted">No tienes conversaciones</div>
          )}
        </div>
      )}

      {/* -- Modal de chat -- */}
      {activeChat && (
        <>
          <div className="modal d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title">Chat con {activeName}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setActiveChat(null)}
                  />
                </div>
                {/* Body: fondo repetido + scroll interno */}
                <div className="modal-body p-0 d-flex flex-column">
                  <div
                    ref={chatBodyRef}
                    className="chat-body flex-grow-1"
                    style={{
                      backgroundImage: `url(${pattern})`,
                      backgroundRepeat: "repeat",
                      overflowY: "auto",
                      maxHeight: "60vh"
                    }}
                  >
                    <MessageThread
                      otherId={activeChat}
                      otherName={activeName}
                      reloadFlag={reloadThreadFlag}
                    />
                  </div>
                  {/* Footer */}
                  <div className="chat-footer p-3 border-top">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Escribe tu mensaje…"
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSend()}
                      />
                      <button className="btn btn-primary" onClick={handleSend}>
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default ChatAccordion;
