import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import TutoModal from './TutoModal';
import TutoModalYT from './TutoModalYT';
import motif from '../assets/motif_unpiut.webp';
import ampoule from '../assets/ampoule.webp';
import youtube from '../assets/youtube.webp';

function FirstPage() {
  const { t } = useTranslation();
  const [isTutoYTOpen, setIsTutoYTOpen] = useState(false);
  const [isAstuceOpen, setIsAstuceOpen] = useState(false);

  return (
    <>
      <div className="grid p-10 align-middle gap-5 justify-center relative">

        {/* Bouton tutoriel - à droite */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setIsTutoYTOpen(true)}
            className="cursor-pointer group flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110"
            aria-label={t('tutoBtn', 'Voir le tutoriel')}
          >
            <img
              src={youtube}
              alt="Tutoriel"
              className="w-18 h-12 transition-transform duration-300 group-hover:-rotate-6"
            />
            <div className="text-sm font-semibold tracking-wide text-gray-700 group-hover:text-blue-700 transition-colors duration-300 text-center">
              <span>Découvrer Explor-IUT</span>
              <br />
              <span>en 3 minutes</span>
            </div>
          </button>
        </div>

        {/* Bouton astuce recherche - à gauche */}
        <Link to="/astuces" className="no-underline absolute top-0 left-6 ">
          <div className="cursor-pointer group flex flex-col items-center gap-1 transition-all duration-300 hover:scale-110">
            <img
              src={ampoule}
              alt="Astuce"
              className="w-12 h-18 transition-transform duration-300 group-hover:rotate-12"
            />
            <div className="text-sm font-semibold tracking-wide text-gray-700 group-hover:text-blue-700 transition-colors duration-300 text-center">
              <span>Astuces pour optimiser</span>
              <br />
              <span>ses recherches</span>
            </div>
          </div>
        </Link>

        <h1 className="text-center text-3xl lg:text-5xl font-bold">{t('accueilTitre')}</h1>
        <p className="text-xl lg:text-3xl text-center">
          <a className="font-bold underline underline-offset-1 hover:text-blue-800 transition-colors" href="https://www.unpiut.fr/">
            L&apos;Union des Présidents des IUT
          </a>
          {' '}
          {t('accueilSousTitre')}
          <br />
          {t('accueilSousTitre2')}
        </p>
      </div>

      <div className="grid justify-items-center gap-10 mt-8">
        <h2 className="text-center text-xl lg:text-3xl">{t('accueilTitreRecherche')}</h2>

        <div className="grid gap-5 xl:grid-cols-3 text-center justify-center px-4">
          <div className="relative pb-4 m-auto h-full w-2/3 border-2 border-blue-900 transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <Link to="/formation" className="no-underline">
              <div>
                <h3 className="p-2 xl:text-lg font-bold bg-blue-900 text-slate-50 border-b-2 border-blue-900">{t('case1Titre')}</h3>
                <p className="p-2 xl:text-lg">{t('case1Texte')}</p>
              </div>
            </Link>
            <img className="absolute bottom-0 left-0 w-full" src={motif} alt="liseré IUT" />
          </div>

          <div className="relative pb-4 m-auto h-full w-2/3 border-2 border-blue-900">
            <div>
              <h3 className="p-2 xl:text-lg font-bold bg-blue-900 text-slate-50 border-b-2 border-blue-900">{t('case2Titre')}</h3>
              <p className="p-2 xl:text-lg">{t('case2Texte')}</p>
            </div>
            <img className="absolute bottom-0 left-0 w-full" src={motif} alt="liseré IUT" />
          </div>

          <div className="relative pb-4 m-auto h-full w-2/3 border-2 border-blue-900">
            <div>
              <h3 className="p-2 xl:text-lg font-bold bg-blue-900 text-slate-50 border-b-2 border-blue-900">{t('case3Titre')}</h3>
              <p className="p-2 xl:text-lg">{t('case3Texte')}</p>
            </div>
            <img className="absolute bottom-0 left-0 w-full" src={motif} alt="liseré IUT" />
          </div>
        </div>
      </div>

      <Footer droite={{ texte: t('accueilAvance'), lien: '/formation' }} />

      {/* Modales */}
      <TutoModalYT isOpen={isTutoYTOpen} onClose={() => setIsTutoYTOpen(false)} />
      {isAstuceOpen && (
        <TutoModalYT isOpen={isAstuceOpen} onClose={() => setIsAstuceOpen(false)} />
      )}
    </>
  );
}

export default FirstPage;
