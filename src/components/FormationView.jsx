import React, { useContext, useRef } from 'react';
import { observer } from 'mobx-react';
import CaseFormation from './CaseFormation';
import RootStore from '../RootStore';
import Footer from './Footer';
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

  return (
    <>
      <div className="mb-4">
        <div className="border border-blue-900 flex">
          <input className="input-barre w-full" placeholder="Rechercher métier" type="text" ref={chercheInput} onChange={filtrer} />
        </div>
        <h1 className="text-center text-xl">
          Sélectionner un maximum de 3 univers métiers qui vous intéresse. (
          { butManager.nbButSelectionnes > 1
            ? (
              <>
                {butManager.nbButSelectionnes}
                {' '}
                Formations sélectionnées
              </>
            )
            : (
              <>
                {butManager.nbButSelectionnes}
                {' '}
                Formation sélectionnée
              </>
            )}
          )
        </h1>
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
      <div className="md:mx-32 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-8 px-3 pb-20">
        {butRecherches.map((but, index) => (but !== null
          ? (
            <CaseFormation
              key={but.code}
              but={but}
              tabIndex={index}
            />
          )
          : null))}
      </div>

      {/* { butManager.nbButSelectionnes > 1
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
          )} */}
      <Footer droite={{ texte: 'Choix de la localisation', lien: 'map' }} />
    </>
  );
}

export default observer(FormationView);
