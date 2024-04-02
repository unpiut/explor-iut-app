import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import ResultatRecherche from './ResultatRecherche';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';
import Footer from './Footer';
import ModaleTelechargement from './ModaleTelechargement';

function ResultView() {
  const { selectedManager } = useContext(RootStore);
  const [modaleTelechargement, setModaleTelechargement] = useState(false);
  const courrielDestination = `3. Envoyer le courriel aux ${selectedManager.nbIutSelectionnesId} IUT sélectionnés`;
  selectedManager.miseAJour();
  const butSelect = selectedManager.butSelectionnesTab;
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Backspace') { setModaleTelechargement(false); }
  });
  return (
    <>
      {modaleTelechargement
        ? <ModaleTelechargement onClose={() => setModaleTelechargement(false)} />
        : null}
      <div className="grid justify-center">
        <h1 className="text-center text-xl font-bold">Récapitulatif de vos choix</h1>
        {
            selectedManager.nbIutSelectionnesId > 0 ? (

              <div className="mb-20 grid justify-items-center">
                <div className="max-h-[60vh] gap-2 overflow-auto grid md:grid-cols-3">
                  {selectedManager.iutSelectionnesTab.map((iut) => (
                    <ResultatRecherche butSlct={butSelect} iut={iut} key={iut.site} />
                  ))}
                </div>
                <button type="button" className="border-2 border-blue-900 p-2 w-3/4 mt-2 flex justify-center gap-4" onClick={() => setModaleTelechargement(true)}>
                  <p>Télécharger le récapitulatif</p>
                  <img width={25} src={fleche} alt="fleche" />
                </button>
              </div>
            )
              : <h2 className="sm:text-sm lg:text-base">Les IUT sélectionnés sur la carte apparaîtrons ici</h2>
        }
        <Footer
          gauche={{ texte: 'Retour Carte Localisation', lien: 'map' }}
          droite={{
            texte: courrielDestination, lien: 'mail', disable: selectedManager.nbIutSelectionnesId <= 0, lienActu: 'result',
          }}
        />
      </div>
    </>
  );
}

export default observer(ResultView);
