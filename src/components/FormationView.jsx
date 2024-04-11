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
        <h1 className="text-center text-xl lg:text-3xl font-bold">1. Choix des formations</h1>
        <h1 className="text-center sm:text-sm lg:text-xl">
          Sélectionner un maximum de 3 univers métiers qui vous intéressent.
          {'  '}
        </h1>
        <h1 className="text-center sm:text-sm lg:text-xl">
          { selectedManager.nbButSelectionnes > 1
            ? (
              <>
                Nombre de formations sélectionnées :
                {' '}
                {selectedManager.nbButSelectionnes}
              </>
            )
            : (
              <>
                Nombre de formation sélectionnée :
                {' '}
                {selectedManager.nbButSelectionnes}
              </>
            )}
          /3
        </h1>
        <div className="justify-center gap-10 flex">
          <div className="flex gap-2">
            <div className="border-2 border-blue-900 bg-blue-400 w-10 h-5" />
            <p>Métiers de l&apos;informatique</p>
          </div>
          <div className="flex gap-2">
            <div className="border-2 border-blue-900 bg-red-400 w-10 h-5" />
            <p>Métiers du social</p>
          </div>
          <div className="flex gap-2">
            <div className="border-2 border-blue-900 bg-yellow-400 w-10 h-5" />
            <p>Métiers de supports industriel</p>
          </div>
          <div className="flex gap-2">
            <div className="border-2 border-blue-900 bg-green-400 w-10 h-5" />
            <p>Métiers industriels</p>
          </div>
        </div>
      </div>
      <div className="md:mx-32 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 px-3 pb-20">
        {[...butRecherches].sort((a, b) => a.universMetiers.localeCompare(b.universMetiers))
          .map((but, index) => (but !== null
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

      <Footer
        gauche={{
          texte: 'Retour accueil', lien: '/',
        }}
        droite={{
          texte: '2. Choix de la localisation', lien: '/map', disable: selectedManager.nbButSelectionnes <= 0, lienActu: '/formation',
        }}
      />
    </>
  );
}

export default observer(FormationView);
