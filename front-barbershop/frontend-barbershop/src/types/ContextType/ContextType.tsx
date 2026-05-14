import type React from "react";

export type ModalType =
  | "location"
  | "contact"
  | "schedule"
  | "";

export type ModalMBState = {
  open: boolean;
  type: ModalType;
};

export type RolType =
  | "admin"
  | "cliente"
  | undefined;

export interface ContextType {
  chatOpen: boolean;
  setChatOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  modalMBOpen: ModalMBState;
  setModalMBOpen: React.Dispatch<
    React.SetStateAction<ModalMBState>
  >;

  inSession: boolean;
  setInSession: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  nombreUsuarioEnSesion: string | null;
  setNombreUsuarioEnSesion: React.Dispatch<
    React.SetStateAction<string | null>
  >;

  idUsuarioEnSesion: number | null;
  setIdUsuarioEnSesion: React.Dispatch<
    React.SetStateAction<number | null>
  >;

  rolUserEnSesion: RolType;
  setRolUserEnSesion: React.Dispatch<
    React.SetStateAction<RolType>
  >;
}