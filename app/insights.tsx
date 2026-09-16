import React from 'react';
import TrainingInsightsV2 from '../src/TrainingInsightsV2';
import WorldBackdrop from '../src/WorldBackdrop';

export default function InsightsScreen(){
  return <WorldBackdrop scene="train"><TrainingInsightsV2/></WorldBackdrop>;
}
