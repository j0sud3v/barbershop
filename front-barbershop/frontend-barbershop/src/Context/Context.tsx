import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { API_URL, authFetch } from '../config/api';
import type { ContextType, ModalMBState, RolType } from '../types/ContextType/ContextType';

const defaultContextValue: ContextType = {
  chatOpen: false,
  setChatOpen: () => {},

  modalMBOpen: {
    open: false,
    type: "",
  },

  setModalMBOpen: () => {},

  inSession: false,
  setInSession: () => {},

  nombreUsuarioEnSesion: null,
  setNombreUsuarioEnSesion: () => {},

  idUsuarioEnSesion: null,
  setIdUsuarioEnSesion: () => {},

  rolUserEnSesion: undefined,
  setRolUserEnSesion: () => {},
};
// eslint-disable-next-line react-refresh/only-export-components
export const Context = createContext<ContextType>(defaultContextValue);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [ inSession, setInSession ] = useState(false)
  const [ nombreUsuarioEnSesion ,setNombreUsuarioEnSesion ] = useState<string | null>(null)
  const [ idUsuarioEnSesion, setIdUsuarioEnSesion ] = useState<number | null>(null)
  const [ rolUserEnSesion , setRolUserEnSesion ] = useState<RolType>(undefined)
  const [chatOpen, setChatOpen] = useState(false);
  const [modalMBOpen, setModalMBOpen] = useState<ModalMBState>({
    open: false,
    type: ''
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch(`${API_URL}/auth/me`);
        const data = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          usuario?: { id: number; email: string; rol: string; nombre?: string | null };
        };
        if (cancelled) return;
        if (res.ok && data.usuario && data.ok !== false) {
          setInSession(true);
          setIdUsuarioEnSesion(data.usuario.id);
          setNombreUsuarioEnSesion(data.usuario.nombre ?? data.usuario.email);
          setRolUserEnSesion(data.usuario.rol as RolType);
        }
      } catch {
        /* sin sesión o red caída */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Context.Provider value={{ 
      chatOpen, 
      setChatOpen, 
      modalMBOpen, 
      setModalMBOpen,
      inSession, 
      setInSession,
      nombreUsuarioEnSesion,
      setNombreUsuarioEnSesion,
      idUsuarioEnSesion,
      setIdUsuarioEnSesion,
      rolUserEnSesion,
      setRolUserEnSesion
    }}>
      {children}
    </Context.Provider>
  );
};