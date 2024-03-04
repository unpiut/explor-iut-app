import React from 'react';
import Footer from './Footer';

function MailView() {
  return (
    <>
      <h1>Mail automatique</h1>
      <form method="GET">
        <label htmlFor="mail">
          Mail
          <input type="text" id="mail" name="mail" />
        </label>
        <label htmlFor="name">
          Nom
          <input type="text" id="name" name="name" />
        </label>
        <label htmlFor="entrepriseName">
          Nom d&lsquo;entreprise
          <input type="text" id="entrepriseName" name="entrepriseName" />
        </label>
        <label htmlFor="fonction">
          Fonction dans l&lsquo;entreprise
          <input type="text" id="fonction" name="fonction" />
        </label>
        <button type="button" onClick={() => { window.location.href = './modifyMail'; }}>Modifier le mail</button>
        <button type="submit">Envoi du mail</button>
      </form>
      <Footer gauche={{ texte: 'Récapitulatif sélection', lien: 'result' }} />
    </>
  );
}

export default MailView;
