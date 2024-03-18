import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import RootStore from '../RootStore';

function MailView() {
  const { iutManager, mailManager } = useContext(RootStore);
  if (!iutManager.nbIutSelectionnesId) {
    window.location.replace('/');
  }
  return (
    <>
      <h1 className="text-center text-xl">Courriel</h1>
      <p className="text-center">
        Votre courriel sera envoyé
        {iutManager.nbIutSelectionnesId < 2 ? " à l'IUT sélectionné" : ` aux ${iutManager.nbIutSelectionnesId} IUT sélectionnés`}
        .
      </p>
      <form method="GET" className="justify-center grid w-full">
        <div className="m-2">
          <label htmlFor="mail" className="block text-sm font-medium leading-6">
            Mail
            <input type="text" name="mail" id="mail" autoComplete="mail" value={mailManager.adresseMail} onChange={() => { mailManager.adresseMail = event.target.value; }} placeholder="mail@mail.com" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="name" className="block text-sm font-medium leading-6">
            Nom
            <input type="text" name="name" id="name" autoComplete="name" value={mailManager.nom} onChange={() => { mailManager.nom = event.target.value; }} placeholder="Dupont" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="entrepriseName" className="block text-sm font-medium leading-6">
            Nom d&lsquo;entreprise
            <input type="text" name="entrepriseName" id="entrepriseName" value={mailManager.nomEntreprise} onChange={() => { mailManager.nomEntreprise = event.target.value; }} placeholder="EntrepriseCorporation" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="function" className="block text-sm font-medium leading-6">
            Fonction dans l&lsquo;entreprise
            <input type="text" name="function" id="function" value={mailManager.fonctionDansEntreprise} onChange={() => { mailManager.fonctionDansEntreprise = event.target.value; }} placeholder="PDG, RH..." className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="grid justify-center">
          <Link className="border-2 p-2  flex m-2 justify-center gap-4" to="/modifyMail">Modifier le mail</Link>
          <Link className="border-2 p-2  flex m-2 justify-center gap-4" to="/mailSend">Envoi du mail</Link>
        </div>
      </form>
      <Footer gauche={{ texte: 'Récapitulatif sélection', lien: 'result' }} />
    </>
  );
}

export default observer(MailView);
