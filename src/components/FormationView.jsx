import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import CaseFormation from './CaseFormation';
import RootStore from '../RootStore';
import Footer from './Footer';

function FormationView() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const { butManager, selectedManager } = useContext(RootStore);
  const { buts } = butManager;
  const tabUnivers = ['Métiers Industriels : Prod-Maintenance, Qualité-R&D', "Métiers support de l'Industriel", 'Métiers du Social, Gestion, Commerce', "Métiers de l'informatique"];
  return (
    <>
      <div className="mb-4">
        <h1 className="text-center text-xl lg:text-3xl font-bold">{t('formationTitre')}</h1>
        <h1 className="text-center sm:text-sm lg:text-2xl">
          <b>{t('formationSousTitre')}</b>
          {'  '}
          {t('formationSousSousTitre')}
        </h1>
        <div className=" mt-2 justify-center gap-0 flex flex-wrap md:gap-10">
          <div className="flex gap-2">
            <div className="border-2 border-blue-900 bg-orange-500 w-10 h-5" />
            <p>{t('formationLegende1')}</p>
          </div>
          <div className="flex gap-2">
            <div className="border-2 border-blue-900 bg-lime-600 w-10 h-5" />
            <p>{t('formationLegende2')}</p>
          </div>
          <div className="flex gap-2">
            <div className="border-2 border-blue-900 bg-purple-800 w-10 h-5" />
            <p>{t('formationLegende3')}</p>
          </div>
          <div className="flex gap-2">
            <div className="border-2 border-blue-900 bg-cyan-500 w-10 h-5" />
            <p>{t('formationLegende4')}</p>
          </div>
        </div>
      </div>
      <div className="md:mx-32 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8 px-3 pb-20">
        {[...buts].sort((a, b) => {
          const indexA = tabUnivers.findIndex((e) => e === a.universMetiers);
          const indexB = tabUnivers.findIndex((e) => e === b.universMetiers);
          if (indexA < indexB) {
            return -1;
          } if (indexA === indexB) {
            return 0;
          }
          return 1;
        })
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
          texte: t('formationRetour'), lien: '/',
        }}
        droite={{
          texte: t('formationAvance'), lien: '/map', disable: selectedManager.nbButSelectionnes <= 0, lienActu: '/formation',
        }}
      />
    </>
  );
}

export default observer(FormationView);
