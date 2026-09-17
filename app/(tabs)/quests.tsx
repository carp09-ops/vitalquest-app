import React from 'react';
import QuestBoardV3 from '../../src/QuestBoardV3';
import WorldBackdrop from '../../src/WorldBackdrop';

export default function QuestsScreen() {
  return <WorldBackdrop scene="quests"><QuestBoardV3 /></WorldBackdrop>;
}
