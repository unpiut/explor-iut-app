import { useRef, useState, useEffect, useCallback } from 'react';
import { dateToLocalDateTimeString } from '../services/timeService';

function getHistoryDataTitle(datum) {
  let title = dateToLocalDateTimeString(datum.version);
  if (datum.used) {
    title += ' (actuellement utilisé)';
  }
  return title;
}

export default function DatabaseManager({ adminManager, onError }) {
  const [fileState, setFileState] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localHistory, setLocalHistory] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const linkRef = useRef();

  // Charger l'historique localement
  const loadHistory = useCallback(async () => {
    setLocalLoading(true);
    try {
      // Appeler la méthode du store mais gérer l'état localement
      await adminManager.loadDataHistory();
      // Attendre un peu que le store se mette à jour
      setTimeout(() => {
        setLocalHistory(adminManager.dataHistory);
        setLocalLoading(false);
      }, 100);
    } catch (err) {
      console.error('Erreur chargement:', err);
      setLocalLoading(false);
    }
  }, [adminManager]);

  // Charger l'historique au montage du composant
  useEffect(() => {
    if (adminManager.credentialVerified) {
      loadHistory();
    }
  }, [adminManager.credentialVerified, loadHistory]);

  async function televerser(evt) {
    evt.preventDefault();
    if (uploading || !fileState) return;
    setError(null);
    setUploading(true);
    try {
      await adminManager.uploadData({ file: fileState, filename: fileState.name });
      // Recharger l'historique après upload
      await loadHistory();
      setFileState(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.message);
      if (onError) onError(err);
    } finally {
      setUploading(false);
    }
  }

  function telecharger(evt, id) {
    evt.preventDefault();
    evt.stopPropagation();
    if (downloading) return;
    setError(null);
    setDownloading(true);
    adminManager.downloadData(id)
      .then(({ objectUrl, filename }) => {
        const link = linkRef.current;
        link.href = objectUrl;
        link.download = filename;
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      })
      .catch((err) => {
        setError(err.message);
        if (onError) onError(err);
      })
      .finally(() => { setDownloading(false); });
  }

  const hasNoHistory = localHistory && localHistory.length === 0;
  const isLoading = localLoading;

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */}
      <a ref={linkRef} style={{ display: 'none' }} />

      {/* Historique des bases de données */}
      <div className="basis-1/3">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-semibold">Historique des bases de données</h1>
          <button
            onClick={loadHistory}
            disabled={isLoading}
            className="text-xs text-blue-700 hover:text-blue-900 underline"
          >
            {isLoading ? 'Chargement...' : '⟳ Rafraîchir'}
          </button>
        </div>

        {isLoading ? (
          <div className="pl-2 w-full rounded border-blue-700 border-4 bg-blue-200 font-bold">
            <p>Chargement en cours...</p>
          </div>
        ) : hasNoHistory ? (
          <div className="pl-2 w-full rounded border-stone-300 border-2 bg-stone-100 text-stone-500 italic text-sm py-2">
            Aucune base de données disponible. Téléversez-en une pour commencer.
          </div>
        ) : (
          <div className="w-full">
            {localHistory?.map((datum) => (
              <div className="mb-1 pl-2 border-stone-800 border-2 flex justify-between items-center" key={datum.id}>
                <span className="text-sm">{getHistoryDataTitle(datum)}</span>
                <button
                  type="button"
                  className="text-sky-700 hover:text-red-600 hover:underline text-sm px-2 py-1"
                  onClick={(evt) => telecharger(evt, datum.id)}
                >
                  Télécharger
                </button>
              </div>
            ))}
          </div>
        )}
        {downloading && (
          <div className="mt-2 pl-2 w-full rounded border-blue-700 border-4 bg-blue-200 font-bold">
            <p>Téléchargement en cours...</p>
          </div>
        )}
        {error && (
          <div className="mt-2 pl-2 w-full rounded border-red-700 border-4 bg-red-200 font-bold text-sm py-1">
            Erreur : {error}
          </div>
        )}
      </div>

      {/* Téléversement */}
      <div className="basis-1/3">
        <h1 className="text-xl font-semibold mb-3">
          Téléverser une nouvelle version et mettre à jour la base de données
        </h1>
        <form onSubmit={televerser} method="POST" action="#">
          <fieldset disabled={uploading}>
            <div className="mb-2">
              <input
                onChange={(e) => setFileState(e.target.files[0])}
                type="file"
                accept=".xlsx"
                required
              />
            </div>
            <button
              className="rounded border-2 border-blue-900 px-2 py-1 hover:bg-blue-100 transition-colors disabled:opacity-50"
              type="submit"
              disabled={!fileState || uploading}
            >
              {uploading ? 'Téléversement en cours...' : 'Téléverser le document'}
            </button>
          </fieldset>
        </form>
        {uploading && (
          <div className="mt-2 pl-2 w-full rounded border-blue-700 border-4 bg-blue-200 font-bold">
            <p>Téléversement en cours...</p>
          </div>
        )}
      </div>
    </>
  );
}