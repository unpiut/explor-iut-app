import { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';

function AstucesView() {
  const { stateSaver } = useContext(RootStore);
  const { t } = useTranslation();

  useEffect(() => {
    stateSaver.rehydrationPromptHidden = true;
    return () => {
      stateSaver.rehydrationPromptHidden = false;
    };
  }, [stateSaver]);

  return (
    <div className="grid gap-12 justify-center px-4 py-8 max-w-4xl mx-auto">
      {/* Lien retour */}
      <Link onClick={() => { }} className="border-2 px-4 text-base lg:text-xl flex justify-center items-center p-2 gap-4 w-fit" to="/">
        <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
        <p>{t('astuceRetour')}</p>
      </Link>

      {/* Titre principal */}
      <div className="text-center">
        <h1 className="text-center text-xl lg:text-4xl font-bold mb-4">
          {t('astuceTitre')}
        </h1>
        <p className="text-center text-base lg:text-2xl text-gray-600">
          {t('astuceSousTitre')}
        </p>
      </div>

      {/* Section 1 - Informations générales */}
      <div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-lg lg:text-2xl font-bold mb-4 text-blue-800">
          {t('astuceTitreCase1')}
        </h2>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
          <p className="text-base lg:text-lg font-medium">
            {t('astuceObjectifCase1')}
          </p>
        </div>

        <h3 className="text-base lg:text-xl font-semibold mt-6 mb-3">{t('astuceTitreListeCase1')}</h3>

        <ul className="list-disc pl-6 space-y-2">
          <li className="text-sm lg:text-base">{t('astuceListe1Case1')}</li>
          <li className="text-sm lg:text-base">{t('astuceListe2Case1')}</li>
          <li className="text-sm lg:text-base">{t('astuceListe3Case1')}</li>
          <li className="text-sm lg:text-base">{t('astuceListe4Case1')}</li>
          <li className="text-sm lg:text-base">{t('astuceListe5Case1')}</li>
          <li className="text-sm lg:text-base">{t('astuceListe6Case1')}</li>
        </ul>
      </div>

      {/* Section 2 - Comment choisir la formation */}
      <div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-lg lg:text-2xl font-bold mb-4 text-blue-800">
          {t('astuceTitreCase2')}
        </h2>

        <p className="text-sm lg:text-base mb-3">
          {t('astuceParagraphe1Case2')}
        </p>

        <p className="text-sm lg:text-base mb-3">
          {t('astuceParagraphe2Case2')}
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
          <p className="text-sm lg:text-base">
            {t('astuceParagraphe3Case2')}
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
          <p className="text-sm lg:text-base">
            {t('astuceParagraphe4Case2')}
          </p>
        </div>
      </div>

      {/* Section 3 - Optimiser vos choix de localisation */}
      <div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-lg lg:text-2xl font-bold mb-4 text-blue-800">
          {t('astuceTitreCase3')}
        </h2>

        <p className="text-sm lg:text-base mb-3">
          {t('astuceParagrapheCase3')}
        </p>
      </div>

      {/* Section 4 - Des liens à partir d'explorIUT */}
      <div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-lg lg:text-2xl font-bold mb-4 text-blue-800">
          {t('astuceTitreCase4')}
        </h2>

        {/* Sous-section 4.1 */}
        <div className="mb-6">
          <h3 className="text-base lg:text-xl font-semibold mb-3 text-blue-700">
            {t('astuceSousTitre1Case4')}
          </h3>
          <p className="text-sm lg:text-base">
            {t('astuceParagraphe1Case4')}
          </p>
        </div>

        {/* Sous-section 4.2 */}
        <div className="mb-6">
          <h3 className="text-base lg:text-xl font-semibold mb-3 text-blue-700">
            {t('astuceSousTitre2Case4')}
          </h3>
          <p className="text-sm lg:text-base">
            {t('astuceParagraphe2Case4')}
          </p>
        </div>

        {/* Sous-section 4.3 */}
        <div>
          <h3 className="text-base lg:text-xl font-semibold mb-3 text-blue-700">
            {t('astuceSousTitre3Case4')}
          </h3>
          <p className="text-sm lg:text-base">
            {t('astuceParagraphe3Case4')}
          </p>
        </div>
      </div>
      <Footer gauche={{ texte: 'Retour en arrière', lien: '/' }} />
    </div>
  );
}

export default observer(AstucesView);
