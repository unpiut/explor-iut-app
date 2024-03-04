import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import ResultatRecherche from './ResultatRecherche';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';
import Footer from './Footer';

function ResultView() {
  const { iutConserve } = useContext(RootStore);

  function telecharger() {
    const total = [];
    iutConserve.iuts.forEach((iut) => {
      if (iut.serviceAlternance) {
        const array = {
          nom: iut.nom,
          site: iut.site,
          serviceAlternance: iut.serviceAlternance,
        };
        total.push(array);
      } else {
        const array = {
          nom: iut.nom,
          site: iut.site,
          parcours: iut.parcours,
        };
        total.push(array);
      }
      const jsonTotal = JSON.stringify(total);
      return jsonTotal;
    });
  }

  return (
    <>
      <div>
        {
            iutConserve.iuts ? iutConserve.iuts.map((iut) => (
              <ResultatRecherche iut={iut} key={iut} />
            ))
              : <p>Les IUT sélectionnés sur la carte apparaîtrons ici</p>
        }
      </div>
      <button type="button" onClick={() => { window.location.href = './mail'; }}>
        <p>Les contacter tous par mail</p>
        <img width={50} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
      </button>
      <button type="button" onClick={iutConserve && telecharger}>
        <p>Télécharger le récapitulatif</p>
        <img width={50} src={fleche} alt="fleche" />
      </button>
      <Footer gauche={{ texte: 'Carte interactive', lien: 'map' }} />
    </>
  );
}

export default observer(ResultView);
