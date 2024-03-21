import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Footer from './Footer';
import IUTFranceMap from './IUTFranceMap';
import RootStore from '../RootStore';

function MapView() {
  const { iutManager } = useContext(RootStore);
  return (
    <div className="grid">
      <h1 className="text-center text-xl font-bold">2. Choix de la localisation</h1>
      <h2 className="text-center sm:text-sm lg:text-base">
        Vous retrouvez ici tous les instituts contenant la ou les formations sélectionnées.
        Sélectionner autant d&apos;instituts que vous le voulez. (
        { iutManager.nbIutSelectionnesId > 1
          ? (
            <>
              {iutManager.nbIutSelectionnesId}
              {' '}
              instituts sélectionnés
            </>
          )
          : (
            <>
              {iutManager.nbIutSelectionnesId}
              {' '}
              instituts sélectionné
            </>
          )}
        )
      </h2>
      <IUTFranceMap className="h-[70vh]" />

      <Footer gauche={{ texte: 'Retour aux formations', lien: '' }} droite={{ texte: `Prendre contact avec les ${iutManager.nbIutSelectionnesId} IUT`, lien: 'result' }} />

    </div>
  );
}
export default observer(MapView);
