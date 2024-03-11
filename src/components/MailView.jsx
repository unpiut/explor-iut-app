import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Footer from './Footer';
import RootStore from '../RootStore';

function MailView() {
  const { iutManager } = useContext(RootStore);
  return (
    <>
      <h1 className="text-center text-xl">Courriel</h1>
      <p className="text-center">
        Votre courriel sera envoyé aux
        {' '}
        {iutManager.nbIutSelectionnes}
        {' '}
        IUT sélectionnés.
      </p>
      <form method="GET" className="justify-center grid w-full">
        <div className="m-2">
          <label htmlFor="mail" className="block text-sm font-medium leading-6">
            Mail
            <input type="text" name="mail" id="mail" autoComplete="mail" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="name" className="block text-sm font-medium leading-6">
            Nom
            <input type="text" name="name" id="name" autoComplete="name" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="entrepriseName" className="block text-sm font-medium leading-6">
            Nom d&lsquo;entreprise
            <input type="text" name="entrepriseName" id="entrepriseName" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="function" className="block text-sm font-medium leading-6">
            Fonction dans l&lsquo;entreprise
            <input type="text" name="function" id="function" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="grid justify-center">
          <button className="border-2 p-2  flex m-2 justify-center gap-4" type="button" onClick={() => { window.location.href = './modifyMail'; }}>Modifier le mail</button>
          <button className="border-2 p-2  flex m-2 justify-center gap-4" onClick={() => { window.location.href = './mailSend'; }} type="button">Envoi du mail</button>
        </div>
      </form>
      <Footer gauche={{ texte: 'Récapitulatif sélection', lien: 'result' }} />
    </>
  );
}

export default observer(MailView);
