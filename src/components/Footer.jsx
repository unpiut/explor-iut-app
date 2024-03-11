import React from 'react';
import PropTypes from 'prop-types';
import fleche from '../assets/icone-les-iut.svg';

function Footer({
  droite, gauche,
}) {
  return (
    <div className="items-center fixed grid bottom-0 right-0 left-0 bg-slate-50">
      {gauche
        ? (
          <div className="flex justify-self-start h-3/5">
            <img width={50} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <a href={`/${gauche.lien}`}>{gauche.texte}</a>
          </div>
        ) : null}
      {droite
        ? (
          <div className="flex justify-self-end h-3/5">
            <a className="text-sm" href={`/${droite.lien}`}>{droite.texte}</a>
            <img width={50} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
          </div>
        ) : null}
    </div>
  );
}
Footer.propTypes = {
  droite: PropTypes.shape({
    texte: PropTypes.string.isRequired,
    lien: PropTypes.string,
  }),
  gauche: PropTypes.shape({
    texte: PropTypes.string.isRequired,
    lien: PropTypes.string,
  }),
};

Footer.defaultProps = {
  droite: null,
  gauche: null,
};
export default Footer;
