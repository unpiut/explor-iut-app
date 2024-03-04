import React from 'react';
import classNames from 'classnames';

export default function App() {
  return (
    <>
      <header className={classNames('py-3', 'lg:py-6', 'mx-2', 'bg-cyan-500', 'px-2')}>
        <h1 className="italic text-2xl">{APP_ENV_APP_TITLE}</h1>
      </header>
      <main className="grid sm:grid-flow-col-dense sm:grid-cols-5 lg:grid-cols-8 gap-2 lg:gap-3 my-3 lg:my-5 mx-2">
        <section className="col-span-full sm:col-span-3 sm:row-span-1 lg:col-span-3">PANEL A</section>
        <section className="col-span-full sm:col-span-2 sm:row-span-2 lg:row-span-1 lg:col-span-2">PANEL B</section>
        <section className="col-span-full sm:col-span-3 sm:row-span-1 lg:col-span-3">PANEL C</section>
      </main>
    </>
  );
}
