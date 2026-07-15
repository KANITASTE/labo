// chem.js — Chemistry engine (calculation only; no rendering, no framework).
// Consumes the data layer in chemdata.js. Exposes Solution + ChemEngine.
import { SPECIES, GASES, REAGENTS, REACTIONS } from './chemdata.js';

const R_GAS = 8.314;

export class Solution {
  constructor(){ this.reset(); }
  reset(){
    this.V = 0;                 // litres
    this.n = {};                // dissolved species → moles
    this.solids = {};           // solid id → moles
    this.gas = {};              // headspace gas key → moles
    this.T = 298.15;            // Kelvin
    this.concReagents = new Set();
    this.undilutedHeatkJ = 0;   // stored dilution heat awaiting water
    this._undilutedAcid = false;
    this.lastEvent = null;      // e.g. 'water_into_acid'
    this._active = {};
    this.waterMl = 0;
    this.produced = {};         // cumulative moles of gas produced (survives venting)
    this.indicator = null;      // active pH indicator: 'BTB'|'PP'|'MO'|'LITMUS'
    this.precip = {};           // precipitate id → moles (settled solid product)
    this.aqV = 0;               // aqueous solvent volume (L) available to dissolve crystals
    this.undissolved = [];      // dry crystalline solutes awaiting water: [reagent]
  }
  add(sp, mol){ this.n[sp] = Math.max(0, (this.n[sp]||0) + mol); }
  addHeat(J){ const massG = Math.max(60, this.V*1000); const cp = massG*4.18; this.T += J/cp; if(this.T>413) this.T=413; }

  addReagent(id){
    const r = REAGENTS[id]; if(!r) return;
    this.lastEvent = null;
    if(r.kind==='liquid'){
      const Lv = r.doseMl/1000;
      const moles = (r.molarity||0)*Lv;
      const isWater = (r.molarity||0)===0;
      if(r.concAcid){
        const heatkJ = -(r.dilHkJ||0)*moles; // released on dilution
        if(this.V > 0.05){ this.addHeat(heatkJ*1000); }      // acid → water (controlled)
        else { this.undilutedHeatkJ += heatkJ; this._undilutedAcid = true; }
        this.concReagents.add(id);
      }
      for(const sp in r.dissoc){ this.add(sp, r.dissoc[sp]*moles); }
      this.V += Lv; this.aqV += Lv; if(isWater) this.waterMl += r.doseMl;
      if(isWater && this._undilutedAcid){           // water → conc acid (DANGEROUS)
        this.addHeat(this.undilutedHeatkJ*1000); this.undilutedHeatkJ = 0; this._undilutedAcid = false;
        this.lastEvent = 'water_into_acid';
      }
      this._dissolvePending();                      // added solvent → dissolve waiting crystals
    } else if(r.kind==='metal' || r.kind==='powder'){
      this.solids[r.solid] = (this.solids[r.solid]||0) + r.molPerAdd;
    } else if(r.kind==='solute'){
      // A dry crystalline salt only dissociates into ions once dissolved in an aqueous
      // solvent. Without water it stays undissolved (and, if it has a solid form, is
      // available for solid-state routes such as thermal decomposition).
      if(this.aqV > 1e-6){ this._dissolveSolute(r); }
      else {
        this.undissolved.push(r);
        if(r.solid){ this.solids[r.solid] = (this.solids[r.solid]||0) + (r.molPerAdd||0); }
      }
    } else if(r.kind==='gas'){
      this.gas[r.gas] = (this.gas[r.gas]||0) + r.molPerAdd;
    } else if(r.kind==='indicator'){
      this.indicator = r.indicator;
      this.V += (r.doseMl||3)/1000; this.aqV += (r.doseMl||3)/1000;
      this._dissolvePending();
    }
  }
  // Dissolve one solute now: dissociate into ions and contribute its solution volume.
  _dissolveSolute(r){
    for(const sp in r.dissoc){ this.add(sp, (r.dissoc[sp]||0)*(r.molPerAdd||0)); }
    this.V += (r.doseMl||8)/1000; this.aqV += (r.doseMl||8)/1000;
  }
  // Flush every crystal that was waiting for water once a solvent is present.
  _dissolvePending(){
    if(!this.undissolved || !this.undissolved.length) return;
    const pend = this.undissolved; this.undissolved = [];
    for(const r of pend){
      if(r.solid){ this.solids[r.solid] = Math.max(0, (this.solids[r.solid]||0) - (r.molPerAdd||0)); }
      this._dissolveSolute(r);
    }
  }

