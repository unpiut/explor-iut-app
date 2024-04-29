import React, { useContext, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import Footer from './Footer';
import RootStore from '../RootStore';

function ModifyMailView() {
  const { mailManager, selectedManager } = useContext(RootStore);
  const [fileNumberState, setfileNumberState] = useState(0);
  const allFiles = useRef([]);
  const { t } = useTranslation();
  async function sendMail() {
    const myFormData = new FormData();
    myFormData.append('contactIdentity', mailManager.nom);
    myFormData.append('contactCompany', mailManager.nomEntreprise);
    myFormData.append('contactFunction', mailManager.fonctionDansEntreprise);
    myFormData.append('contactMail', mailManager.adresseMail);
    myFormData.append('mailSubject', mailManager.objet);
    myFormData.append('mailBody', mailManager.corpsMail);
    myFormData.append('files', allFiles);
    selectedManager.iutSelectionnes.forEach((iut) => {
      iut.departements.forEach((dep) => {
        myFormData.append('deptIds', dep.id);
      });
    });
    const res = await fetch(`${APP_ENV_API_PATH}/mail/request`, {
      method: 'PUT',
      body: myFormData,
    });
    if (!res.ok) {
      throw new Error("Le traitement ne s'est pas bien effectué");
    }
  }

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
          <h2 className="block text-sm sm:text-lg font-medium leading-6">{t('courrielModifOffre')}</h2>
          <label htmlFor="offre1">
            {t('courrielModifPropOffre1')}
            <input
              type="file"
              onChange={(e) => {
                allFiles.current.push(e.target.files);
                if (fileNumberState === 0) setfileNumberState(fileNumberState + 1);
              }}
              accept=".pdf"
              name="offre"
              id="offre"
              className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
            />
          </label>
          {fileNumberState >= 1
            ? (
              <label htmlFor="offre2">
                {t('courrielModifPropOffre2')}
                <input
                  type="file"
                  onChange={(e) => {
                    allFiles.current.push(e.target.files);
                    if (fileNumberState === 1) setfileNumberState(fileNumberState + 1);
                  }}
                  accept=".pdf"
                  name="offre2"
                  id="offre2"
                  className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                />
              </label>
            )
            : null}
          {fileNumberState >= 2
            ? (
              <label htmlFor="offre3">
                {t('courrielModifPropOffre3')}
                <input
                  type="file"
                  onChange={(e) => {
                    allFiles.current.push(e.target.files);
                  }}
                  accept=".pdf"
                  name="offre3"
                  id="offre3"
                  className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                />
              </label>
            )
            : null}
        </div>
      </form>
      <Footer onClick={sendMail()} gauche={{ texte: t('courrielRetour'), lien: '/mail' }} droite={{ texte: t('courrielAvance'), lien: '/mailSend' }} />
    </>
  );
}
export default observer(ModifyMailView);
