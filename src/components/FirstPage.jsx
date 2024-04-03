import React from 'react';
import Footer from './Footer';

function FirstPage() {
  return (
    <>
      <div className="grid p-10 align-middle gap-5 justify-center">
        <h1 className="text-center text-3xl font-bold">Bienvenue sur ExplorerIUT</h1>
        <p className="text-xl">
          L&apos;Union des Présidents des IUT vous accompagne
          pour faciliter votre recherche de futurs apprentis.
        </p>
      </div>
      <div className="grid justify-items-center gap-10">
        <h2 className="text-center text-xl">Une recherche simple et rapide en 3 étapes</h2>
        <div className="grid gap-5 md:grid-cols-3 text-center justify-center">
          <div className="m-auto h-full w-1/2 border-2 border-blue-900">
            <h3 className="font-bold bg-blue-800 text-slate-50 border-b-2 border-blue-900">Quelles formations recherchez vous ?</h3>
            <p>Avec visualisation des contenus et des débouchés de chaque formation</p>
          </div>
          <div className="m-auto h-full w-1/2 border-2 border-blue-900">
            <h3 className="font-bold bg-blue-800 text-slate-50 border-b-2 border-blue-900">Où sont les IUT qui font ces formations ?</h3>
            <p>Avec un récapitulatif sous Excel, ODS ou CSV des IUT sélectionnés</p>
          </div>
          <div className="m-auto h-full w-1/2 border-2 border-blue-900">
            <h3 className="font-bold bg-blue-800 text-slate-50 border-b-2 border-blue-900">Contactez chaque IUT sélectionnés pour déposer vos offres</h3>
            <p>Envoi d&apos;un courriel groupé (type ou à modifier) à tous les IUT sélectionnés</p>
          </div>
        </div>
      </div>
      <Footer droite={{ texte: 'Commencez votre recherche', lien: 'formation' }} />
    </>
  );
}

export default FirstPage;
