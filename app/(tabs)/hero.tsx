import React from 'react';
import HeroV3 from '../../src/HeroV3';
import WorldBackdrop from '../../src/WorldBackdrop';

export default function HeroScreen() {
  return <WorldBackdrop scene="hero">
    <HeroV3 />
  </WorldBackdrop>;
}