  // pH-dependent colour of the active indicator. null = colourless (no tint).
  indicatorRGB(pH){
    const t = this.indicator; if(!t) return null;
    if(t==='BTB'){    if(pH<6.0) return [232,206,52];  if(pH>7.6) return [38,118,210]; return [104,186,92]; }   // yellow / blue / green
    if(t==='PP'){     if(pH>=8.2) return [222,74,150]; return null; }                                       // colourless → magenta
    if(t==='MO'){     if(pH<3.1) return [220,70,52];   if(pH<4.4) return [236,150,58]; return [236,200,72]; }  // red / orange / yellow
    if(t==='LITMUS'){ if(pH<5.0) return [212,80,80];   if(pH>8.0) return [66,112,206]; return [150,112,172]; } // red / purple / blue
    return null;
  }

  conc(s){ return this.V>1e-6 ? (this.n[s]||0)/this.V : 0; }

  snapshot(){
    const Vc = Math.max(this.V, 1e-6);
    const net = (this.n['H+']||0) - (this.n['OH-']||0);
    const c = net/Vc;
    let pH;
    if(this.V<=1e-6) pH = 7;
    else if(c > 1e-7) pH = Math.max(0, -Math.log10(c));
    else if(c < -1e-7) pH = Math.min(14, 14 + Math.log10(-c));
    else pH = 7;
    // conductivity ≈ Σ Λ°·c with an ionic-strength attenuation (Kohlrausch-like). mS·cm⁻¹.
    let kappa = 0, ionic = 0;
    for(const s in this.n){ const sp = SPECIES[s]; if(sp&&sp.lambda){ const c=Math.max(0,this.conc(s)); kappa += sp.lambda*c; ionic += 0.5*c*sp.z*sp.z; } }
    kappa = kappa / (1 + 0.55*Math.sqrt(Math.max(0,ionic)));
    // solution colour from coloured ions
    let rr=0,gg=0,bb=0,wsum=0;
    for(const s in this.n){ const sp = SPECIES[s]; if(sp&&sp.color){ const w=Math.min(1,this.conc(s)/(sp.cThresh||0.5)); if(w>0.01){ rr+=sp.color[0]*w; gg+=sp.color[1]*w; bb+=sp.color[2]*w; wsum+=w; } } }
    let col=[150,185,205], a = this.V>0?0.30:0;
    if(wsum>0){ const t=Math.min(1,wsum); col=[150*(1-t)+(rr/wsum)*t, 185*(1-t)+(gg/wsum)*t, 205*(1-t)+(bb/wsum)*t]; a=Math.min(0.86,0.30+0.42*Math.min(1,wsum)); }
    // pH indicator dominates the visible colour when present
    if(this.indicator && this.V>0){ const ic=this.indicatorRGB(pH); if(ic){ const t=0.8; col=[col[0]*(1-t)+ic[0]*t, col[1]*(1-t)+ic[1]*t, col[2]*(1-t)+ic[2]*t]; a=Math.max(a,0.6); } }
    // gases
    let toxic=0, flammable=0, lethal=false, domGas=null, domMol=0;
    for(const gk in this.gas){ const m=this.gas[gk]; if(m<=1e-6) continue; const G=GASES[gk]; if(G){ if(G.danger>=3) toxic+=m; if(G.flammable) flammable+=m; if(G.lethal&&m>0.02) lethal=true; } if(m>domMol){ domMol=m; domGas=gk; } }
    const gasPct = Math.min(120, toxic*820 + flammable*90);
    const T_C = this.T - 273.15;
    const pressure = 101.3 + gasPct*0.4 + Math.max(0,(T_C-25))*0.25;
    const totalMol = Object.values(this.n).reduce((p,x)=>p+Math.max(0,x),0);
    return { V:this.V, volumeMl:this.V*1000, pH, conductivity:kappa, color:[col[0],col[1],col[2],a],
             gasPct, lethal, domGas, domMol, T_C, pressure, totalMol, gases:{...this.gas} };
  }
}

