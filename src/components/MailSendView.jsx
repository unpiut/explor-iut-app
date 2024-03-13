import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import fleche from '../assets/icone-les-iut.svg';
import RootStore from '../RootStore';

function ModifyMailView() {
  const { iutManager } = useContext(RootStore);
  return (
    <div className="grid h-screen">
      <h1 className="text-center text-xl">Courriel envoyé</h1>
      <p className="text-center">
        Votre courriel a bien été envoyé aux
        {' '}
        {iutManager.nbIutSelectionnesId}
        {' '}
        IUT sélectionné
        {iutManager.nbIutSelectionnes > 1 ? 's' : ''}
        .
      </p>
      <form method="GET">

        <div className="grid justify-center">
          <button className="border-2 p-2  flex m-2 justify-center gap-4" type="button" onClick={() => { window.location.href = './result'; }}>
            <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <p>Revenir à la liste des IUT</p>
          </button>
          <button className="border-2 p-2  flex m-2 justify-center gap-4" type="button" onClick={() => { window.location.href = './map'; }}>
            <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <p>Revenir à la carte interactive</p>
          </button>
        </div>
      </form>
    </div>
  );
}

export default observer(ModifyMailView);
