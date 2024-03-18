import React, { useContext, useRef } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import CaseFormation from './CaseFormation';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';
// import TC from '../assets/TC.png';
// import MMI from '../assets/MMI.png';
// import GCCD from '../assets/GCCD.png';

function FormationView() {
  const chercheInput = useRef();
  const timerFiltre = useRef();
  const { butManager } = useContext(RootStore);
  const { butRecherches } = butManager;
  function filtrer() {
    const metier = chercheInput.current?.value;
    timerFiltre.current = setTimeout(() => butManager.rechercheBut(metier), 1000);
  }

  function couleur(index) {
    if (index % 2 === 0) {
      return 'bg-blue-900 text-slate-50';
    }
    return 'bg-slate-50 text-blue-900 border-2 border-blue-900';
  }

  return (
    <>
      <div className="mb-4">
        <div className="border border-blue-900 flex">
          <input className="input-barre w-full" placeholder="Rechercher métier" type="text" ref={chercheInput} onChange={filtrer} />
        </div>
        { butManager.nbButRecherches > 1
          ? (
            <p className="text-end mr-2">
              {butManager.nbButRecherches}
              {' '}
              formations liées à la recherche
            </p>
          )
          : (
            <p className="text-end mr-2">
              {butManager.nbButRecherches}
              {' '}
              formation liée à la recherche
            </p>
          )}
      </div>
      <div className="md:mx-32 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-9 px-3 pb-20">
        {butRecherches.map((but, index) => (but !== null
          ? (
            <CaseFormation
              key={but.code}
              className={couleur(index)}
              but={but}
              tabIndex={index}
            />
          )
          : null))}
      </div>
      <div className="items-center fixed flex  justify-between bottom-0 right-0 left-0 bg-slate-50">

        { butManager.nbButSelectionnes > 1
          ? (
            <p className="pl-2">
              {butManager.nbButSelectionnes}
              {' '}
              Formations sélectionnées
            </p>
          )
          : (
            <p className="pl-2">
              {butManager.nbButSelectionnes}
              {' '}
              Formation sélectionnée
            </p>
          )}
        <div className="ring rounded ring-blue-900 m-4 items-center flex justify-self-end h-3/5">
          <Link className="font-bold" to="/map">Carte interactive</Link>
          <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
        </div>
      </div>
    </>
  );
}

export default observer(FormationView);
