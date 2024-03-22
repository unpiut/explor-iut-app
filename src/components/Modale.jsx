import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';

function Modale({ iutId, onClose }) {
  const { iutManager, butManager } = useContext(RootStore);
  const iut = iutManager.iuts.find((i) => i.idIut === iutId);
  const filtre = (b) => (
    butManager.butSelectionnesTab.find((unBut) => unBut.code === b.codesButDispenses[0])
  );
  return (
    <div className="px-10 grid justify-center gap-y-2 border-2 text-xs  border-blue-900">
      <div className="flex justify-between">
        <h2 className="align-middle">{iut.site}</h2>
        <button type="button" onClick={onClose}>X</button>
      </div>
      {iut.departements.filter(filtre).map((d) => (
        <div className="flex  gap-2 w-full justify-around align-middle" key={d.code}>
          <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
          <p>{butManager.buts.find((b) => b.code === d.codesButDispenses[0]).prettyPrintFiliere}</p>
        </div>
      ))}
      <button onClick={selectionner} type="button">{!iutManager.iutSelectionnesId.has(iut.idIut) ? 'Ajouter cet IUT pour la prise de contact' : 'Retirer cet IUT de la liste de contact'}</button>
    </div>
  );
}
Modale.propTypes = ({
  iutId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
});

export default Modale;
