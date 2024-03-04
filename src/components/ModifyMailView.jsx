import React from 'react';
import Footer from './Footer';

function ModifyMailView() {
  return (
    <>
      <h1>Modification mail</h1>
      <form method="GET">
        <label htmlFor="objet">
          Objet
          <input type="text" id="objet" name="objet" />
        </label>
        <label htmlFor="contenu">
          Nom
          <textarea id="contenu" name="contenu" />
        </label>
        <button type="button" onClick={() => { window.location.href = './mail'; }}>Retour aux informations du mail</button>
        <button type="submit">Envoi du mail</button>
      </form>
      <Footer gauche={{ texte: 'Récapitulatif sélection', lien: 'result' }} />
    </>
  );
}

export default ModifyMailView;
