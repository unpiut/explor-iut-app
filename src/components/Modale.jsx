import React, { useContext } from 'react';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';

function Modale({ iut }) {
  console.log(iut._departements[0]);
  const { iutManager, butManager } = useContext(RootStore);
  const { _site, _departements } = iut;
  function selectionner() {
    iutManager.iutSelectionnes = iut;
  }
  function descriptionBut() {
    console.log('yeah');
  }
  return (
    <div>
      <div className="grid gap-y-2 border-2 text-xs  border-blue-900">
        <h2 className="align-middle">{_site}</h2>
        {_departements.map((but) => (
          <div className="flex w-full justify-around align-middle">
            <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
            <p>{but.code}</p>
            <button type="button" className="border text-base border-blue-900 px-2 rounded-full" onClick={descriptionBut}>i</button>
          </div>
        ))}
        <button onClick={selectionner} type="button">{!iutManager.iutSelectionnes.has(iut) ? 'Ajouter cet IUT pour la prise de contact' : 'Retirer cet IUT de la liste de contact'}</button>
      </div>
    </div>
  );
}

export default Modale;
