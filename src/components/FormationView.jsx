import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import CaseFormation from './CaseFormation';
import RootStore from '../RootStore';
import Footer from './Footer';
// import TC from '../assets/TC.png';
// import MMI from '../assets/MMI.png';
// import GCCD from '../assets/GCCD.png';

function FormationView() {
  const [openIndex, setOpenIndex] = useState(null);
  const { butManager } = useContext(RootStore);
  const { butRecherches } = butManager;

  return (
    <>
      <div className="mb-4">
        <h1 className="text-center text-xl font-bold">1. Choix des formations</h1>
        <h1 className="text-center sm:text-sm lg:text-base">
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
        {/* { butManager.nbButRecherches > 1
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
          )} */}
      </div>
      <div className="md:mx-32 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-8 px-3 pb-20">
        {butRecherches.map((but, index) => (but !== null
          ? (
            <CaseFormation
              key={but.code}
              but={but}
              tabIndex={index}
              isClose={index === openIndex}
              canOpen={() => setOpenIndex(index)}
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
