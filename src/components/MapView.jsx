import React from 'react';
import Footer from './Footer';
import IUTFranceMap from './IUTFranceMap';
import fleche from '../assets/icone-les-iut.svg';

function MapView() {
  return (
    <>
      <div>
        <IUTFranceMap className="foo" height="200" style={{ width: '520px', height: '400px' }} />

        <button type="button" onClick={() => { window.location.href = './result'; }}>
          <p>Prendre contact avec les IUT</p>
          <img width={50} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
        </button>
      </div>
      <Footer gauche={{ texte: 'Retour aux formations', lien: '' }} />
    </>
  );
}
export default MapView;
