import React, { useContext, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Footer from './Footer';
import IUTFranceMap from './IUTFranceMap';
import fleche from '../assets/icone-les-iut.svg';
import RootStore from '../RootStore';

function MapView() {
  const selectInput = useRef();
  const [selectOuvert, setSelectOuvert] = useState(false);
  const { butManager, iutManager } = useContext(RootStore);
  function modifierListeBut() {
    const select = selectInput.current?.value;
    butManager.switchButSelectionne(butManager.getButByCode(select));
    iutManager.switchIutRecherches(butManager.butSelectionnes);
    iutManager.switchIutSelectionnesIdByBut(butManager.butSelectionnes);
  }

  const taille = window.matchMedia('(max-width: 768px)');
  return (
    <>
      <div className="grid">
        <IUTFranceMap className="" />
        <div className="grid justify-center">
          {!taille.matches
            ? (
              <div className="static">
                <button type="button" className="w-full box-border border-2  p-1 flex justify-center gap-4" onClick={() => setSelectOuvert(!selectOuvert)}>
                  <p>Choisir d&apos;autres BUT</p>
                  <img width={25} src={fleche} alt="fleche" />
                </button>
                <select
                  ref={selectInput}
                  multiple
                  className={classNames('absolute', 'border-2', 'p-2', 'justify-center', 'gap-4', 'text-sm', {
                    hidden: !selectOuvert,
                    flex: selectOuvert,
                    'bg-slate-50': selectOuvert,
                    'z-10': selectOuvert,
                  })}
                  type="button"
                  onClick={modifierListeBut}
                  size="6"
                >
                  {butManager.buts.map((but) => (
                    <option
                      className={classNames('w-full', {
                        'text-red-500': butManager.butSelectionnes.has(but),
                      })}
                      key={but.code}
                      value={but.code}
                    >
                      {but.prettyPrintFiliere}
                      {butManager.butSelectionnes.has(but) ? '✔️' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )
            : (
              <select ref={selectInput} multiple className="border-2 p-2  flex m-2 justify-center gap-4 text-sm" type="button" onClick={modifierListeBut}>
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
            )}
          <Link className="w-full box-border border-2 p-3 mt-2 flex justify-center gap-4" to="/result">
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
