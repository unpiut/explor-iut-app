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
  const { butManager, selectedManager } = useContext(RootStore);
  const { butRecherches } = butManager;

  return (
    <>
      <div className="mb-4">
        <h1 className="text-center text-xl font-bold">1. Choix des formations</h1>
        <h1 className="text-center sm:text-sm lg:text-base">
          Sélectionner un maximum de 3 univers métiers qui vous intéresse. (
          { selectedManager.nbButSelectionnes > 1
            ? (
              <>
                {selectedManager.nbButSelectionnes}
                {' '}
                Formations sélectionnées
              </>
            )
            : (
              <>
                {selectedManager.nbButSelectionnes}
                {' '}
                Formation sélectionnée
              </>
            )}
          )
        </h1>
      </div>
      <div className="md:mx-32 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-8 px-3 pb-20">
        {butRecherches.map((but, index) => (but !== null
          ? (
            <CaseFormation
              key={but.code}
              but={but}
              tabIndex={index}
              isClose={index === openIndex}
              canOpen={() => (index === openIndex ? setOpenIndex(null) : setOpenIndex(index))}
            />
          )
          : null))}
      </div>

      <Footer droite={{
        texte: '2. Choix de la localisation', lien: 'map', disable: selectedManager.nbButSelectionnes <= 0, lienActu: 'formation',
      }}
      />
    </>
  );
}

export default observer(FormationView);
