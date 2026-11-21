// Screenshot staging: ?shot= puts the game into a real mid-game state so
// the screenshots show the game as a player would see it. Every staged
// state is reachable by playing; the query only skips the clicking.
//   ?shot=cover  round 1, 3 of 7 found, 2:05 left
//   ?shot=round2 round 2, 2 of 8 found, 1:48 left
//   ?shot=hint   round 1, 5 of 7 found, a hint pulsing, 0:52 left
//   ?shot=win    the win screen after all three rounds

export function applyShotStaging(game) {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (!shot) return false;
  if (shot === 'cover') {
    game.stage(0, [0, 2, 5], 125, 300, 3);
    return true;
  }
  if (shot === 'round2') {
    game.stage(1, [1, 4], 108, 1050, 2);
    return true;
  }
  if (shot === 'hint') {
    game.stage(0, [0, 1, 2, 4, 5], 52, 500, 2);
    // leave one hint showing on an unfound difference
    game.hintsLeft = 1;
    game.hint = { index: 6, until: performance.now() + 60000 };
    game.setMessage('Hint: look inside the blue ring. 1 hint left.');
    game.updateHud();
    return true;
  }
  if (shot === 'win') {
    game.stageWin(2840);
    return true;
  }
  return false;
}
