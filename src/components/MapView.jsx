import React, { useContext, useRef } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Footer from './Footer';
import IUTFranceMap from './IUTFranceMap';
import fleche from '../assets/icone-les-iut.svg';
import RootStore from '../RootStore';

function MapView() {
  const selectInput = useRef();
  const { butManager, iutManager } = useContext(RootStore);
  function ajouter() {
    const select = selectInput.current?.value;
    butManager.switchButSelectionne(butManager.getButByCode(select));
    iutManager.switchIutRecherches(butManager.butSelectionnes);
  }

  return (
    <>
      <div className="grid">
        <IUTFranceMap className="" />
        <div className="grid justify-center">
          <select ref={selectInput} multiple className="border-2 p-2  flex m-2 justify-center gap-4 text-sm" type="button" onClick={ajouter}>
            {butManager.buts.map((but) => (
              <option
                className={classNames('w-full', {
                  'text-red-500': butManager.butSelectionnes.has(but),
                })}
                key={but.code}
                value={but.code}
              >
                {but.prettyPrintFiliere}
              </option>
            ))}
          </select>
          <Link className="border-2 p-2  flex m-2 justify-center gap-4" to="/result">
            <p>Prendre contact avec les IUT</p>
            <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
          </Link>
          <p className="pl-2">
            {iutManager.nbIutSelectionnesId}
            {' '}
            instituts sélectionnées
          </p>

        </div>
      </div>
      <Footer gauche={{ texte: 'Retour aux formations', lien: '' }} />
    </>
  );
}
export default observer(MapView);
