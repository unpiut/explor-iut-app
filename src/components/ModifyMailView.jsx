import {
  useContext, useEffect, useRef, useState,
} from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import RootStore from '../RootStore';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20 MB
const MAX_BODY_LENGTH = 2048;

function ModifyMailView() {
  const { mailManager, selectedManager, butManager } = useContext(RootStore);
  const sendingMail = useRef(false);

  const [fileNumberState, setfileNumberState] = useState(0);
  const [allFiles, setAllFiles] = useState([]);
  const [error, setError] = useState('');
  const [sendError, setSendError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    mailManager.initCorpsMail();
  }, [mailManager]);

  function changeBodyMail(item) {
    const value = item.value.slice(0, MAX_BODY_LENGTH);
    mailManager.corpsMail = value;
  }

  function handleFilesChange(e) {
    const newFiles = Array.from(e.target.files);

    let validFiles = [];

    for (const file of newFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setError(`Fichier trop volumineux : ${file.name}`);
        continue;
      }
      validFiles.push(file);
    }

    const combined = [...allFiles, ...validFiles];

    const totalSize = combined.reduce((acc, f) => acc + f.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      setError("Taille totale des fichiers dépassée");
      return;
    }

    setAllFiles(combined.slice(0, MAX_FILES));
    setError('');
  }

  function removeFile(index) {
    setAllFiles(prev => prev.filter((_, i) => i !== index));
    setError('');
  }

  function sendMail() {
    setSendError('');

    if (selectedManager.alreadySend) {
      navigate('/mailSend');
      return;
    }

    if (sendingMail.current) return;

    sendingMail.current = true;
    setIsSending(true);

    const filesToSend = allFiles.filter(f => !!f);

    const selectedDepts = [...selectedManager.iutSelectionnes]
      .flatMap(iut => iut.departements)
      .filter(dept => dept.butDispenses
        .some(b => selectedManager.butSelectionnes.has(butManager.getButByCode(b.codeBut))));

    mailManager.sendMail({
      files: filesToSend,
      selectedDepartments: selectedDepts,
    })
      .then(({ creationDateTime }) => {
        selectedManager.dateEnvoi = creationDateTime;
        selectedManager.alreadySend = true;
        sendingMail.current = false;
        setIsSending(false);
        navigate('/mailSend');
      })
      .catch((err) => {
        console.error(err);
        sendingMail.current = false;
        setIsSending(false);
        setSendError(t('courrielModifErreurEnvoi') || "Erreur lors de l'envoi");
      });
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-xl lg:text-3xl font-bold mb-2">
        {t('courrielModifTitre')}
      </h1>

      {isSending && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p>{t('courrielModifEnvoiEnCours') || "Envoi en cours..."}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <textarea
          maxLength={MAX_BODY_LENGTH}
          value={mailManager.corpsMail}
          onChange={(e) => changeBodyMail(e.target)}
          rows={8}
          className="w-full p-3 border rounded"
          disabled={isSending}
        />

        <input
          type="file"
          multiple
          onChange={handleFilesChange}
          disabled={allFiles.length >= MAX_FILES || isSending}
        />

        {error && (
          <p className="text-red-600">{error}</p>
        )}

        {sendError && (
          <p className="text-red-600">{sendError}</p>
        )}

        <ul>
          {allFiles.map((file, index) => (
            <li key={index} className="flex justify-between">
              <span>{file.name}</span>
              <button onClick={() => removeFile(index)} disabled={isSending}>
                X
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Footer
        onClick={sendMail}
        gauche={{ texte: t('courrielModifRetour'), lien: '/mail' }}
        droite={{ texte: t('courrielModifAvance'), lien: '/mailSend' }}
        disabled={isSending}
      />
    </div>
  );
}

export default observer(ModifyMailView);
