import React from 'react';
import { useTranslation } from 'react-i18next';
import Footer from './Footer';
import motif from '../assets/motif_unpiut.webp';

function FirstPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="grid p-10 align-middle gap-5 justify-center">
        <h1 className="text-center text-3xl lg:text-5xl font-bold">{t('accueilTitre')}</h1>
        <p className="text-xl lg:text-3xl text-center">
          <a className="font-bold underline underline-offset-1" href="https://www.unpiut.fr/">L&apos;Union des Présidents des IUT</a>
          {' '}
          {t('accueilSousTitre')}
        </p>
      </div>
      <div className="grid justify-items-center gap-10">
        <h2 className="text-center text-xl lg:text-3xl">{t('accueilTitreRecherche')}</h2>
        <div className="grid gap-5 xl:grid-cols-3 text-center justify-center">
          <div className="relative pb-4 m-auto h-full w-2/3 border-2 border-blue-900">
            <div>
              <h3 className="p-2 xl:text-lg font-bold bg-blue-900 text-slate-50 border-b-2 border-blue-900">{t('case1Titre')}</h3>
              <p className="p-2 xl:text-lg">{t('case1Texte')}</p>
            </div>
            <img className="absolute bottom-0" src={motif} alt="liseré IUT" />
          </div>
          <div className="relative pb-4 m-auto h-full w-2/3 border-2 border-blue-900">
            <div>
              <h3 className="p-2 xl:text-lg font-bold bg-blue-900 text-slate-50 border-b-2 border-blue-900">{t('case2Titre')}</h3>
              <p className="p-2 xl:text-lg">{t('case2Texte')}</p>
            </div>
            <img className="absolute bottom-0" src={motif} alt="liseré IUT" />
          </div>
          <div className="relative pb-4 m-auto h-full w-2/3 border-2 border-blue-900">
            <div>
              <h3 className="p-2 xl:text-lg  font-bold bg-blue-900 text-slate-50 border-b-2 border-blue-900">{t('case3Titre')}</h3>
              <p className="p-2 xl:text-lg ">{t('case3Texte')}</p>
            </div>
            <img className="absolute bottom-0" src={motif} alt="liseré IUT" />
          </div>
        </div>
      </div>
      <Footer gauche={{ texte: t('accueilRetour'), lien: 'https://www.iut.fr/' }} droite={{ texte: t('accueilAvance'), lien: '/formation' }} />
    </>
  );
}

export default FirstPage;
