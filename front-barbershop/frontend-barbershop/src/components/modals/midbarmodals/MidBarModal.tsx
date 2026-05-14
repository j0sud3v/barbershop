import { useContext } from 'react';
import { Context } from '../../../Context/Context';

type MidBarModalType = {
  title: string;
  image?: string;
  description: string;
};

type ModalMBState = {
  open: boolean;
  type: string;
};

const MidBarModal = ({ title, description }: MidBarModalType) => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('MidBarModal must be used within an AppProvider');
  }

  const { modalMBOpen, setModalMBOpen } = context as {
    modalMBOpen: ModalMBState;
    setModalMBOpen: React.Dispatch<React.SetStateAction<ModalMBState>>;
  };

  return (
    <>
      {modalMBOpen.open && (
        <div className="fixed diploma bg-[rgba(0,0,0,.7)] w-full min-h-screen grid place-items-center top-0 left-0">
          <div className="bg-black/90 backdrop-blur-sm rounded-lg border border-white/80 w-[80%] h-100 lg:h-150">
            <span
              className="text-white text-lg lg:text-xl cursor-pointer top-0 w-full flex items-end justify-end p-2 "
              onClick={() => setModalMBOpen({ open: false, type: "" })}
            >
              Cerrar
            </span>

            <div className="flex items-center justify-center flex-col h-[80%] px-5 py-4">
              <span className="text-4xl lg:text-6xl text-white text-center">
                {title}
              </span>

              <p className="text-white text-center p-3 anthelion">
                {description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MidBarModal;