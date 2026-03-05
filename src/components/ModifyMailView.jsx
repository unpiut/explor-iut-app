/* eslint-disable jsx-a11y/label-has-associated-control */
import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import RootStore from '../RootStore';

function ModifyMailView() {
  const { mailManager, selectedManager, butManager } = useContext(RootStore);
  const sendingMail = useRef(false);
  const [fileNumberState, setfileNumberState] = useState(0);
  const [allFiles, setAllFiles] = useState([]);
  const [error, setError] = useState('');
  const MAX_FILES = 3;
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    mailManager.initCorpsMail();
  }, [mailManager]);

  function sendMail() {
    if (allFiles.length === 0) {
      setError(t('courrielErreurFichierObligatoire'));
      return;
    }

    if (selectedManager.alreadySend) {
      navigate('/mailSend');
      return;
    }
    if (sendingMail.current === true) {
      return;
    }
    sendingMail.current = true;
    const filesToSend = allFiles.filter((f) => !!f);
    const selectedDepts = [...selectedManager.iutSelectionnes]
      .flatMap((iut) => iut.departements)
      .filter((dept) => dept.butDispenses
        .some((b) => selectedManager.butSelectionnes.has(butManager.getButByCode(b.codeBut))));
    mailManager.sendMail({
      files: filesToSend,
      selectedDepartments: selectedDepts,
    }).then(({ creationDateTime }) => {
      selectedManager.dateEnvoi = creationDateTime;
      selectedManager.alreadySend = true;
      sendingMail.current = false;
      navigate('/mailSend');
    }).catch(() => {
      sendingMail.current = false;
    });
  }

  function changeBodyMail(item) {
    mailManager.corpsMail = item.value;
  }

  function handleFilesChange(e) {
    const newFiles = Array.from(e.target.files);
    setAllFiles(prev => [...prev, ...newFiles].slice(0, MAX_FILES));
    setError('');
  }

  function removeFile(index) {
    setAllFiles((prev) => prev.filter((_, i) => i !== index));
    setError('');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-xl lg:text-3xl font-bold">{t('courrielModifTitre')}</h1>
      <p className="text-center text-xs sm:text-xl lg:px-80">
        {t('courrielModifSousTitre')}
      </p>

      <form method="GET">
        <div className="m-2">
          <h2 className="block text-sm sm:text-lg font-medium leading-6">
            {t('courrielModifCorps')}
          </h2>
          <div>
            <label>
              {t('courrielModifQuestionPlus')}
              <textarea
                id="contenu"
                onChange={(evt) => changeBodyMail(evt.target)}
                value={mailManager.corpsMail}
                name="contenu"
                rows="6"
                className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
              />
            </label>
          </div>
        </div>

        <div className="m-2 w-full lg:w-1/2">
          <h2 className="text-lg font-medium">
            {t('courrielModifOffre')}
          </h2>
          <p className="text-sm italic">{t('courrielModifPropOffreWarning')}</p>
          <p className="text-sm font-semibold">{t('courrielModifPropOffreWarning2')}</p>

          <div
            className={`border-2 border-dashed rounded-md p-6 text-center mt-3 transition
              ${error ? 'border-red-500' : 'border-gray-400'}
            `}
          >
            <p>{t('courrielModifPropDropZone')}</p>
            <input
              type="file"
              multiple
              onChange={handleFilesChange}
              accept=".pdf"
              disabled={allFiles.length >= MAX_FILES}
              className="mt-4"
            />
          </div>

          <p className="text-sm text-gray-600 mt-2 text-center">
            {allFiles.length}
            /
            {MAX_FILES}
            {' '}
            fichiers
          </p>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">
              {error}
            </p>
          )}

          {allFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-center">
                {t('courrielModifFichiersAjoutes')}
              </h3>

              <ul className="mt-3 space-y-2">
                {allFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                  >
                    <span className="truncate max-w-[70%]">
                      {file.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      {t('courrielModifSupprimer')}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </form>

      <div className="mt-12">
        <Footer
          onClick={sendMail}
          gauche={{ texte: t('courrielModifRetour'), lien: '/mail' }}
          droite={{ texte: t('courrielModifAvance'), disable: allFiles.length === 0, lien: '/mailSend' }}
        />
      </div>
    </div>
  );
}

export default observer(ModifyMailView);