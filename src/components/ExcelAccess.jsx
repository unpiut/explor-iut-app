import React, { useRef, useState } from 'react';

function ExcelAccess() {
  const [fileState, setFileState] = useState(null);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const linkRef = useRef();

  function televerser() {
    if (!fileState) {
      return;
    }
    setError(null);
    setLoading(true);
    const myFormData = new FormData();
    myFormData.append('file', fileState);
    myFormData.append('fileName', fileState.name);
    const pass = btoa(`${username}:${password}`);
    const headers = new Headers();
    headers.set('Authorization', `Basic ${pass}`);
    fetch(`${APP_ENV_API_PATH}/admin/data-sheets`, {
      method: 'PUT',
      headers,
      body: myFormData,
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Le traitement ne s'est pas bien effectué");
      }
    }).catch((err) => {
      setError(err.message);
    })
      .finally(() => {
        setLoading(false);
      });
  }

  function telecharger() {
    setError(null);
    setLoading(true);
    const pass = btoa(`${username}:${password}`);
    const headers = new Headers();
    headers.set('Authorization', `Basic ${pass}`);
    fetch(`${APP_ENV_API_PATH}/admin/data-sheets`, {
      method: 'GET',
      headers,
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Le traitement ne s'est pas bien effectué");
      }
      const cd = res.headers.get('Content-Disposition');
      let filename;
      if (cd) {
        const m = cd.match('filename="([^"]+)"');
        if (m.length === 2) {
          [, filename] = m;
        }
      }
      if (!filename) {
        filename = 'exploriut_data.xlsx';
      }
      return res.blob().then((blob) => [filename, blob]);
    }).then(([filename, blob]) => {
      const objectUrl = URL.createObjectURL(blob);
      const link = linkRef.current;
      link.href = objectUrl;
      link.download = filename;
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }).catch((err) => {
      setError(err.message);
    })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <div className="grid justify-center">
        {loading
          ? <h1>Veuillez patentier, votre téléversement a lieu.</h1>
          : (
            <form className="mt-4 grid justify-center gap-2">
              <label htmlFor="username">
                Nom d&apos;utilisateur :
                <input className="w-full rounded border-2 border-blue-900 px-2" type="text" name="username" id="username" onChange={(e) => setUsername(e.target.value)} />
              </label>
              <label htmlFor="mdp">
                Mot de passe :
                <input className="w-full  rounded border-2 border-blue-900 px-2" type="password" name="mdp" id="mdp" onChange={(e) => setPassword(e.target.value)} />
              </label>
              <div className="mt-4 flex gap-10">
                <button className="rounded border-2 border-blue-900 px-2" type="button" onClick={telecharger} name="download" value="download">Télécharger le document</button>
                <div className="grid">
                  <input onChange={(e) => setFileState(e.target.files[0])} type="file" accept=".xlsx" />
                  <button className="rounded border-2 border-blue-900 px-2" type="button" onClick={televerser} name="televerser" value="televerser">Téléverser le document</button>
                </div>
              </div>
            </form>
          )}
      </div>
      {error && <div><p>Erreur : la commande s&apos;est mal passée</p></div>}
      {/* eslint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/anchor-is-valid */}
      <a ref={linkRef} style={{ display: 'none' }} />
    </>
  );
}
export default ExcelAccess;
