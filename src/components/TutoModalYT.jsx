import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

function TutoModalYT({ isOpen, onClose }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t('tutoModalTitre', 'Tutoriel vidéo')}
    >
      <div className="relative w-full max-w-3xl mx-4 bg-white rounded-sm shadow-2xl border-2 border-blue-900 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-blue-900">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-bold text-lg">
              {t('tutoModalTitre', 'Comment utiliser le site ?')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-slate-300 transition-colors"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-white hover:stroke-3" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://youtu.be/pluTRowjeIg?si=PvAKZI9B8zLv1Pdf"
            title={t('tutoModalTitre', 'Tutoriel vidéo')}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-500 text-center">
          {t('tutoModalFooter', 'Appuyez sur Échap ou cliquez en dehors pour fermer.')}
        </div>
      </div>
    </div>
  );
}

export default TutoModalYT;
