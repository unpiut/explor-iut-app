import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import Footer from './Footer';
import RootStore from '../RootStore';

function ModifyMailView() {
  const { t } = useTranslation();
  function trySubmitFile(e) {
    const files = e.target.files || e.dataTransfer.files;
    if (files.length > 3) {
      alert('Il est possible de déposer un maximum de 3 fichiers');
      e.preventDefault();
    }
  }
  const { mailManager } = useContext(RootStore);
  return (
    <>
      <h1 className="text-center text-xl lg:text-3xl font-bold">{t('courrielModifTitre')}</h1>
      <p className="text-center text-xs sm:text-xl lg:px-80">
        {t('courrielModifSousTitre')}
      </p>
      <form method="GET">
        <div className="m-2">
          <label htmlFor="object" className="block text-sm sm:text-lg font-medium leading-6">
            {t('courrielModifObjet')}
            <input type="text" value={mailManager.objet} name="object" id="object" readOnly="readonly" className="block p-1 w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-base sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="contenu" className="block text-sm sm:text-lg font-medium leading-6">
            {t('courrielModifContenu')}
            <textarea id="contenu" value={mailManager.corpsMail} onChange={(evt) => { mailManager.corpsMail = evt.target.value; }} name="contenu" rows="8" className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
          </label>
        </div>

        <div className="m-2">
          <label htmlFor="alternance" className="block text-sm sm:text-lg font-medium leading-6">
            {t('courrielModifOffre')}
            <input type="file" accept=".pdf" onChange={trySubmitFile} multiple name="alternance" id="alternance" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
          </label>
        </div>
      </form>
      <Footer gauche={{ texte: t('courrielRetour'), lien: '/mail' }} droite={{ texte: t('courrielAvance'), lien: '/mailSend' }} />
    </>
  );
}
export default observer(ModifyMailView);
