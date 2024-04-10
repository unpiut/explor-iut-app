import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Footer from './Footer';
import RootStore from '../RootStore';

function MailView() {
  const { mailManager, selectedManager } = useContext(RootStore);

  return (
    <>
      <h1 className="text-center text-3xl font-bold">3. Courriel</h1>
      <p className="text-center text-sm sm:text-xl lg:px-80">
        Nous vous proposons un envoi groupé
        {selectedManager.nbIutSelectionnesId < 2 ? " à l'IUT sélectionné" : ` aux ${selectedManager.nbIutSelectionnesId} IUT sélectionnés`}
        .
      </p>
      <form method="GET" className="justify-center grid w-full">
        <div className="m-2">
          <label htmlFor="name" className="block text-sm sm:text-xl font-medium leading-6">
            Nom et prénom
            <input type="text" maxLength={20} name="name" id="name" autoComplete="name" value={mailManager.nom} onChange={(evt) => { mailManager.nom = evt.target.value; }} placeholder="Dupont" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="entrepriseName" className="block text-sm sm:text-xl font-medium leading-6">
            Nom d&lsquo;entreprise ou de l&apos;organisme
            <input type="text" maxLength={20} name="entrepriseName" id="entrepriseName" value={mailManager.nomEntreprise} onChange={(evt) => { mailManager.nomEntreprise = evt.target.value; }} placeholder="EntrepriseCorporation" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="function" className="block text-sm sm:text-xl font-medium leading-6">
            Fonction dans l&lsquo;entreprise
            <input type="text" maxLength={20} name="function" id="function" value={mailManager.fonctionDansEntreprise} onChange={(evt) => { mailManager.fonctionDansEntreprise = evt.target.value; }} placeholder="PDG, RH..." className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="mail" className="block text-sm sm:text-xl font-medium leading-6">
            Courriel
            <input type="mail" maxLength={20} name="mail" id="mail" autoComplete="mail" value={mailManager.adresseMail} onChange={(evt) => { mailManager.adresseMail = evt.target.value; }} placeholder="mail@mail.com" className="p-1 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6" />
          </label>
        </div>
      </form>
      <Footer
        gauche={{ texte: 'Récapitulatif sélection', lien: '/result' }}
        droite={{
          texte: 'Consultation/Modification du courriel type', lien: '/modifyMail', disable: mailManager.isUpdatedInfo(), lienActu: '/mail',
        }}
      />
    </>
  );
}

export default observer(MailView);
