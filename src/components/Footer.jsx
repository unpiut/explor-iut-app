import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import fleche from '../assets/icone-les-iut.svg';

function Footer({
  droite, gauche,
}) {
  return (
    <div className="items-center fixed grid bottom-0 right-0 left-0 bg-slate-50 mt-5">
      {gauche
        ? (
          <div className="flex justify-self-start h-3/5">
            <img width={50} style={{ transform: 'rotate(0.25turn)' }} src={fleche} alt="fleche" />
            <Link to={`/${gauche.lien}`}>{gauche.texte}</Link>
          </div>
        ) : null}
      {droite
        ? (
          <div className="ring rounded ring-blue-900 m-4 items-center flex justify-self-end h-3/5">
            <Link className="font-bold" to={`/${droite.lien}`}>{droite.texte}</Link>
            <img width={30} style={{ transform: 'rotate(-0.25turn)' }} src={fleche} alt="fleche" />
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
