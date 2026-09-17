import React from 'react';
import TrainingInsightsV3 from '../src/TrainingInsightsV3';
import WorldBackdrop from '../src/WorldBackdrop';

export default function InsightsScreen(){
  return <WorldBackdrop scene="train"><TrainingInsightsV3/></WorldBackdrop>;
}
