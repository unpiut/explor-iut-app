import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Footer from './Footer';
import RootStore from '../RootStore';

function ModifyMailView() {
  const { iutManager, mailManager } = useContext(RootStore);
  if (!iutManager.nbIutSelectionnesId) {
    window.location.replace('/');
  }
  return (
    <>
      <h1 className="text-center text-xl font-bold">Modification courriel</h1>
      <p className="text-center text-xs sm:text-base lg:px-80">
        A partir d&apos;un courriel type (contenant planning d&apos;alternance, modalités
        de remise de l&apos;offre d&apos;alternance) que vous pourrez aussi compléter par
        d&apos;autres demandes. Nous vous proposons un envoi groupé
        {iutManager.nbIutSelectionnesId < 2 ? " à l'IUT sélectionné" : ` aux ${iutManager.nbIutSelectionnesId} IUT sélectionnés.`}
        .
      </p>
      <form method="GET">
        <div className="m-2">
          <label htmlFor="object" className="block text-sm font-medium leading-6">
            Objet
            <input type="text" placeholder="nom modifiable - Demande d’information sur la déposition d'une offre d’alternance au sein de l’IUT" name="object" id="object" autoComplete="object" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="contenu" className="block text-sm font-medium leading-6">
            Contenu
            <textarea
              id="contenu"
              placeholder="Bonjour,
              Suite à ma consultation et ma recherche sur le site iut.fr, j’ai identifié des formations qui correspondent à mes recherches d’apprentis. Afin de préciser ma demande et de vous communiquer pourriez vous me communiquer pour chacune des formations :
              - Quelles années sont concernés par l’alternance?
              - Quelles sont les plannings d’alternance pour la rentrée prochaine?
              - Quelles sont les modalités pour déposer mon offre d’alternance?
              Merci de transmettre cette demande au service compétent au sein de votre IUT et dans l’attente d’un retour rapide,
              Bien cordialement"
              name="contenu"
              rows="9"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </label>
        </div>
      </form>
      <Footer gauche={{ texte: 'Retour aux informations du courriel', lien: 'mail' }} droite={{ texte: 'Envoi du courriel', lien: 'mailSend' }} />
    </>
  );
}

export default observer(ModifyMailView);
