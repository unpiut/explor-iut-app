import React from 'react';
import Footer from './Footer';
import motif from '../assets/motif_unpiut.png';

function FirstPage() {
  return (
    <>
      <div className="grid p-10 align-middle gap-5 justify-center">
        <h1 className="text-center text-3xl lg:text-5xl font-bold">Bienvenue sur ExplorerIUT</h1>
        <p className="text-xl lg:text-3xl text-center">
          <a className="font-bold underline underline-offset-1" href="https://www.unpiut.fr/">L&apos;Union des Présidents des IUT</a>
          {' '}
          vous accompagne
          pour faciliter votre recherche de futurs apprentis.
        </p>
      </div>
      <div className="grid justify-items-center gap-10">
        <h2 className="text-center text-xl lg:text-3xl">Une recherche simple et rapide en 3 étapes</h2>
        <div className="grid gap-5 xl:grid-cols-3 text-center justify-center">
          <div className="relative pb-4 m-auto h-full w-1/2 border-2 border-blue-900">
            <div>
              <h3 className="p-2 lg:text-xl font-bold bg-blue-900 text-slate-50 border-b-2 border-blue-900">1 - Recherchez les formations qui vous intéressent</h3>
              <p className="lg:text-xl">Avec visualisation des contenus et des débouchés de chaque formation</p>
            </div>
            <img className="absolute bottom-0" src={motif} alt="liseré IUT" />
          </div>
          <div className="relative pb-4 m-auto h-full w-1/2 border-2 border-blue-900">
            <div>
              <h3 className="p-2 lg:text-xl font-bold bg-blue-900 text-slate-50 border-b-2 border-blue-900">2 - Localisez les IUT qui vous intéressent</h3>
              <p className="lg:text-xl">Avec un récapitulatif sous Excel, ODS ou CSV des IUT sélectionnés</p>
            </div>
            <img className="absolute bottom-0" src={motif} alt="liseré IUT" />
          </div>
          <div className="relative pb-4 m-auto h-full w-1/2 border-2 border-blue-900">
            <div>
              <h3 className="p-2 lg:text-xl font-bold bg-blue-900 text-slate-50 border-b-2 border-blue-900">3 - Contactez tous les IUT sélectionnés et déposer vos offres</h3>
              <p className="lg:text-xl">Envoi d&apos;un courriel groupé (type ou à modifier) à tous les IUT sélectionnés</p>
            </div>
            <img className="absolute bottom-0" src={motif} alt="liseré IUT" />
          </div>
        </div>
      </div>
      <Footer gauche={{ texte: 'Retour site iut.fr', lien: 'https://www.iut.fr/' }} droite={{ texte: 'Commencez votre recherche', lien: '/formation' }} />
    </>
  );
}

export default FirstPage;
