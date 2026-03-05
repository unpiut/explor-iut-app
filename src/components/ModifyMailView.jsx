import {
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
    const filesToSend = allFiles.filter(f => !!f);
    const selectedDepts = [...selectedManager.iutSelectionnes]
      .flatMap(iut => iut.departements)
      .filter(dept => dept.butDispenses
        .some(b => selectedManager.butSelectionnes.has(butManager.getButByCode(b.codeBut))));
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
    setAllFiles(prev => prev.filter((_, i) => i !== index));
    setError('');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-xl lg:text-3xl font-bold mb-2">
        {t('courrielModifTitre')}
      </h1>
      <p className="text-center text-xs sm:text-xl lg:px-80 mb-8">
        {t('courrielModifSousTitre')}
      </p>

      <form method="GET" className="space-y-6">
        {/* Grille principale - 2 colonnes sur grand écran */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Colonne de gauche - Corps du message */}
          <div className="space-y-2">
            <h2 className="block text-sm sm:text-lg font-medium leading-6 text-gray-900">
              {t('courrielModifCorps')}
            </h2>
            <div>
              <label htmlFor="contenu" className="block text-sm font-medium text-gray-700 mb-1">
                {t('courrielModifQuestionPlus')}
              </label>
              <textarea
                id="contenu"
                onChange={evt => changeBodyMail(evt.target)}
                value={mailManager.corpsMail}
                name="contenu"
                rows="8"
                className="block w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-base"
                placeholder={t('courrielModifQuestionPlus')}
              />
            </div>
          </div>

          {/* Colonne de droite - Zone de dépôt des fichiers */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('courrielModifOffre')}
              </h2>
              <p className="text-sm italic text-gray-600 mt-1">
                {t('courrielModifPropOffreWarning')}
              </p>
              <p className="text-sm font-semibold text-amber-700 bg-amber-50 p-2 rounded-md mt-2">
                {t('courrielModifPropOffreWarning2')}
              </p>
            </div>

            {/* Zone de drop */}
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200
                ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                ${allFiles.length >= MAX_FILES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <p className="text-gray-600 mb-3">
                {t('courrielModifPropDropZone')}
              </p>
              <input
                type="file"
                multiple
                onChange={handleFilesChange}
                accept=".pdf"
                disabled={allFiles.length >= MAX_FILES}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-3">
                {allFiles.length}
                /
                {MAX_FILES}
                {' '}
                {t('courrielModifFichiers') || 'fichiers maximum'}
              </p>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Liste des fichiers ajoutés (occupe toute la largeur) */}
        {allFiles.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold text-gray-900 text-center mb-4">
              {t('courrielModifFichiersAjoutes') || 'Fichiers ajoutés'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center space-x-3 truncate">
                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <span className="text-sm text-gray-700 truncate max-w-45" title={file.name}>
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(0)}
                      Ko
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Supprimer le fichier"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Footer avec boutons de navigation */}
      <div className="mt-12">
        <Footer
          onClick={sendMail}
          gauche={{ texte: t('courrielModifRetour'), lien: '/mail' }}
          droite={{
            texte: t('courrielModifAvance'),
            disable: allFiles.length === 0,
            lien: '/mailSend',
          }}
        />
      </div>
    </div>
  );
}

export default observer(ModifyMailView);
