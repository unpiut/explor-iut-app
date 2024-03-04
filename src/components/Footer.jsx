import React from 'react';
import PropTypes from 'prop-types';
import fleche from '../assets/icone-les-iut.svg';

function Footer({
  droite, gauche,
}) {
  return (
    <div style={{ position: 'absolute', bottom: 0 }}>
      {gauche
        ? (
          <div>
            <img width={50} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <a href={`/${gauche.lien}`}>{gauche.texte}</a>
          </div>
        ) : null}
      {droite
        ? (
          <div>
            <a href={`/${droite.lien}`}>{droite.texte}</a>
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
