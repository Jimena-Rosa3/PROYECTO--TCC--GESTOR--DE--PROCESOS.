import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, Clock } from "lucide-react";

const NotificationPanel = ({ visible, notificaciones, onClose, onMarkRead }) => {
  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Fondo transparente */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          ></div>

          {/* Panel de notificaciones */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="absolute right-8 top-14 w-96 bg-white rounded-xl shadow-lg z-50 border border-gray-100"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Bell className="text-blue-600" size={18} /> Notificaciones
              </h2>
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-3">
              {notificaciones.length > 0 ? (
                notificaciones.map((notif) => (
                  <div
                    key={notif._id}
                    className={`p-3 mb-2 rounded-md border ${
                      notif.vista
                        ? "bg-gray-50 border-gray-200"
                        : "bg-blue-50 border-blue-200"
                    } hover:shadow-sm transition-all`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {notif.titulo}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {notif.mensaje}
                        </p>
                      </div>
                      {notif.vista ? (
                        <CheckCircle
                          className="text-green-500"
                          size={18}
                          title="Leída"
                        />
                      ) : (
                        <Clock
                          className="text-blue-500 cursor-pointer"
                          size={18}
                          title="Marcar como vista"
                          onClick={() => onMarkRead(notif._id)}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6 text-sm">
                  No hay notificaciones recientes.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationPanel;