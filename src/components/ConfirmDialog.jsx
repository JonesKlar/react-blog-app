import { useEffect } from 'react';

export default function ConfirmDialog({ open, onConfirm, onCancel, title, message }) {
  
  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onCancel();
    if (open) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onCancel]);

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`}>
      <div
        className="
          modal-box
          w-11/12        /* fast volle Breite mobil */
          max-w-xs       /* maximal 20rem auf kleineren Geräten */
          md:max-w-md    /* maximal 28rem ab md */        
          px-4           /* horizontales Padding */
          py-5           /* vertikales Padding */
        "
      >
        <h3 className="font-bold text-lg md:text-xl">{title}</h3>
        <p className="py-4 text-sm md:text-base">{message}</p>
        <div
          className="
            modal-action
            flex flex-col space-y-2
            md:flex-row md:space-y-0 md:space-x-2 md:justify-end
          "
        >
          <button className="btn btn-error btn-sm md:btn-md" onClick={onConfirm}>
            Löschen
          </button>
          <button className="btn btn-sm md:btn-md" onClick={onCancel}>
            Abbrechen
          </button>
        </div>
      </div>
    </div>
  );
}
