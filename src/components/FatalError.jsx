import React from 'react';
import { useRouteError } from 'react-router-dom';

function FatalError() {
  const error = useRouteError();

  console.error(error);
  const errorMessage = error?.message ?? error?.error?.message ?? 'Unknown error';

  return (
    <p>
      Oups! A fatal error happened:
      {' '}
      {errorMessage}
    </p>
  );
}

export default FatalError;
