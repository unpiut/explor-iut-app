import React from 'react';
// import classNames from 'classnames';
import {
  createBrowserRouter,
  redirect,
  RouterProvider,
} from 'react-router-dom';
import Root from './components/Root';
import FatalError from './components/FatalError';
import FormationView from './components/FormationView';
import MapView from './components/MapView';
import MailView from './components/MailView';
import ResultView from './components/ResultView';
import ModifyMailView from './components/ModifyMailView';
import MailSendView from './components/MailSendView';
import FirstPage from './components/FirstPage';
import RootStore from './RootStore';
import STORE from './store';

import { WithPagedTitle } from './components/utils';
import MentionsLegales from './components/MentionsLegales';
import ExcelAccess from './components/excelAccess';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <FatalError />,
    children: [
      {
        index: true,
        element: <WithPagedTitle pageTitle="firstPage"><FirstPage /></WithPagedTitle>,
      },
      {
        path: 'formation',
        element: <WithPagedTitle pageTitle="formation"><FormationView /></WithPagedTitle>,
      },
      {
        path: 'map',
        element: <WithPagedTitle pageTitle="Carte"><MapView /></WithPagedTitle>,
        loader: async () => {
          if (!STORE.selectedManager.nbButSelectionnes) {
            throw redirect('/');
          }
          return null;
        },
      },
      {
        path: 'result',
        element: <WithPagedTitle pageTitle="Resultat"><ResultView /></WithPagedTitle>,
        loader: async () => {
          if (!STORE.selectedManager.nbButSelectionnes) {
            throw redirect('/');
          }
          return null;
        },
      },
      {
        path: 'mail',
        element: <WithPagedTitle pageTitle="Courriel"><MailView /></WithPagedTitle>,
        loader: async () => {
          if (!STORE.selectedManager.nbIutSelectionnesId) {
            throw redirect('/');
          }
          return null;
        },
      },
      {
        path: 'modifyMail',
        element: <WithPagedTitle pageTitle="ModifierCourriel"><ModifyMailView /></WithPagedTitle>,
        loader: async () => {
          if (!STORE.selectedManager.nbIutSelectionnesId) {
            throw redirect('/');
          }
          return null;
        },
      },
      {
        path: 'mailSend',
        element: <WithPagedTitle pageTitle="CourrielEnvoye"><MailSendView /></WithPagedTitle>,
      },
      {
        path: 'mentions',
        element: <WithPagedTitle pageTitle="MentionsLegales"><MentionsLegales /></WithPagedTitle>,
      },
      {
        path: 'excelAccess', // A changer
        element: <WithPagedTitle pageTitle="ExcelAccess"><ExcelAccess /></WithPagedTitle>,
      },
    ],
  },
], {
  basename: APP_ENV_APP_PUBLIC_PATH,
});

function App() {
  return (
    <RootStore.Provider value={STORE}>
      <RouterProvider router={router} />
    </RootStore.Provider>
  );
}

export default App;
