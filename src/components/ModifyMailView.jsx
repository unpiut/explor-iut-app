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
  const [sendError, setSendError] = useState(''); // Nouvel état pour les erreurs d'envoi
  const [isSending, setIsSending] = useState(false); // Nouvel état pour l'indicateur de chargement
  const MAX_FILES = 10;
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    mailManager.initCorpsMail();
  }, [mailManager]);

  function sendMail() {
    // Réinitialiser les erreurs d'envoi
    setSendError('');

    if (selectedManager.alreadySend) {
      navigate('/mailSend');
      return;
    }
    if (sendingMail.current === true) {
      return;
    }

    sendingMail.current = true;
    setIsSending(true); // Activer l'indicateur de chargement

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
      setIsSending(false); // Désactiver l'indicateur de chargement
      navigate('/mailSend');
    }).catch((error) => {
      console.error("Erreur lors de l'envoi du mail:", error);
      sendingMail.current = false;
      setIsSending(false); // Désactiver l'indicateur de chargement
      setSendError(t('courrielModifErreurEnvoi') || "L'envoi du message a échoué. Veuillez réessayer."); // Afficher l'erreur
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

      {/* Indicateur de chargement pendant l'envoi */}
      {isSending && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t('courrielModifEnvoiEnCours') || "Envoi du message en cours..."}
            </h3>
            <p className="text-gray-600">
              {t('courrielModifPatientez') || "Veuillez patienter, cela peut prendre quelques instants."}
            </p>
          </div>
        </div>
      )}

      <form method="GET" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
                disabled={isSending} // Désactiver pendant l'envoi
              />
            </div>
          </div>

          {/* Colonne de droite - Zone de dépôt des fichiers */}
          <div className="space-y-3">
            <div>
              <h2 className="text-lg text-gray-900">
                {t('courrielModifOffre')}
              </h2>
              <p className="text-sm italic text-gray-600 mt-1">
                {t('courrielModifPropOffreWarning')}
              </p>
              <p className="text-sm font-semibold text-amber-700 bg-amber-50 p-2 rounded-md mt-2">
                {t('courrielModifPropOffreWarning2')}
              </p>
            </div>

            {/* Zone de dépôt de fichiers harmonisée */}
            <div
              className={`relative rounded-lg border-2 transition-all duration-200
                ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/30'}
                ${allFiles.length >= MAX_FILES ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isSending ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              <div className="p-6 text-center">
                <div className="flex justify-center mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {t('courrielModifPropDropZone')}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  {allFiles.length}/{MAX_FILES} {t('courrielModifFichiers') || 'fichiers maximum'}
                </p>

                <div className="relative">
                  <input
                    type="file"
                    multiple
                    onChange={handleFilesChange}
                    disabled={allFiles.length >= MAX_FILES || isSending}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    disabled={allFiles.length >= MAX_FILES || isSending}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-wider shadow-sm hover:bg-gray-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => document.querySelector('input[type="file"]')?.click()}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    {t('courrielModifChoisirFichiers') || 'Choisir des fichiers'}
                  </button>
                </div>
              </div>
            </div>

            {/* Message d'erreur pour les fichiers */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Message d'erreur d'envoi */}
            {sendError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium">{sendError}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Liste des fichiers ajoutés */}
        {allFiles.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allFiles.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow ${isSending ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <span className="text-sm text-gray-700 truncate max-w-45" title={file.name}>
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(0)} Ko
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={isSending}
                    className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
            texte: isSending
              ? (t('courrielModifEnvoiEnCours') || "Envoi...")
              : t('courrielModifAvance'),
            lien: '/mailSend',
          }}
          disabled={isSending} // Si votre composant Footer accepte une prop disabled
        />
      </div>
    </div>
  );
}

export default observer(ModifyMailView);