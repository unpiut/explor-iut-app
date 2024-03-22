import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import Footer from './Footer';
import IUTFranceMap from './IUTFranceMap';
import RootStore from '../RootStore';

function MapView() {
  const { iutManager, butManager } = useContext(RootStore);
  const [overflowDesc, setoverflowDesc] = useState(false);
  const [overflowJob, setoverflowJob] = useState(false);

  return (
    <div className="grid">
      <h1 className="text-center text-xl font-bold">2. Choix de la localisation</h1>
      <h2 className="text-center sm:text-sm lg:text-base">
        Vous retrouvez ici tous les instituts contenant la ou les formations sélectionnées.
        Sélectionner autant d&apos;instituts que vous le voulez. (
        { iutManager.nbIutSelectionnesId > 1
          ? (
            <>
              {iutManager.nbIutSelectionnesId}
              {' '}
              instituts sélectionnés
            </>
          )
          : (
            <>
              {iutManager.nbIutSelectionnesId}
              {' '}
              instituts sélectionné
            </>
          )}
        )
      </h2>
      <div className="grid grid-cols-3">
        <div className="mt-10 ml-10">
          <h2>Formations sélectionnées</h2>
          {butManager.butSelectionnesTab.map((b) => (
            <div>
              <div className="flex  border-2 border-blue-900 gap-2 w-full justify-around align-middle" key={b.code}>
                <p>
                  {'·  '}
                  {b.prettyPrintFiliere}
                </p>
                <button type="button" value={b.code} className="border text-base border-blue-900 px-2 rounded-full" onClick={() => {}}>i</button>
              </div>
              <div
                className="grid gap-y-2 border-2 text-xs  border-blue-900"
              >
                <p className="font-bold text-sm">
                  Titre académique de la formation :
                  {` ${b.nom} (${b.code})`}
                </p>
                <button type="button" className="text-left" onClick={() => setoverflowDesc(!overflowDesc)}>
                  <p className="font-bold">
                    Description formation :
                  </p>
                  <p className={classNames({
                    'max-h-16': !overflowDesc,
                    'overflow-hidden': !overflowDesc,
                  })}
                  >
                    {b.description ? ` ${b.description}` : ''}
                  </p>
                  {!overflowDesc ? <p>...</p> : null}
                </button>
                <div>
                  <p className="font-bold">
                    Les spécialités :
                  </p>
                  {b.parcours.map((parcours) => (
                    <p key={parcours[0]}>
                      {' '}
                      { parcours[1]}
                      {parcours !== b.parcours[b.parcours.length - 1] ? ',' : null}
                    </p>
                  ))}
                </div>
                <button type="button" className="text-left" onClick={() => setoverflowJob(!overflowJob)}>
                  <p className="font-bold">
                    Débouchés métiers :
                  </p>
                  <p className={classNames({
                    'max-h-16': !overflowJob,
                    'overflow-hidden': !overflowJob,
                  })}
                  >
                    {b.metiers ? ` ${b.metiers}` : ''}
                  </p>
                  {!overflowJob ? <p>...</p> : null}
                </button>

                <div>
                  <a className="underline" target="_blank" href={b.urlIUT} rel="noreferrer">en savoir plus</a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <IUTFranceMap className="h-[70vh]" />
      </div>
      <Footer gauche={{ texte: 'Retour aux formations', lien: '' }} droite={{ texte: `Prendre contact avec les ${iutManager.nbIutSelectionnesId} IUT`, lien: 'result' }} />

    </div>
  );
}
export default observer(MapView);
