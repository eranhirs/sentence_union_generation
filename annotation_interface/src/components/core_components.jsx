import React, { useState } from 'react';

function LoadingScreen() {
  return <Directions>Loading...</Directions>;
}

function Directions({ title, children }) {
  return (
    <section className="directions">
      <h3>{title}</h3>
      <p className="fs-5">{children}</p>
    </section>
  );
}


  export { LoadingScreen, Directions };
