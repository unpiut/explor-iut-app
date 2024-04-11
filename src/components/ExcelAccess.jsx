import React from 'react';

function ExcelAccess() {
  return (
    <div className="grid justify-center">
      <form>
        <label htmlFor="mdp">
          Mot de passe :
          <input className="rounded border-2 border-blue-900 px-2" type="text" name="mdp" id="mdp" />
        </label>
        <div className="mt-24 flex gap-10">
          <button className="rounded border-2 border-blue-900 px-2" type="submit" name="download" value="download">Télécharger le document</button>
          <div className="grid">
            <input type="file" accept=".xlsx" />
            <button className="rounded border-2 border-blue-900 px-2" type="submit" name="televerser" value="televerser">Téléverser le document</button>
          </div>
        </div>
      </form>
    </div>

  );
}
export default ExcelAccess;
