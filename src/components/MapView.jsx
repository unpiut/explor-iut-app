import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import Footer from './Footer';
import IUTFranceMap from './IUTFranceMap';
import RootStore from '../RootStore';
import FicheRappelIut from './FicheRappelIut';
import MapModaleExplanation from './MapModaleExplanation';

function MapView() {
  const { selectedManager } = useContext(RootStore);
  const [modaleOpen, setModaleOpen] = useState(true);

  function openModaleExplication() {
    setModaleOpen(true);
  }

  return (
    <>
      {modaleOpen ? <MapModaleExplanation onClose={() => setModaleOpen(false)} /> : null}
      <div className="grid">
        <div className="flex gap-2 justify-center">
          <h1 className="text-center text-xl font-bold">2. Choix de la localisation</h1>
          <button type="button" onClick={openModaleExplication} className="text-center text-xl font-bold border px-2 border-blue-900 rounded-full">?</button>
        </div>
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
        <Footer gauche={{ texte: 'Retour aux formations', lien: 'formation' }} droite={{ texte: `Prendre contact avec les ${selectedManager.nbIutSelectionnesId} IUT`, lien: 'result' }} />

      </div>
    </>
  );
}
export default observer(MapView);
