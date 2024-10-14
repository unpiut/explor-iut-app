import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import Footer from './Footer';
import RootStore from '../RootStore';

function LegalNotice() {
  const { stateSaver } = useContext(RootStore);

  useEffect(() => {
    // Hide rehydratation prompt
    stateSaver.rehydrationPromptHidden = true;
    return () => {
      // Unhide rehydratation prompt if any
      stateSaver.rehydrationPromptHidden = false;
    };
  }, []);

  return (
    <>
      <h1 className="text-center text-3xl">Mentions Légales - RGPD</h1>
      <p>
        Les informations recueillies sur ce site sont enregistrées dans un fichier informatisé
        par l&apos;ADIUT (Assemblée des Directeurs d&apos;IUT) pour l&apos;envoi de mail.
        La base légale du traitement est le contrat.
      </p>
      <p>
        Les données collectées seront communiquées aux seuls destinataires
        suivants : ADIUT et UNPIUT (Union des Présidents des IUT).
      </p>
      <p>
        Les données sont conservées pendant [durée de conservation des données prévue par
        le responsable du traitement ou critères permettant de la déterminer].
      </p>
      <p>
        Vous pouvez accéder aux données vous concernant, les rectifier, demander leur effacement
        ou exercer votre droit à la limitation du traitement de vos données. (en fonction de la base
        légale du traitement, mentionner également : Vous pouvez retirer à tout moment votre
        consentement au traitement de vos données ; Vous pouvez également vous opposer au
        traitement de vos données ; Vous pouvez également exercer votre droit à la portabilité
        de vos données)
      </p>
      <p>
        Consultez le site cnil.fr pour plus d’informations sur vos droits.
      </p>
      <p>
        Pour exercer ces droits ou pour toute question sur le traitement de vos données dans
        ce dispositif, vous pouvez contacter (le cas échéant, notre délégué à la protection
        des données ou le service chargé de l’exercice de ces droits) : 01 84 84 08 10
      </p>
      <p>
        Si vous estimez, après nous avoir contactés, que vos droits « Informatique
        et Libertés » ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL.
      </p>
      <Footer gauche={{ texte: 'Retour en arriere', lien: '/' }} />
    </>
  );
}

export default observer(LegalNotice);
