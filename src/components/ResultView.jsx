import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import ResultatRecherche from './ResultatRecherche';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';
import Footer from './Footer';

function ResultView() {
  const { selectedManager } = useContext(RootStore);
  selectedManager.miseAJour();
  const butSelect = selectedManager.butSelectionnesTab;

  return (
    <div className="grid justify-center">
      <h1 className="text-center text-xl font-bold">Récapitulatif de vos choix</h1>
      <div className="mb-20">
        {
            selectedManager.nbIutSelectionnesId > 0 ? (
              <div>
                <div className="max-h-[70vh] overflow-auto">
                  {selectedManager.iutSelectionnesTab.map((iut) => (
                    <ResultatRecherche butSlct={butSelect} iut={iut} key={iut.site} />
                  ))}
                </div>
                <button type="button" className="border-2 p-2 w-full mt-2 flex justify-center gap-4" onClick={() => selectedManager.telecharger()}>
                  <p>Télécharger le récapitulatif</p>
                  <img width={25} src={fleche} alt="fleche" />
                </button>
              </div>
            )
              : <h2 className="sm:text-sm lg:text-base">Les IUT sélectionnés sur la carte apparaîtrons ici</h2>
        }
      </div>
      <Footer
        gauche={{ texte: 'Carte interactive', lien: 'map' }}
        droite={{
          texte: 'Contacter ces instituts par courriel', lien: 'mail', disable: selectedManager.nbIutSelectionnesId <= 0, lienActu: 'result',
        }}
      />
    </div>
  );
}

export default observer(ResultView);
