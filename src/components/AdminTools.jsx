import { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import RootStore from '../RootStore';
import DatabaseManager from './DatabaseManager';
import ParcoursupAnalyzer from './ParcoursupAnalyzer';

function AdminTools() {
  const { adminManager, stateSaver } = useContext(RootStore);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    stateSaver.rehydrationPromptHidden = true;
    return () => {
      stateSaver.rehydrationPromptHidden = false;
    };
  }, [stateSaver]);

  async function checkCreds(evt) {
    evt.preventDefault();
    try {
      await adminManager.verifyCredential();
      // Une fois authentifié, charger immédiatement l'historique
      if (adminManager.credentialVerified) {
        console.log('Authentification réussie, chargement de l\'historique...');
        await adminManager.loadDataHistory();
        console.log('Historique chargé:', adminManager.dataHistory);
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  }

  // Si l'utilisateur est déjà connecté, afficher directement les outils admin
  if (adminManager.credentialVerified) {
    return (
      <div className="grid gap-4 grid-cols-3 mt-4">
        <DatabaseManager
          adminManager={adminManager}
          onError={(err) => setUploadError(err)}
        />
        <ParcoursupAnalyzer />

        {/* Affichage de l'erreur de téléversement */}
        {uploadError && (
          <div className="col-span-3 mt-4">
            <div className="pl-2 w-full rounded border-red-700 border-4 bg-red-200 font-bold">
              <p>Erreur lors du téléversement :&nbsp;{uploadError.message || uploadError}</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Sinon, afficher uniquement le formulaire de connexion
  return (
    <div className="grid gap-4 grid-cols-3 mt-4">
      <div className="col-span-3 flex justify-center">
        <div className="basis-1/3">
          <h1 className="text-xl font-semibold mb-3">Authentification administrateur</h1>
          <form onSubmit={checkCreds} method="POST" action="#">
            <fieldset>
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
                <button className="rounded border-2 border-blue-900 px-2 py-1 hover:bg-blue-100 transition-colors" type="submit">
                  Se connecter
                </button>
              </div>
            </fieldset>
          </form>

          {adminManager.lastError && (
            <div className="mt-4 pl-2 w-full rounded border-red-700 border-4 bg-red-200 font-bold">
              <p>Erreur :&nbsp;{adminManager.lastError?.message ?? 'Erreur inconnue'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default observer(AdminTools);
