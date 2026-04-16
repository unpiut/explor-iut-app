/* eslint no-param-reassign: ["error", { "props": false }] */
import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MPropTypes } from 'mobx-react';
// import classNames from 'classnames';
// import { useTranslation } from 'react-i18next';
import RootStore from '../RootStore';
import * as style from './FormationBrick.css';
import ModalFormation from './ModalFormation';

function FormationBrick({
  but, tabIndex,
}) {
  // const { t } = useTranslation();
  // const [close, setClose] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const { selectedManager } = useContext(RootStore);

  const styleBordure = but.universMetiersInfo.colors.border;
  const styleFond = but.universMetiersInfo.colors.background;

  const maClasse = style[`bg-${but.code}`] ?? style['bg-DEFAULT']; // On charge la classe 'version js' de nom bg-codeBUT ou bg-DEFAULT si la classe précédente n'existe pas

  // Déterminer si la formation est sélectionnée
  const isSelected = selectedManager.butSelectionnes.has(but);

  function openModal() {
    but.getInfo();
    setIsOpen(true);
  }

  return (
    <div
      className="aspect-square col-span-1"
      tabIndex={tabIndex}
    >
      <button
        type="button"
        onClick={openModal}
        className={`cursor-pointer h-full w-full text-xs md:text-sm xl:text-base text-center
          relative
          overflow-hidden
          ${maClasse}
          ${isSelected ? 'border-green-600 border-8' : 'border-none'}
          bg-center
          bg-contain
          flex flex-col items-center justify-center
          group
          transition-all duration-500 ease-out
          hover:scale-105 hover:shadow-2xl`}
        style={{
          position: 'relative',
        }}
      >
        {/* Pseudo-élément pour le filtre sur l'image de fond */}
        <div
          className={`absolute inset-0 pointer-events-none transition-all duration-500 ease-out hover
            ${!isSelected ? 'backdrop-brightness-80 backdrop-saturate-80' : 'bg-transparent backdrop-brightness-100 backdrop-saturate-100'}`}
          style={{
            zIndex: 1,
          }}
        />

        {/* Contenu texte avec un z-index plus élevé pour être au-dessus du filtre */}
        <h2 className={`text-white px-1 font-bold py-1 ${styleFond} w-full 
          transition-all duration-500 ease-in-out
          relative z-10`}
        >
          {but.prettyPrintFiliere}
        </h2>
      </button>

      {isOpen && (
        <ModalFormation
          but={but}
          onClose={() => setIsOpen(false)}
          colors={{
            border: styleBordure,
            background: styleFond,
          }}
        />
      )}
    </div>
  );
}

FormationBrick.propTypes = ({
  but: MPropTypes.objectOrObservableObject.isRequired,
  tabIndex: PropTypes.number.isRequired,
  // canOpen: PropTypes.func.isRequired,
  // isClose: PropTypes.bool.isRequired,
  colors: PropTypes.shape({
    border: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
  }).isRequired,
});

export default observer(FormationBrick);
