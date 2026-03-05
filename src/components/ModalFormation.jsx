import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import RootStore from '../RootStore';

function ModalFormation({ but, onClose, colors }) {
  const { t } = useTranslation();
  const { selectedManager, iutManager } = useContext(RootStore);

  useEffect(() => {
    // Bloque le scroll derrière la modal
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  function selectionner() {
    selectedManager.switchButSelectionnes(but);
    iutManager.switchIutRecherches(selectedManager.butSelectionnes);
    selectedManager.switchIutSelectionnesIdByBut();
    onClose();
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay cliquable */}
      <button
        type="button"
        aria-label="Fermer la fenêtre"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* Contenu modal */}
      <div className="relative bg-white max-w-3xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto shadow-xl">

        {/* Bouton fermeture */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className={`absolute top-3 right-3 text-xl font-bold 
    ${colors.background} text-white
    w-8 h-8 rounded-full flex items-center justify-center
    shadow-lg hover:shadow-xl transition`}
        >
          ✕
        </button>
        {/* <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className={`absolute top-3 right-3 text-xl font-bold
    ${colors.background} bg-white
    w-8 h-8 rounded-full flex items-center justify-center
    border-2 ${colors.border}
    hover:scale-110 transition`}
        >
          ✕
        </button> */}

        <h2 className="text-xl font-bold mb-4">
          {but.nom}
          {' '}
          (
          {but.code}
          )
        </h2>

        <p className="font-bold">{t('caseFormDesc')}</p>
        <p className="mb-4">
          {but.description || ''}
        </p>

        <p className="font-bold">{t('caseFormSpe')}</p>
        <div className="mb-4">
          <ul>
            {but.parcours.map(parcours => (
              <li key={parcours[0]}>
                {parcours[1]}
              </li>
            ))}
          </ul>

        </div>

        <p className="font-bold">{t('caseFormDebouch')}</p>
        <p className="mb-6">
          {but.metiers || ''}
        </p>
        <button
          type="button"
          onClick={selectionner}
          className={`transform duration-300 hover:scale-105 rounded w-full border px-4 py-2 font-semibold text-white transition
    ${!selectedManager.butSelectionnes.has(but)
              ? colors.background
              : 'bg-red-600'
            }`}
        >
          {!selectedManager.butSelectionnes.has(but)
            ? t('caseFormSelect')
            : t('caseFormDeselect')}
        </button>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">

          <a
            href={but.urlFiche}
            target="_blank"
            rel="noreferrer"
            className="underline font-semibold"
          >
            {t('caseFormIutfr')}
          </a>
          <a
            href={but.urlFranceCompetence}
            target="_blank"
            rel="noreferrer"
            className="underline font-semibold"
          >
            {t('caseFormFrComp')}
          </a>
        </div>

      </div>
    </div>
  );
}

ModalFormation.propTypes = {
  but: MPropTypes.objectOrObservableObject.isRequired,
  onClose: PropTypes.func.isRequired,
  colors: PropTypes.shape({
    border: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
  }).isRequired,
};

export default observer(ModalFormation);
