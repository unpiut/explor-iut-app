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
  const [allFiles, setAllFiles] = useState([null, null, null]);
  // const [textCheck, setTextCheck] = useState([true, true, true]);
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
    // let totalText = '';
    // if (textCheck[0]) {
    //   totalText += t('courrielModifQuestion1') + " \r\n";
    // }
    // if (textCheck[1]) {
    //   totalText += t('courrielModifQuestion2') + " \r\n";
    // }
    // if (textCheck[2]) {
    //   totalText += t('courrielModifQuestion3') + " \r\n";
    // }
    // if (item) {
    //   totalText += item.value;
    // }
    mailManager.corpsMail = item.value;
  }

  function removeFile(index) {
    setAllFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <>
      <h1 className="text-center text-xl lg:text-3xl font-bold">{t('courrielModifTitre')}</h1>
      <p className="text-center text-xs sm:text-xl lg:px-80">
        {t('courrielModifSousTitre')}
      </p>
      <form method="GET">
        <div className="m-2">
          <h2 className="block text-sm sm:text-lg font-medium leading-6">
            {t('courrielModifCorps')}
          </h2>
          {/* <h3>
            {t('courrielModifSelection')}
          </h3>
          <div className="grid">
            <label>
              <input type="checkbox" id="yearsAlt" name="yearsAlt" checked={textCheck[0]} onChange={() => handleCheckboxChange(0)} />
              {t('courrielModifQuestion1')}
            </label>
            <label>
              <input type="checkbox" id="planningAlt" name="planningAlt" checked={textCheck[1]} onChange={() => handleCheckboxChange(1)} />
              {t('courrielModifQuestion2')}
            </label>
            <label>
              <input type="checkbox" id="modalAlt" name="modalAlt" checked={textCheck[2]} onChange={() => handleCheckboxChange(2)} />
              {t('courrielModifQuestion3')}
            </label>
          </div> */}
          <div>
            <label>
              {t('courrielModifQuestionPlus')}
              <textarea id="contenu" onChange={(evt) => changeBodyMail(evt.target)} value={mailManager.corpsMail} name="contenu" rows="6" className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
            </label>
          </div>
        </div>

        <div className="m-2">
          <h2 className="block text-sm sm:text-lg font-medium leading-6">{t('courrielModifOffre')}</h2>
          <label htmlFor="offre1">
            {t('courrielModifPropOffre1')}
            <br />
            <span className="italic">{t('courrielModifPropOffreWarning')}</span>
            <input
              type="file"
              onChange={(e) => {
                setAllFiles(([, f2, f3]) => [e.target.files[0], f2, f3]);
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
                    setAllFiles(([f1, , f3]) => [f1, e.target.files[0], f3]);
                    if (fileNumberState === 1) setfileNumberState(fileNumberState + 1);
                  }}
                  accept=".pdf"
                  name="offre2"
                  id="offre2"
                  className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                />
              </label>
            </div>
        <div className="w-full lg:w-1/2">
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

      </div>
    </form >
      <div className="mt-12">
        <Footer
          onClick={sendMail}
          gauche={{ texte: t('courrielModifRetour'), lien: '/mail' }}
          droite={{ texte: t('courrielModifAvance'), disable: allFiles.length === 0, lien: '/mailSend' }}
        />
      </div>

      </div >
    </div >
  );
}

export default observer(ModifyMailView);
