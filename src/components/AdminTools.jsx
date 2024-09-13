import React, { useContext, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import RootStore from '../RootStore';
import { dateToLocalDateTimeString } from '../services/timeService';

function getHistoryDataTitle(datum) {
  let title = dateToLocalDateTimeString(datum.version);
  if (datum.used) {
    title += ' (actuellement utilisé)';
  }
  return title;
}

function AdminTools() {
  const { adminManager } = useContext(RootStore);
  const [fileState, setFileState] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const linkRef = useRef();

  function checkCreds(evt) {
    evt.preventDefault();
    adminManager.verifyCredential();
  }

  function televerser(evt) {
    evt.preventDefault();
    if (uploading) {
      return;
    }
    if (!fileState) {
      return;
    }
    setError(null);
    setUploading(true);
    adminManager.uploadData({
      file: fileState,
      filename: fileState.name,
    }).catch((err) => {
      setError(err.message);
    }).finally(() => {
      setUploading(false);
    });
  }

  function telecharger(evt, id) {
    evt.preventDefault();
    evt.stopPropagation();
    if (downloading) {
      return;
    }
    setError(null);
    setDownloading(true);
    adminManager.downloadData(id)
      .then(({ objectUrl, filename }) => {
        const link = linkRef.current;
        link.href = objectUrl;
        link.download = filename;
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      }).catch((err) => {
        setError(err.message);
      }).finally(() => {
        setDownloading(false);
      });
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */}
      <a ref={linkRef} style={{ display: 'none' }} />
      <div className="grid gap-4 grid-cols-3 mt-4">
        <div className="basis-1/3">
          <h1 className="text-xl font-semibold mb-3">Authentification</h1>
          <form onSubmit={checkCreds} method="POST" action="#">
            <fieldset disabled={adminManager.credentialVerified}>
              <label htmlFor="username">
                Nom d&apos;utilisateur :
                <input
                  className="w-full rounded border-2 border-blue-900 px-2"
                  type="text"
                  name="username"
                  id="username"
                  required
                  value={adminManager.username}
                  onChange={(e) => { adminManager.username = e.target.value; }}
                />
              </label>
              <label htmlFor="mdp">
                Mot de passe :
                <input
                  className="w-full rounded border-2 border-blue-900 px-2"
                  type="password"
                  name="mdp"
                  id="mdp"
                  required
                  value={adminManager.password}
                  onChange={(e) => { adminManager.password = e.target.value; }}
                />
              </label>
              <div className="mt-4">
                <button className="rounded border-2 border-blue-900 px-2" type="submit">Charger les fonctionnalités administrative</button>
              </div>
            </fieldset>
          </form>
          {adminManager.lastError && (
          <div className="mt-4 pl-2 w-full rounded border-red-700 border-4 bg-red-200 font-bold">
            <p>
              Erreur :&nbsp;
              {adminManager.lastError?.message ?? 'Erreur inconnue'}
            </p>
          </div>
          )}
          {error && (
          <div className="mt-4 pl-2 w-full rounded border-red-700 border-4 bg-red-200 font-bold">
            <p>
              Erreur :&nbsp;
              {error?.message ?? 'Erreur inconnue'}
            </p>
          </div>
          )}
          {adminManager.credentialVerified && (
            <div className="mt-4 pl-2 w-full rounded border-green-700 border-4 bg-green-200 font-bold">
              <p>
                Authentification réussie
              </p>
            </div>
          )}
        </div>
        {adminManager.credentialVerified && (
        <>
          <div className="basis-1/3">
            <h1 className="text-xl font-semibold mb-3">Historique des bases de données</h1>
            {adminManager.loadingDataHistory ? (
              <div className="pl-2 w-full rounded border-blue-700 border-4 bg-blue-200 font-bold">
                <p>Chargement en cours</p>
              </div>
            ) : (
              <div className="w-full">
                {
                    adminManager.dataHistory?.map((datum) => (
                      <div className="mb-1 pl-2 border-stone-800 border-2" key={datum.id}>
                        {getHistoryDataTitle(datum)}
                        &nbsp;
                        <button
                          type="button"
                          className="text-sky-700 hover:text-red-600 hover:underline"
                          onClick={(evt) => telecharger(evt, datum.id)}
                        >
                          Télécharger
                        </button>
                      </div>
                    ))
                  }
              </div>
            )}
            {downloading && (
              <div className="pl-2 w-full rounded border-blue-700 border-4 bg-blue-200 font-bold">
                <p>Téléchargement en cours</p>
              </div>
            )}
          </div>
          <div className="basis-1/3">
            <h1 className="text-xl font-semibold mb-3">Téléverser une nouvelle version et mettre à jour la base de données</h1>
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
                <button className="rounded border-2 border-blue-900 px-2" type="submit">Téléverser le document</button>
              </fieldset>
            </form>
            {uploading && (
              <div className="pl-2 w-full rounded border-blue-700 border-4 bg-blue-200 font-bold">
                <p>Téléversement en cours</p>
              </div>
            )}
          </div>
        </>
        )}
      </div>
    </>
  );
}
export default observer(AdminTools);
