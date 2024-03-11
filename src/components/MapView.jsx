import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Footer from './Footer';
import IUTFranceMap from './IUTFranceMap';
import fleche from '../assets/icone-les-iut.svg';
import RootStore from '../RootStore';

function MapView() {
  const { butManager } = useContext(RootStore);
  console.log(butManager.butSelectionnes);
  function ajouter() {
    const select = document.querySelector('#choixBut');
    butManager.butSelectionnes = butManager.getButByCode(select.value);
  }
  return (
    <>
      <div className="grid justify-center">
        <IUTFranceMap className="" />
        <select id="choixBut" className="border-2 p-2  flex m-2 justify-center gap-4" type="button">
          {butManager.buts.map((but) => <option key={but.code} value={but.code}>{but.filiere.replaceAll('Métiers ', '').replaceAll(/de |d'|du |l'|la |en |l’/g, '')}</option>)}
        </select>
        <button className="border-2 p-2  flex m-2 justify-center gap-4" type="button" onClick={ajouter}>Ajouter cette formation</button>
        <button className="border-2 p-2  flex m-2 justify-center gap-4" type="button" onClick={() => { window.location.href = './result'; }}>
          <p>Prendre contact avec les IUT</p>
          <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
        </button>
      </div>
      <p className="pl-2">
        {butManager.nbButSelectionnes}
        {' '}
        Formations sélectionnées
      </p>
      <Footer gauche={{ texte: 'Retour aux formations', lien: '' }} />
    </>
  );
}
export default observer(MapView);
