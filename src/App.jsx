import React from 'react';
// import classNames from 'classnames';
import {
  createBrowserRouter,
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
import RootStore from './RootStore';
import STORE from './store';

import { WithPagedTitle } from './components/utils';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <FatalError />,
    children: [
      {
        index: true,
        element: <WithPagedTitle pageTitle="formation"><FormationView /></WithPagedTitle>,
      },
      {
        path: 'formation',
        element: <WithPagedTitle pageTitle="formation"><FormationView /></WithPagedTitle>,
      },
      {
        path: 'map',
        element: <WithPagedTitle pageTitle="Carte"><MapView /></WithPagedTitle>,
      },
      {
        path: 'result',
        element: <WithPagedTitle pageTitle="Resultat"><ResultView /></WithPagedTitle>,
      },
      {
        path: 'mail',
        element: <WithPagedTitle pageTitle="Courriel"><MailView /></WithPagedTitle>,
      },
      {
        path: 'modifyMail',
        element: <WithPagedTitle pageTitle="ModifierCourriel"><ModifyMailView /></WithPagedTitle>,
      },
      {
        path: 'mailSend',
        element: <WithPagedTitle pageTitle="CourrielEnvoye"><MailSendView /></WithPagedTitle>,
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
