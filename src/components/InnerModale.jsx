import { PropTypes, observer } from 'mobx-react';
import React, { useContext } from 'react';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';

function InnerModale({ iut, but }) {
  const { iutManager } = useContext(RootStore);
  function selectionner() {
    iutManager.switchIutSelectionnesId(iut);
  }
  function descriptionBut() {
    console.log('yeah');
  }
  return (
    <>
      {iut.departements.map((b) => (
        <div className="flex w-full justify-around align-middle" key={b.code}>
          <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
          <p>{b.code}</p>
          <button type="button" className="border text-base border-blue-900 px-2 rounded-full" onClick={descriptionBut}>i</button>
        </div>
      ))}
      <button onClick={selectionner} type="button">{!iutManager.iutSelectionnesId.has(iut) ? 'Ajouter cet IUT pour la prise de contact' : 'Retirer cet IUT de la liste de contact'}</button>
    </>
  );
}
InnerModale.propTypes = {
  iut: PropTypes.objectOrObservableObject,
  but: PropTypes.objectOrObservableObject,
};
InnerModale.defaultProps = {
  iut: null,
  but: null,
};

export default observer(InnerModale);
