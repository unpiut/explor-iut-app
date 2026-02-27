import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import Footer from './Footer';
import RootStore from '../RootStore';

function LegalNotice() {
  const { stateSaver } = useContext(RootStore);

  useEffect(() => {
    stateSaver.rehydrationPromptHidden = true;
    return () => {
      stateSaver.rehydrationPromptHidden = false;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-6">Mentions Légales - RGPD</h1>

      <section className="space-y-2">
        <p>
          Les informations recueillies sur ce site sont enregistrées dans un fichier informatisé
          par l&apos;ADIUT (Assemblée des Directeurs d&apos;IUT) pour l&apos;envoi de mails.
          La base légale du traitement est le contrat.
        </p>
        <p>
          Les données collectées seront communiquées aux seuls destinataires suivants :
          <strong> ADIUT et UNPIUT (Union des Présidents des IUT)</strong>
          .
        </p>
        <p>
          Les données sont conservées pendant
          {' '}
          <strong>[durée de conservation]</strong>
          {' '}
          ou selon
          des critères permettant de la déterminer par le responsable du traitement.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Vos droits</h2>
        <p>
          Vous pouvez exercer les droits suivants concernant vos données personnelles :
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Accéder à vos données</li>
          <li>Les rectifier</li>
          <li>Demander leur effacement</li>
          <li>Limiter le traitement de vos données</li>
          <li>Retirer votre consentement à tout moment</li>
          <li>S’opposer au traitement de vos données</li>
          <li>Exercer votre droit à la portabilité des données</li>
        </ul>
        <p>
          Pour plus d’informations sur vos droits, consultez le site
          {' '}
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" className="text-blue-600 underline">cnil.fr</a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Contact</h2>
        <p>
          Pour exercer vos droits ou pour toute question sur le traitement de vos données, vous pouvez contacter :
        </p>
        <p className="ml-4 font-medium">01 84 84 08 10</p>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Réclamation</h2>
        <p>
          Si, après nous avoir contactés, vous estimez que vos droits « Informatique et Libertés »
          ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL.
        </p>
      </section>

      <Footer gauche={{ texte: 'Retour en arrière', lien: '/' }} />
    </div>
  );
}

export default observer(LegalNotice);
