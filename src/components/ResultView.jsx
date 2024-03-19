import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import ResultatRecherche from './ResultatRecherche';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';
import Footer from './Footer';

function ResultView() {
  const { iutManager, butManager } = useContext(RootStore);
  iutManager.miseAJour();
  const butSelect = butManager.nbButSelectionnes ? butManager.butSelectionnesTab : butManager.buts;
  const filtreIut = (i) => iutManager.iutSelectionnesId.has(i.idIut);

  return (
    <div className="grid justify-center">
      <div>
        {
            iutManager.nbIutSelectionnesId > 0 ? (
              <div>
                {iutManager.iuts.filter(filtreIut).map((iut) => (
                  <ResultatRecherche butSlct={butSelect} iut={iut} key={iut.site} />
                ))}

                <a type="button" className="border-2 p-2 w-full mt-2 flex justify-center gap-4" href="/rendu-recapitulatif.ods">
                  <p>Télécharger le récapitulatif</p>
                  <img width={25} src={fleche} alt="fleche" />
                </a>
              </div>
            )
              : <p>Les IUT sélectionnés sur la carte apparaîtrons ici</p>
        }
      </div>
      <Link className="border-2 w-full p-2 mb-14 flex mt-2 justify-center gap-4" to={iutManager.nbIutSelectionnesId > 0 ? '/mail' : '/result'}>
        <p className={iutManager.nbIutSelectionnesId > 0 ? '' : 'text-gray-400'}>Les contacter tous par mail</p>
        <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
      </Link>
      <Footer gauche={{ texte: 'Carte interactive', lien: 'map' }} />
    </div>
  );
}

export default observer(ResultView);
