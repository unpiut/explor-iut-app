import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import Footer from './Footer';
import RootStore from '../RootStore';

function MailView() {
  const { t } = useTranslation();
  const { mailManager } = useContext(RootStore);

  return (
    <>
      <h1 className="text-center text-xl lg:text-3xl font-bold">{t('courrielTitre')}</h1>
      <p className="text-center text-sm sm:text-2xl lg:px-80">
        {t('courrielSousTitre')}
      </p>
      <form method="GET" className="mt-5 justify-center grid w-full">
        <div className="m-2">
          <label htmlFor="name" className="block text-sm sm:text-xl font-medium leading-6">
            {t('courrielNom')}
            <input type="text" maxLength={100} name="name" id="name" autoComplete="name" value={mailManager.nom} onChange={(evt) => { mailManager.nom = evt.target.value; }} placeholder={t('courrielNomProp')} className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="entrepriseName" className="block text-sm sm:text-xl font-medium leading-6">
            {t('courrielEntreprise')}
            <input type="text" maxLength={100} name="entrepriseName" id="entrepriseName" value={mailManager.nomEntreprise} onChange={(evt) => { mailManager.nomEntreprise = evt.target.value; }} placeholder={t('courrielEntrepriseProp')} className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="function" className="block text-sm sm:text-xl font-medium leading-6">
            {t('courrielFonc')}
            <input type="text" maxLength={100} name="function" id="function" value={mailManager.fonctionDansEntreprise} onChange={(evt) => { mailManager.fonctionDansEntreprise = evt.target.value; }} placeholder={t('courrielFoncProp')} className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="mail" className="block text-sm sm:text-xl font-medium leading-6">
            {t('courrielMail')}
            <input type="mail" maxLength={100} name="mail" id="mail" autoComplete="mail" value={mailManager.adresseMail} onChange={(evt) => { mailManager.adresseMail = evt.target.value; }} placeholder={t('courrielMailProp')} className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
          </label>
        </div>
      </form>
      <Footer
        gauche={{ texte: t('courrielRetour'), lien: '/result' }}
        droite={{
          texte: t('courrielAvance'), lien: '/modifyMail', disable: mailManager.isUpdatedInfo(), lienActu: '/mail',
        }}
      />
    </>
  );
}

export default observer(MailView);