export class ChemEngine {
  // env: { running, heating, venting, stirring }
  tick(sol, dt, env){
    const effects = new Set(); let flame = null; const events = [];
    // open-vessel + fume-hood venting
    const ventK = env.venting ? 2.2 : 0.05;
    for(const gk in sol.gas){ sol.gas[gk] = Math.max(0, sol.gas[gk]*(1 - ventK*dt) - 0.0006*dt); }

    if(env.running){
      for(const Rx of REACTIONS){
        if(Rx.needHeat && !env.heating) continue;
        if(Rx.requireConc){ let ok=true; for(const rg of Rx.requireConc){ if(!sol.concReagents.has(rg)) ok=false; } if(!ok) continue; }
        if(Rx.forbidConc){ let bad=false; for(const rg of Rx.forbidConc){ if(sol.concReagents.has(rg)) bad=true; } if(bad) continue; }
        if(Rx.requireSolid){ let ok=true; for(const sid of Rx.requireSolid){ if((sol.solids[sid]||0)<1e-6) ok=false; } if(!ok) continue; }
        let avail = Infinity;
        if(Rx.reactants.water && sol.V < 0.02) avail = 0;
        if(Rx.reactants.solid){ for(const sid in Rx.reactants.solid){ avail = Math.min(avail, (sol.solids[sid]||0)/Rx.reactants.solid[sid]); } }
        if(Rx.reactants.species){ for(const sp in Rx.reactants.species){ const co=Rx.reactants.species[sp]; if(co>0) avail = Math.min(avail, (sol.n[sp]||0)/co); } }
        if(Rx.reactants.headGas){ for(const gk in Rx.reactants.headGas){ const co=Rx.reactants.headGas[gk]; if(co>0) avail=Math.min(avail,(sol.gas[gk]||0)/co); } }
        if(!(avail > 1e-6)) continue;
        const dxi = Math.min(Rx.rate*dt, avail);
        if(dxi <= 0) continue;
        if(Rx.reactants.solid) for(const sid in Rx.reactants.solid) sol.solids[sid] = Math.max(0,(sol.solids[sid]||0) - Rx.reactants.solid[sid]*dxi);
        if(Rx.reactants.species) for(const sp in Rx.reactants.species){ const co=Rx.reactants.species[sp]; if(co>0) sol.n[sp]=Math.max(0,(sol.n[sp]||0) - co*dxi); }
        if(Rx.reactants.headGas) for(const gk in Rx.reactants.headGas){ const co=Rx.reactants.headGas[gk]; if(co>0) sol.gas[gk]=Math.max(0,(sol.gas[gk]||0)-co*dxi); }
        if(Rx.products.species) for(const sp in Rx.products.species) sol.add(sp, Rx.products.species[sp]*dxi);
        if(Rx.products.gasMol) for(const gk in Rx.products.gasMol){ const dn=Rx.products.gasMol[gk]*dxi; sol.gas[gk]=(sol.gas[gk]||0)+dn; sol.produced[gk]=(sol.produced[gk]||0)+dn; }
        if(Rx.products.precip) for(const pk in Rx.products.precip){ sol.precip[pk]=(sol.precip[pk]||0)+Rx.products.precip[pk]*dxi; }
        sol.addHeat(-(Rx.dHkJ||0)*1000*dxi);
        (Rx.effects||[]).forEach(e=>effects.add(e));
        if(Rx.flame) flame = Rx.flame;
        sol._active[Rx.id] = Rx;
        events.push(Rx.id);
      }
    }
    const snap = sol.snapshot();
    if(snap.T_C >= 99){ effects.add('boil'); if(Math.random() < 0.05) { effects.add('bump'); effects.add('spatter'); } }
    // Newton relaxation toward ambient/heater
    const ambientC = env.heating ? 110 : (env.venting ? 22 : 25);
    sol.T += ((ambientC+273.15) - sol.T) * Math.min(1, dt*0.05);
    return { effects, flame, events, snap, active:Object.values(sol._active||{}) };
  }
  // which reactions COULD run with current contents (for arming / equation display)
  candidates(sol, env){
    const out=[];
    for(const Rx of REACTIONS){
      if(Rx.requireConc){ let ok=true; for(const rg of Rx.requireConc){ if(!sol.concReagents.has(rg)) ok=false; } if(!ok) continue; }
      if(Rx.forbidConc){ let bad=false; for(const rg of Rx.forbidConc){ if(sol.concReagents.has(rg)) bad=true; } if(bad) continue; }
      if(Rx.requireSolid){ let rso=true; for(const sid of Rx.requireSolid){ if((sol.solids[sid]||0)<1e-6) rso=false; } if(!rso) continue; }
      let ok=true;
      if(Rx.reactants.water && sol.V < 0.02) ok=false;
      if(Rx.reactants.solid){ for(const sid in Rx.reactants.solid){ if((sol.solids[sid]||0) <= 1e-6) ok=false; } }
      if(Rx.reactants.species){ for(const sp in Rx.reactants.species){ if(Rx.reactants.species[sp]>0 && (sol.n[sp]||0) <= 1e-6) ok=false; } }
      if(Rx.reactants.headGas){ for(const gk in Rx.reactants.headGas){ if(Rx.reactants.headGas[gk]>0 && (sol.gas[gk]||0)<=1e-6) ok=false; } }
      if(ok) out.push(Rx);
    }
    return out;
  }
}

// ---- Mission predicate (single source of truth for clear conditions) -------------
// target keys (all present must hold): producedGas+min, ion+minConc, notFailed
export function missionMet(target, sol, ctx){
  if(!target) return false; ctx = ctx || {};
  if(target.producedGas && (sol.produced[target.producedGas]||0) < (target.min||0.001)) return false;
  if(target.ion && sol.conc(target.ion) < (target.minConc||0.01)) return false;
  if(target.precip && (sol.precip[target.precip.id]||0) < (target.precip.min||0.001)) return false;
  if(target.notFailed && ctx.failed) return false;
  return true;
}
