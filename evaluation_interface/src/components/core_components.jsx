import React, { useState } from 'react';

function LoadingScreen() {
  return <Directions>Loading...</Directions>;
}

function Directions({ title, children }) {
  return (
    <section className="directions">
      <h2>{title}</h2>
      <p className="fs-5">{children}</p>
    </section>
  );
}


  export { LoadingScreen, Directions };
