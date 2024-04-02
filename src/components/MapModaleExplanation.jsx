import React from 'react';
import selClick from '../assets/selectionClick.png';
import selRect from '../assets/selectionRect.png';

function MapModaleExplanation({ onClose }) {
  return (
    <div className="absolute left-1/2 z-50 ">
      <div className="relative left-[-50%] bg-slate-50 border-2 border-blue-900 text-center justify-center grid">
        <div className="flex gap-2 justify-between p-4">
          <h1 className="text-xl font-bold">Comment utiliser cette carte ?</h1>
          <button className="text-xl font-bold" type="button" onClick={onClose}>X</button>
        </div>
        <p>
          Si vous avez accepté la géolocalisation vous
          serez amener sur votre zone géographique.
        </p>
        <p>
          Pour vous déplacer sur la carte, cliquer et glisser
          et pour zoomer/dézoomer utiliser la molette !
        </p>
        <h2 className="text-xl m-2">2 manières de sélectionner vos instituts :</h2>
        <div className="flex flex-wrap">
          <div className="md:w-1/2 md:p-1">
            <h3 className="underline-offset-1">Selection par point</h3>
            <img src={selClick} alt="Selection par click" />
            <p>
              Il vous suffit pour ça de cliquer sur un point de la carte et de cliquer sur
              &quot;Ajouter l&apos;IUT à votre liste de contact&quot;.
            </p>
          </div>
          <div className="md:w-1/2 md:p-2">
            <h3 className="underline-offset-1">Selection par rectangle</h3>
            <img src={selRect} alt="Selection par rectangle" />
            <p>
              Pour celui ci, il faut rester appuyer sur la touche Ctrl de votre
              ordinateur et tracer un rectangle sur la carte pour sélectionner par groupe
              tous les IUT qui vous intéresse.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapModaleExplanation;
