import React, { useContext } from 'react';
import { PropTypes } from 'mobx-react';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';

function Modale({ iut }) {
  const { iutManager } = useContext(RootStore);
  function selectionner() {
    iutManager.switchIutSelectionnes(iut);
  }
  function descriptionBut() {
    console.log('yeah');
  }
  return (
    <div>
      <div className="grid gap-y-2 border-2 text-xs  border-blue-900">
        <h2 className="align-middle">{iut.site}</h2>
        {iut.departements.map((but) => (
          <div className="flex w-full justify-around align-middle" key={but.code}>
            <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
            <p>{but.code}</p>
            <button type="button" className="border text-base border-blue-900 px-2 rounded-full" onClick={descriptionBut}>i</button>
          </div>
        ))}
        <button onClick={selectionner} type="button">{!iutManager.iutSelectionnesContains(iut) ? 'Ajouter cet IUT pour la prise de contact' : 'Retirer cet IUT de la liste de contact'}</button>
      </div>
    </div>
  );
}
Modale.propTypes = ({
  iut: PropTypes.objectOrObservableObject.isRequired,
});

export default Modale;
