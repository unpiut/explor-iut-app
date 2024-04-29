import React, { useState } from 'react';

function ExcelAccess() {
  const [fileState, setFileState] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);

  async function televerser() {
    if (fileState) {
      setLoading(true);
      const myFormData = new FormData();
      myFormData.append('file', fileState);
      myFormData.append('fileName', fileState.name);
      const headers = new Headers();
      headers.set('Authorization', `Basic ${btoa(`admin:${password}`)}`);
      const res = await fetch(`${APP_ENV_API_PATH}/admin/data-sheets`, {
        method: 'PUT',
        headers,
        body: myFormData,
      });
      if (!res.ok) {
        throw new Error("Le traitement ne s'est pas bien effectué");
      }
      setLoading(false);
    }
  }

  async function telecharger() {
    setLoading(true);
    const myFormData = new FormData();
    const headers = new Headers();
    headers.set('Authorization', `Basic ${btoa(`admin:${password}`)}`);
    const res = await fetch(`${APP_ENV_API_PATH}/admin/data-sheets`, {
      method: 'GET',
      headers,
      body: myFormData,
    });
    if (!res.ok) {
      throw new Error("Le traitement ne s'est pas bien effectué");
    }
    setLoading(false);
  }

  return (
    <div className="grid justify-center">
      {loading
        ? <h1>Veuillez patentier, votre téléversement a lieu.</h1>
        : (
          <form>
            <label htmlFor="mdp">
              Mot de passe :
              <input className="rounded border-2 border-blue-900 px-2" type="text" name="mdp" id="mdp" onChange={(e) => setPassword(e.target)} />
            </label>
            <div className="mt-24 flex gap-10">
              <button className="rounded border-2 border-blue-900 px-2" type="button" onClick={telecharger} name="download" value="download">Télécharger le document</button>
              <div className="grid">
                <input onChange={(e) => setFileState(e.target.files[0])} type="file" accept=".xlsx" />
                <button className="rounded border-2 border-blue-900 px-2" type="button" onClick={televerser} name="televerser" value="televerser">Téléverser le document</button>
              </div>
            </div>
          </form>
        )}
    </div>
  );
}
export default ExcelAccess;
