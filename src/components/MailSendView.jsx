import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import fleche from '../assets/icone-les-iut.svg';
import RootStore from '../RootStore';

function ModifyMailView() {
  const { iutManager } = useContext(RootStore);
  if (!iutManager.nbIutSelectionnesId) {
    window.location.replace('/');
  }
  return (
    <div className="grid h-screen">
      <h1 className="text-center text-xl">Courriel envoyé</h1>
      <p className="text-center">
        Votre courriel a bien été envoyé
        {iutManager.nbIutSelectionnesId < 2 ? " à l'IUT sélectionné" : ` aux ${iutManager.nbIutSelectionnesId} IUT sélectionnés`}
        .
      </p>
      <form method="GET">

        <div className="grid justify-center">
          <Link className="border-2 p-2  flex m-2 justify-center gap-4" to="/result">
            <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <p>Revenir à la liste des IUT</p>
          </Link>
          <Link className="border-2 p-2  flex m-2 justify-center gap-4" to="/map">
            <img width={25} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <p>Revenir à la carte interactive</p>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default observer(ModifyMailView);
