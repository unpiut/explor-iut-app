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
      <div className="flex gap-2 justify-center">
        <h1 className="text-center text-3xl font-bold">2. Choix de la localisation</h1>
      </div>
      <h2 className="text-center sm:text-sm lg:text-xl">
        Vous retrouvez ici tous les instituts contenant la ou les formations sélectionnées.
        Sélectionner autant d&apos;instituts que vous le voulez.
      </h2>
      <h2 className="text-center sm:text-sm lg:text-xl">
        {' '}
        { selectedManager.nbIutSelectionnesId > 1
          ? (
            <>

              Nombre d&apos;instituts sélectionnés :
              {' '}
              {selectedManager.nbIutSelectionnesId}
            </>
          )
          : (
            <>

              Nombre d&apos;institut sélectionné :
              {' '}
              {selectedManager.nbIutSelectionnesId}
            </>
          )}
      </h2>
      <div className="grid lg:grid-cols-[2fr,1fr]">
        <IUTFranceMap className="h-[70vh]" />
        <div className="px-1 mb-32 lg:mr-10">
          <h2 className="text-lg">Formations sélectionnées</h2>
          <div className="border-x-2 border-b-2 border-blue-900">
            {selectedManager.butSelectionnesTab.map((b, index) => (
              <FicheRappelIut but={b} index={index} key={b.code} />
            ))}
          </div>
          <div className="flex justify-end">
            <div className="w-5/6 border-2 p-2 mt-4 border-blue-800">
              <h2 className="text-2xl font-bold">La carte : mode d&apos;emploi</h2>
              <h3 className="underline-offset-1 font-bold">Déplacement sur la carte</h3>
              <p>
                Zoomer et dézoomer avec la molette et/ou déplacer en restant cliquer.
              </p>
              <h3 className="underline-offset-1 font-bold">Sélections des IUT</h3>
              <p>
                - &quot;à l&apos;unité&quot; : cliquez sur une ville et valider ou non sa sélection
              </p>
              <p>
                - &quot;par groupe d&apos;IUT sur une zone&quot; : Maintenir CTRL et tracer avec
                la souris un rectangle. Tous les IUT présents dans le rectangle seront sélectionnés.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer gauche={{ texte: 'Retour aux formations', lien: '/formation' }} droite={{ texte: `Prendre contact avec les ${selectedManager.nbIutSelectionnesId} IUT`, lien: '/result' }} />

    </div>
  );
}
export default observer(MapView);
