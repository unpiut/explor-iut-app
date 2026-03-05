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
  // function changement() {
  //   but.getInfo();
  //   if (close) {
  //     canOpen();
  //     setClose(false);
  //   } else {
  //     canOpen();
  //     setClose(true);
  //   }
  // }
  function openModal() {
    but.getInfo();
    setIsOpen(true);
  }

  // function selectionner() {
  //   selectedManager.switchButSelectionnes(but);
  //   iutManager.switchIutRecherches(selectedManager.butSelectionnes);
  //   selectedManager.switchIutSelectionnesIdByBut();
  //   canOpen();
  //   setClose(true);
  // }

  return (
    <div
      className="aspect-square col-span-1"
      tabIndex={tabIndex}
    >
      <button
        type="button"
        onClick={openModal}
        className={`h-full w-full text-xs md:text-sm xl:text-base text-center
    ${maClasse}
    ${selectedManager.butSelectionnes.has(but) ? 'border-red-600 border-8' : 'border-none'}
    bg-center
    bg-contain
    flex flex-col items-center justify-center
    group
    transition-all duration-500 ease-out
    hover:scale-105 hover:shadow-2xl`}
      >
        <h2 className={`text-white px-2 font-bold py-3 ${selectedManager.butSelectionnes.has(but) ? 'bg-red-600/80' : `${styleFond}`} w-full 
    transition-all duration-500 ease-in-out
    group-hover:scale-90 group-hover:opacity-0`}
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
