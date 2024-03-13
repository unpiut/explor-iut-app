import React, { useContext, useRef } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import IUTFranceMap from './IUTFranceMap';
import fleche from '../assets/icone-les-iut.svg';
import RootStore from '../RootStore';

function MapView() {
  const selectInput = useRef();
  const { butManager } = useContext(RootStore);
  function ajouter() {
    const select = selectInput.current?.value;
    butManager.switchButSelectionne(butManager.getButByCode(select));
  }
  return (
    <>
      <div className="grid justify-center">
        <IUTFranceMap className="" />
        <select ref={selectInput} className="border-2 p-2  flex m-2 justify-center gap-4 text-sm" type="button">
          {butManager.buts.map((but) => (
            <option
              key={but.code}
              value={but.code}
            >
              {but.prettyPrintFiliere}
            </option>
          ))}
        </select>
        <button className="border-2 p-2  flex m-2 justify-center gap-4" type="button" onClick={ajouter}>Ajouter/Retirer cette formation</button>
        <Link className="border-2 p-2  flex m-2 justify-center gap-4" to="/result">
          <p>Prendre contact avec les IUT</p>
          <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
        </Link>
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
