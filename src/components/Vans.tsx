
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VansIndex from './vans/VansIndex';
import VanDetail from './vans/VanDetail';

const Vans = () => {
  return (
    <Routes>
      <Route path="/" element={<VansIndex />} />
      <Route path=":vanId" element={<VanDetail />} />
    </Routes>
  );
};

export default Vans;
