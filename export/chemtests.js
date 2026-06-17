// chemtests.js — Automated mission QA. Verifies every mission is achievable,
// has no false positives, and is uniquely satisfied (no notation drift —
// missionMet is the single source of truth shared with the live app).
import { Solution, ChemEngine, missionMet } from './chem.js';
import { MISSIONS } from './chemdata.js';

function simulate(ids, opt){
  opt = opt || {};
  const heating = !!opt.heating, venting = !!opt.venting, seconds = opt.seconds || 7;
  const sol = new Solution();
  ids.forEach(id => sol.addReagent(id));
  const eng = new ChemEngine();
  const dt = 1/30, steps = Math.round(seconds/dt);
  let failed = false;
  for(let i=0;i<steps;i++){
    const r = eng.tick(sol, dt, { running:true, heating, venting, stirring:false });
    if(r.snap.gasPct > 82 && r.snap.lethal) failed = true;
  }
  return { sol, failed };
}

// Known-good and known-bad reagent recipes per mission id.
const RECIPES = {
  gen_H2:  { pos:['Zn','塩酸'],     neg:['水'] },
  blue_cu: { pos:['CuSO₄','水'],    neg:['水'] },
  cl2_safe:{ pos:['漂白剤','塩酸'], posOpt:{ venting:true }, neg:['水'] },
  gen_SO2: { pos:['S'], posOpt:{ heating:true }, neg:['水'] },
  ppt_AgCl:{ pos:['AgNO₃','塩化ナトリウム'], neg:['水'] },
  displace_cu:{ pos:['CuSO₄','Zn'], neg:['水'] },
};

export function runMissionTests(){
  const results = []; let allPass = true;
  for(const m of MISSIONS){
    const rc = RECIPES[m.id] || {};
    let pos=false, neg=true, cross=true;
    if(rc.pos){ const s = simulate(rc.pos, rc.posOpt); pos = missionMet(m.target, s.sol, {failed:s.failed}); }
    if(rc.neg){ const s = simulate(rc.neg); neg = !missionMet(m.target, s.sol, {failed:s.failed}); }
    for(const m2 of MISSIONS){
      if(m2.id===m.id) continue;
      const rc2 = RECIPES[m2.id];
      if(rc2 && rc2.pos){ const s = simulate(rc2.pos, rc2.posOpt); if(missionMet(m.target, s.sol, {failed:s.failed})) cross=false; }
    }
    const ok = pos && neg;
    if(!ok) allPass = false;
    results.push({ id:m.id, jp:m.jp, achievable:pos, noFalsePositive:neg, unique:cross, ok });
  }
  return { allPass, results };
}
