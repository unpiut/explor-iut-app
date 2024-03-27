import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Footer from './Footer';
import IUTFranceMap from './IUTFranceMap';
import RootStore from '../RootStore';
import FicheRappelIut from './FicheRappelIut';

function MapView() {
  const { selectedManager } = useContext(RootStore);
  return (
    <div className="grid">
      <h1 className="text-center text-xl font-bold">2. Choix de la localisation</h1>
      <h2 className="text-center sm:text-sm lg:text-base">
        Vous retrouvez ici tous les instituts contenant la ou les formations sélectionnées.
        Sélectionner autant d&apos;instituts que vous le voulez. (
        { selectedManager.nbIutSelectionnesId > 1
          ? (
            <>
              {selectedManager.nbIutSelectionnesId}
              {' '}
              instituts sélectionnés
            </>
          )
          : (
            <>
              {selectedManager.nbIutSelectionnesId}
              {' '}
              instituts sélectionné
            </>
          )}
        )
      </h2>
      <div className="grid lg:grid-cols-[2fr,1fr]">
        <IUTFranceMap className="h-[70vh]" />
        <div className="mb-32 lg:mr-10">
          <h2>Formations sélectionnées</h2>
          <div className="border-x-2 border-b-2 border-blue-900">
            {selectedManager.butSelectionnesTab.map((b, index) => (
              <FicheRappelIut but={b} index={index} key={b.code} />
            ))}
          </div>
        </div>
      </div>
      <Footer gauche={{ texte: 'Retour aux formations', lien: '' }} droite={{ texte: `Prendre contact avec les ${selectedManager.nbIutSelectionnesId} IUT`, lien: 'result' }} />

    </div>
  );
}
export default observer(MapView);
