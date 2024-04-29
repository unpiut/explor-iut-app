import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import Footer from './Footer';
import IUTFranceMap from './IUTFranceMap';
import RootStore from '../RootStore';
import FicheRappelIut from './FicheRappelIut';
import MapModaleExplanation from './MapModaleExplanation';

function MapView() {
  const { t } = useTranslation();
  const { selectedManager } = useContext(RootStore);
  const [modaleOpen, setModaleOpen] = useState(true);

  return (
    <>
      {modaleOpen ? <MapModaleExplanation onClose={() => setModaleOpen(false)} /> : null}
      <div className="grid">
        <div className="flex gap-2 justify-center">
          <h1 className="text-center text-3xl font-bold">{t('carteTitre')}</h1>
        </div>
        <h2 className="text-center sm:text-sm lg:text-xl">
          {t('carteSousTitre')}
        </h2>
        <h2 className="text-center sm:text-sm lg:text-xl">
          {' '}
          { selectedManager.nbIutSelectionnesId > 1
            ? (
              <>

                {t('carteNbIUTPlur')}
                {' '}
                {selectedManager.nbIutSelectionnesId}
              </>
            )
            : (
              <>

                {t('carteNbIUT')}
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
            {!modaleOpen
              ? (
                <div className="flex justify-end">
                  <div className="w-5/6 border-2 p-2 mt-4 border-blue-800">
                    <h2 className="text-2xl font-bold">{t('carteMETitre')}</h2>
                    <h3 className="underline-offset-1 font-bold">{t('carteMESousTitre2')}</h3>
                    <p>
                      {t('carteMETexte2')}
                    </p>
                    <p>
                      {t('carteMETexte3')}
                    </p>
                    <h3 className="underline-offset-1 font-bold">{t('carteMESousTitre1')}</h3>
                    <p>
                      {t('carteMETexte1')}
                    </p>
                  </div>
                </div>
              )
              : null}
          </div>
        </div>
        <Footer gauche={{ texte: t('carteRetour'), lien: '/formation' }} droite={{ texte: t('carteAvance'), lien: '/result' }} />

      </div>
    </>
  );
}
export default observer(MapView);
