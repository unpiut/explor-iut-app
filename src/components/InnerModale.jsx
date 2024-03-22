import { PropTypes, observer } from 'mobx-react';
import React, { useContext, useRef, useState } from 'react';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';

function InnerModale({ iut }) {
  const { iutManager, butManager } = useContext(RootStore);
  const [butChoisi, setButChoisi] = useState(null);
  const bouttonDesc = useRef();
  const butSelect = butManager.nbButSelectionnes ? butManager.butSelectionnesTab : butManager.buts;
  function selectionner() {
    iutManager.switchIutSelectionnesId(iut);
  }

  const filtre = (b) => (butSelect.find((unBut) => unBut.code === b.codesButDispenses[0]));
  if (butChoisi) {
    return (
      <>
        <div className="flex justify-around">
          <button type="button" onClick={() => setButChoisi(null)}>{'<-'}</button>
          <h2
            className="align-middle text-base text-center"
          >
            {butChoisi.prettyPrintFiliere}
          </h2>
        </div>
        <p>
          Description formation :
          {butChoisi.description ? ` ${butChoisi.description}` : ''}
        </p>
        <div>
          <p>
            Parcours disponible :
          </p>
          {butChoisi.parcours.map((parcours) => (
            <p key={parcours[0]}>
              {' '}
              { parcours[1]}
              {parcours !== butChoisi.parcours[butChoisi.parcours.length - 1] ? ',' : null}
            </p>
          ))}
        </div>
        <p>
          Débouchés métiers :
          {butChoisi.metiers ? ` ${butChoisi.metiers}` : ''}
        </p>
        <p>
          Formation :
          {` ${butChoisi.nom}`}
        </p>
        <div>
          <a className="underline" target="_blank" href={butChoisi.urlIUT} rel="noreferrer">en savoir plus</a>
        </div>
      </>
    );
  }
  return (
    <>
      {iut.departements.filter(filtre).map((d) => (
        <div className="flex  gap-2 w-full justify-around align-middle" key={d.code}>
          <img width={25} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
          <p>{butManager.buts.find((b) => b.code === d.codesButDispenses[0]).prettyPrintFiliere}</p>
          <button type="button" value={d.code} ref={bouttonDesc} className="border text-base border-blue-900 px-2 rounded-full" onClick={() => butManager.getButByCodeWithInfo(d.code).then((b) => setButChoisi(b))}>i</button>
        </div>
      ))}
      <button onClick={selectionner} type="button">{!iutManager.iutSelectionnesId.has(iut.idIut) ? 'Ajouter cet IUT pour la prise de contact' : 'Retirer cet IUT de la liste de contact'}</button>
    </>
  );
}
InnerModale.propTypes = {
  iut: PropTypes.objectOrObservableObject.isRequired,
};

export default observer(InnerModale);
