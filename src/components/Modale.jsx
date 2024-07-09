import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import RootStore from '../RootStore';

function Modale({
  iutId, onClose, X, Y,
}) {
  const { t } = useTranslation();
  const { iutManager, butManager, selectedManager } = useContext(RootStore);
  const iut = iutManager.iuts.find((i) => i.idIut === iutId);
  iut.getInfo();
  const butSelect = selectedManager.butSelectionnesTab;
  const filtre = (b) => (butSelect.find((unBut) => unBut.code === b.butDispenses[0].codeBut));
  function selectionner() {
    selectedManager.switchIutSelectionnes(iut);
    onClose();
  }
  return (
    <div style={X && Y ? { top: `${Y}px`, left: `${X}px` } : null} className={`absolute px-5 grid justify-center bg-slate-50 z-10 gap-y-2 border-2 text-xs md:text-base border-blue-900 ${!(X && Y) ? 'left-10 right-10 top-[60%]' : ''}`}>
      <div className="flex justify-between gap-5">
        <a href={iut.urlWeb} target="_blank" className="align-middle" rel="noreferrer">{iut.site ? `${iut.nom} - ${iut.site}` : iut.nom}</a>
        <button className="font-bold" type="button" onClick={onClose}>X</button>
      </div>
      <div>
        {iut.departements.filter(filtre).map((d) => (
          <div className="w-full" key={d.code}>
            <p className="ml-5 ">
              {'· '}
              {
            butManager.buts.find((b) => b.code === d.butDispenses[0].codeBut).prettyPrintFiliere
            }
            </p>
          </div>
        ))}
        <button
          onClick={selectionner}
          type="button"
          className="max-w-full break-words text-xs p-1 m-2 md:text-base align-middle text-center border-2 border-blue-900 bg-contain font-bold"
        >
          {!selectedManager.iutSelectionnesId.has(iut.idIut) ? t('carteModaleBouttonSelect') : t('carteModaleBouttonDeselect')}
        </button>
      </div>
    </div>
  );
}
Modale.propTypes = ({
  iutId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  X: PropTypes.number,
  Y: PropTypes.number,
});
Modale.defaultProps = ({
  X: null,
  Y: null,
});

export default observer(Modale);
