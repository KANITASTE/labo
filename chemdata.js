// chemdata.js — Chemistry data layer (JSON-equivalent, framework-agnostic).
// All quantitative data for the simulator lives here, separated from engine logic and rendering.

// ---- Aqueous / dissolved species -------------------------------------------------
// lambda: limiting molar conductivity Λ° (S·cm²·mol⁻¹). color: per-mol/L tint contribution (rgb).
export const SPECIES = {
  'H+':    { z:+1, lambda:349.8, name:'H⁺' },
  'OH-':   { z:-1, lambda:198.0, name:'OH⁻' },
  'Na+':   { z:+1, lambda:50.1,  name:'Na⁺' },
  'K+':    { z:+1, lambda:73.5,  name:'K⁺' },
  'Cl-':   { z:-1, lambda:76.3,  name:'Cl⁻' },
  'NO3-':  { z:-1, lambda:71.4,  name:'NO₃⁻' },
  'SO4-2': { z:-2, lambda:160.0, name:'SO₄²⁻' },
  'ClO-':  { z:-1, lambda:67.0,  name:'ClO⁻' },
  'NH4+':  { z:+1, lambda:73.5,  name:'NH₄⁺' },
  'Cu+2':  { z:+2, lambda:107.2, name:'Cu²⁺', color:[20,95,205], cThresh:0.5 },   // blue
  'Fe+2':  { z:+2, lambda:108.0, name:'Fe²⁺', color:[120,175,120], cThresh:0.8 }, // pale green
  'AuCl4-':{ z:-1, lambda:60.0,  name:'[AuCl₄]⁻', color:[225,185,70], cThresh:0.4 }, // yellow
  'Mg+2':  { z:+2, lambda:106.0, name:'Mg²⁺' },
  'Al+3':  { z:+3, lambda:183.0, name:'Al³⁺' },
  'Ca+2':  { z:+2, lambda:119.0, name:'Ca²⁺' },
  'Zn+2':  { z:+2, lambda:105.6, name:'Zn²⁺' },
  'Ag+':   { z:+1, lambda:61.9,  name:'Ag⁺' },
  'Pb+2':  { z:+2, lambda:139.0, name:'Pb²⁺' },
  'Ni+2':  { z:+2, lambda:108.0, name:'Ni²⁺', color:[64,168,108], cThresh:0.45 }, // green
  'Hg+2':  { z:+2, lambda:127.0, name:'Hg²⁺' }, // colourless
  'Mn+2':  { z:+2, lambda:107.0, name:'Mn²⁺', color:[224,168,184], cThresh:1.6 }, // very pale pink
  'K+2':   { z:+1, lambda:73.5,  name:'K⁺' },
  'HCO3-': { z:-1, lambda:44.5,  name:'HCO₃⁻' },
  'CO3-2': { z:-2, lambda:138.6, name:'CO₃²⁻' },
  'Ba+2':  { z:+2, lambda:127.2, name:'Ba²⁺' },
  'I-':    { z:-1, lambda:76.8,  name:'I⁻' },
  'Sn+2':  { z:+2, lambda:0,     name:'Sn²⁺' },  // colourless
  'Sn+4':  { z:+4, lambda:0,     name:'Sn⁴⁺' },  // colourless
  'SnO2-2':{ z:-2, lambda:0,     name:'[Sn(OH)₄]²⁻（スズ酸イオン）' },
  'Cr+2':  { z:+2, lambda:0,     name:'Cr²⁺', color:[60,110,205], cThresh:0.5 },  // blue
  'Cr+3':  { z:+3, lambda:67.0,  name:'Cr³⁺', color:[70,150,110], cThresh:0.45 }, // green
  'Co+2':  { z:+2, lambda:106.0, name:'Co²⁺', color:[232,118,150], cThresh:0.4 }, // pink
  'MnO4-': { z:-1, lambda:61.0,  name:'MnO₄⁻', color:[120,18,140], cThresh:0.04 }, // intense purple
  'I2aq':  { z:0,  lambda:0, name:'I₂(aq)', color:[150,100,42], cThresh:0.08 },     // brown
  'SI':    { z:0,  lambda:0, name:'ヨウ素デンプン', color:[26,16,70], cThresh:0.02 }, // blue-black
  'starch':{ z:0,  lambda:0, name:'デンプン' },
  'sucrose':{ z:0, lambda:0, name:'スクロース' },
  'C':     { z:0, lambda:0, name:'炭素', color:[20,16,14], cThresh:0.05 },
  // neutral / molecular (no conductivity)
  'NH3':   { z:0,  lambda:0, name:'NH₃' },
  'H2O2':  { z:0,  lambda:0, name:'H₂O₂' },
};

// ---- Gas species (headspace) -----------------------------------------------------
export const GASES = {
  'H2':  { name:'水素 H₂',      color:[220,235,245], danger:1, lethal:false, odor:'無臭',     flammable:true,  desc:'可燃性。引火・爆発に注意。' },
  'O2':  { name:'酸素 O₂',      color:[150,190,255], danger:1, lethal:false, odor:'無臭',     flammable:false, desc:'支燃性。燃焼を助ける。' },
  'CO2': { name:'二酸化炭素 CO₂',color:[180,180,185], danger:1, lethal:false, odor:'無臭',     flammable:false, desc:'不燃性。高濃度で窒息性。' },
  'Cl2': { name:'塩素 Cl₂',     color:[190,224,118], danger:5, lethal:true,  odor:'刺激臭',   flammable:false, desc:'吸入危険。高濃度では致死性。必ず換気装置内で。' },
  'H2S': { name:'硫化水素 H₂S', color:[205,214,168], danger:4, lethal:true,  odor:'腐った卵臭',flammable:true,  desc:'高濃度では嗅覚が麻痺し致死性あり。換気とガス検知器を併用。' },
  'NO2': { name:'二酸化窒素 NO₂',color:[172,72,42],   danger:4, lethal:false, odor:'刺激臭',   flammable:false, desc:'吸入で気道を刺激。高濃度で有毒。換気を推奨。' },
  'NO':  { name:'一酸化窒素 NO',  color:[150,160,172], danger:3, lethal:false, odor:'無臭',     flammable:false, desc:'無色のガス。空気中で速やかに酸化され赤褐色のNO₂になる。希硝酸と金属の反応で発生。' },
  'SO2': { name:'二酸化硫黄 SO₂',color:[210,205,150], danger:4, lethal:false, odor:'刺激臭',   flammable:false, desc:'刺激性・有毒。換気必須。' },
  'NH3g':{ name:'アンモニア NH₃',color:[200,210,230], danger:3, lethal:false, odor:'刺激臭',   flammable:false, desc:'刺激臭。粘膜を刺激する。' },
  'He':  { name:'ヘリウム He',  color:[208,224,236], danger:1, lethal:false, odor:'無臭',     flammable:false, desc:'不活性ガス。化学的に安定でほとんど反応しない。' },
  'Hgv': { name:'水銀蒸気 Hg',  color:[176,182,194], danger:4, lethal:false, odor:'無臭（無警告）', flammable:false, desc:'無臭で気付きにくいが有毒。吸入で神経を冒す。必ず換気装置内で扱う。' },
};

// ---- Reagents the user can add ---------------------------------------------------
// kind: liquid|metal|powder|gas. For liquids, molarity (mol/L) + doseMl define what one "add" pours.
// dissoc: species produced per mole of solute. concAcid flag marks concentrated (for dilution heat / hot-only routes).
export const REAGENTS = {
  '水':           { kind:'liquid', state:'liquid', doseMl:150, molarity:0, dissoc:{} },
  '海水':         { kind:'liquid', state:'liquid', doseMl:150, molarity:0.6, dissoc:{'Na+':1,'Cl-':1} },
  'エタノール':   { kind:'liquid', state:'liquid', doseMl:60,  molarity:0, dissoc:{}, fuel:true },
  '硫酸希':       { kind:'liquid', state:'liquid', doseMl:50,  molarity:3,  dissoc:{'H+':2,'SO4-2':1} },
  '硫酸濃':       { kind:'liquid', state:'liquid', doseMl:40,  molarity:18, concAcid:true, dissoc:{'H+':2,'SO4-2':1}, dilHkJ:-75 },
  '塩酸':         { kind:'liquid', state:'liquid', doseMl:50,  molarity:6,  dissoc:{'H+':1,'Cl-':1} },
  '硝酸希':       { kind:'liquid', state:'liquid', doseMl:50,  molarity:6,  dissoc:{'H+':1,'NO3-':1} },
  '硝酸濃':       { kind:'liquid', state:'liquid', doseMl:40,  molarity:14, concAcid:true, dissoc:{'H+':1,'NO3-':1}, dilHkJ:-33 },
  '漂白剤':       { kind:'liquid', state:'liquid', doseMl:50,  molarity:3.0, dissoc:{'Na+':1,'ClO-':1} },
  'アンモニア水': { kind:'liquid', state:'liquid', doseMl:50,  molarity:6,  weakBase:true, dissoc:{'NH3':1} },
  '過酸化水素水': { kind:'liquid', state:'liquid', doseMl:50,  molarity:3,  dissoc:{'H2O2':1} },
  '硫化鉄':       { kind:'powder', state:'powder', molPerAdd:0.12, solid:'FeS', molarMass:87.9 },
  'H':  { kind:'gas', state:'gas', gas:'H2',  molPerAdd:0.06 },
  'O':  { kind:'gas', state:'gas', gas:'O2',  molPerAdd:0.06 },
  'N':  { kind:'gas', state:'gas', gas:'N2',  molPerAdd:0.06 },
  'Cl': { kind:'gas', state:'gas', gas:'Cl2', molPerAdd:0.04 },
  'Na': { kind:'metal', state:'metal', molPerAdd:0.06, solid:'Na', float:true, molarMass:23 },
  'K':  { kind:'metal', state:'metal', molPerAdd:0.06, solid:'K',  float:true, molarMass:39 },
  'Fe': { kind:'metal', state:'metal', molPerAdd:0.05, solid:'Fe', molarMass:55.8 },
  'Cu': { kind:'metal', state:'metal', molPerAdd:0.05, solid:'Cu', molarMass:63.5 },
  'Au': { kind:'metal', state:'metal', molPerAdd:0.02, solid:'Au', molarMass:197 },
  'Mg': { kind:'metal', state:'metal', molPerAdd:0.06, solid:'Mg', molarMass:24 },
  'Al': { kind:'metal', state:'metal', molPerAdd:0.05, solid:'Al', molarMass:27 },
  'Ca': { kind:'metal', state:'metal', molPerAdd:0.06, solid:'Ca', molarMass:40 },
  'Zn': { kind:'metal', state:'metal', molPerAdd:0.05, solid:'Zn', molarMass:65 },
  'Ag': { kind:'metal', state:'metal', molPerAdd:0.04, solid:'Ag', molarMass:108 },
  'Pb': { kind:'metal', state:'metal', molPerAdd:0.04, solid:'Pb', molarMass:207 },
  'Ni': { kind:'metal', state:'metal', molPerAdd:0.05, solid:'Ni', molarMass:58.7 },
  'Hg': { kind:'metal', state:'metal', molPerAdd:0.03, solid:'Hg', molarMass:200.6 },
  'Sn': { kind:'metal', state:'metal', molPerAdd:0.05, solid:'Sn', molarMass:118.7 },
  'Cr': { kind:'metal', state:'metal', molPerAdd:0.05, solid:'Cr', molarMass:52 },
  'Co': { kind:'metal', state:'metal', molPerAdd:0.05, solid:'Co', molarMass:58.9 },
  'Mn': { kind:'metal', state:'metal', molPerAdd:0.05, solid:'Mn', molarMass:54.9 },
  'He': { kind:'gas',   state:'gas',   gas:'He', molPerAdd:0.06 },
  'S':  { kind:'powder',state:'powder',molPerAdd:0.08, solid:'S', molarMass:32 },
  '炭酸カルシウム':     { kind:'powder', state:'powder', molPerAdd:0.10, solid:'CaCO3', molarMass:100 },
  '炭酸水素ナトリウム': { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.08, dissoc:{'Na+':1,'HCO3-':1} },
  '砂糖':   { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.10, dissoc:{'sucrose':1} },
  'デンプン':{ kind:'solute', state:'solute', doseMl:8, molPerAdd:0.06, dissoc:{'starch':1} },
  'ヨウ素': { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.03, dissoc:{'I2aq':1} },
  'KMnO₄': { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.03, dissoc:{'K+':1,'MnO4-':1} },
  'CuSO₄': { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.07, dissoc:{'Cu+2':1,'SO4-2':1} },
  'AgNO₃': { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.07, dissoc:{'Ag+':1,'NO3-':1} },
  '硝酸鉛': { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.07, dissoc:{'Pb+2':1,'NO3-':2} },
  '水酸化ナトリウム': { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.10, strongBase:true, dissoc:{'Na+':1,'OH-':1} },
  '水酸化カリウム':   { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.10, strongBase:true, dissoc:{'K+':1,'OH-':1} },
  '炭酸ナトリウム':   { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.08, dissoc:{'Na+':2,'CO3-2':1} },
  '塩化ナトリウム':   { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.10, dissoc:{'Na+':1,'Cl-':1} },
  '塩化バリウム':     { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.08, dissoc:{'Ba+2':1,'Cl-':2} },
  '硝酸バリウム':     { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.08, dissoc:{'Ba+2':1,'NO3-':2} },
  'ヨウ化カリウム':   { kind:'solute', state:'solute', doseMl:8, molPerAdd:0.08, dissoc:{'K+':1,'I-':1} },
  'BTB溶液':           { kind:'indicator', state:'indicator', doseMl:3, indicator:'BTB' },
  'フェノールフタレイン': { kind:'indicator', state:'indicator', doseMl:3, indicator:'PP' },
  'メチルオレンジ':     { kind:'indicator', state:'indicator', doseMl:3, indicator:'MO' },
  'リトマス':           { kind:'indicator', state:'indicator', doseMl:3, indicator:'LITMUS' },
};

// ---- Reactions (data only) -------------------------------------------------------
// extent ξ measured in "reaction units" as written. Consumption/production are per ξ.
//  reactants: { solid:{id:coeff}, species:{id:coeff}, water:true }
//  products:  { species:{id:coeff}, gasMol:{id:coeff} }
//  dHkJ: enthalpy per ξ (negative = exothermic). rate: max dξ/s. effects drive visuals.
//  needHeat / hotConc: gating. danger: {lethalGas} computed from gases. fail: teaching text.
export const REACTIONS = [
  { id:'aquaRegia', eq:'Au + 4HCl + HNO₃ → [AuCl₄]⁻ + NO↑ + 2H₂O', ionEq:'Au + 4Cl⁻ + NO₃⁻ + 4H⁺ → [AuCl₄]⁻ + NO↑ + 2H₂O', rxClass:'酸化還元（溶解）', jp:'王水で金を溶解', en:'Aqua regia',
    reactants:{ solid:{'Au':1}, species:{'H+':4,'Cl-':4,'NO3-':1} }, products:{ species:{'AuCl4-':1}, gasMol:{'NO':1} },
    dHkJ:-90, rate:0.012, effects:['gas'], requireConc:['硝酸濃'], log:'王水が金を黄色い溶液へ溶かす。' },

  { id:'K_water', eq:'2K + 2H₂O → 2KOH + H₂↑', ionEq:'2K + 2H₂O → 2K⁺ + 2OH⁻ + H₂↑', rxClass:'酸化還元（水との反応）', jp:'カリウムと水', en:'Potassium + Water',
    reactants:{ solid:{'K':2}, water:true }, products:{ species:{'K+':2,'OH-':2}, gasMol:{'H2':1} },
    dHkJ:-393, rate:0.10, effects:['skitter','spatter','ignite'], flame:[200,120,255], log:'カリウムが紫の炎を上げ激しく反応。' },
  { id:'Na_water', eq:'2Na + 2H₂O → 2NaOH + H₂↑', ionEq:'2Na + 2H₂O → 2Na⁺ + 2OH⁻ + H₂↑', rxClass:'酸化還元（水との反応）', jp:'ナトリウムと水', en:'Sodium + Water',
    reactants:{ solid:{'Na':2}, water:true }, products:{ species:{'Na+':2,'OH-':2}, gasMol:{'H2':1} },
    dHkJ:-368, rate:0.06, effects:['skitter','spatter','ignite'], flame:[255,200,90], log:'ナトリウムが水面を走り発火。' },
  { id:'Na_HCl', eq:'2Na + 2HCl → 2NaCl + H₂↑', ionEq:'2Na + 2H⁺ → 2Na⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'ナトリウムと塩酸', en:'Sodium + HCl',
    reactants:{ solid:{'Na':2}, species:{'H+':2} }, products:{ species:{'Na+':2}, gasMol:{'H2':1} },
    dHkJ:-368, rate:0.09, effects:['skitter','spatter','ignite'], flame:[255,200,90], log:'激しく発泡し水素を放出。' },
  { id:'Ca_water', eq:'Ca + 2H₂O → Ca(OH)₂ + H₂↑', ionEq:'Ca + 2H₂O → Ca²⁺ + 2OH⁻ + H₂↑', rxClass:'酸化還元（水との反応）', jp:'カルシウムと水', en:'Calcium + Water',
    reactants:{ solid:{'Ca':1}, water:true }, products:{ species:{'Ca+2':1,'OH-':2}, gasMol:{'H2':1} },
    dHkJ:-414, rate:0.035, effects:['fizz'], log:'カルシウムが水と反応し水素を発生、pH上昇。' },

  { id:'Mg_HCl', eq:'Mg + 2HCl → MgCl₂ + H₂↑', ionEq:'Mg + 2H⁺ → Mg²⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'マグネシウムと塩酸', en:'Magnesium + HCl',
    reactants:{ solid:{'Mg':1}, species:{'H+':2} }, products:{ species:{'Mg+2':1}, gasMol:{'H2':1} },
    dHkJ:-462, rate:0.03, effects:['fizz'], log:'マグネシウムが激しく水素を発生。' },
  { id:'Al_HCl', eq:'2Al + 6HCl → 2AlCl₃ + 3H₂↑', ionEq:'2Al + 6H⁺ → 2Al³⁺ + 3H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'アルミニウムと塩酸', en:'Aluminium + HCl',
    reactants:{ solid:{'Al':2}, species:{'H+':6} }, products:{ species:{'Al+3':2}, gasMol:{'H2':3} },
    dHkJ:-1052, rate:0.018, effects:['fizz'], log:'アルミニウムが水素を発生して溶ける。' },
  { id:'Zn_HCl', eq:'Zn + 2HCl → ZnCl₂ + H₂↑', ionEq:'Zn + 2H⁺ → Zn²⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'亜鉛と塩酸', en:'Zinc + HCl',
    reactants:{ solid:{'Zn':1}, species:{'H+':2} }, products:{ species:{'Zn+2':1}, gasMol:{'H2':1} },
    dHkJ:-153, rate:0.02, effects:['fizz'], log:'亜鉛が溶け水素を発生。' },
  { id:'Fe_HCl', eq:'Fe + 2HCl → FeCl₂ + H₂↑', ionEq:'Fe + 2H⁺ → Fe²⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'鉄と塩酸', en:'Iron + HCl',
    reactants:{ solid:{'Fe':1}, species:{'H+':2} }, products:{ species:{'Fe+2':1}, gasMol:{'H2':1} },
    dHkJ:-89, rate:0.016, effects:['fizz'], log:'鉄が溶け、水素の泡が発生。' },
  { id:'Fe_H2SO4', eq:'Fe + H₂SO₄ → FeSO₄ + H₂↑', ionEq:'Fe + 2H⁺ → Fe²⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'鉄と希硫酸', en:'Iron + dilute H₂SO₄',
    reactants:{ solid:{'Fe':1}, species:{'H+':2,'SO4-2':1} }, products:{ species:{'Fe+2':1,'SO4-2':1}, gasMol:{'H2':1} },
    dHkJ:-89, rate:0.016, effects:['fizz'], log:'淡緑色の硫酸鉄を生じ水素発生。' },
  { id:'Ni_HCl', eq:'Ni + 2HCl → NiCl₂ + H₂↑', ionEq:'Ni + 2H⁺ → Ni²⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'ニッケルと塩酸', en:'Nickel + HCl',
    reactants:{ solid:{'Ni':1}, species:{'H+':2} }, products:{ species:{'Ni+2':1}, gasMol:{'H2':1} },
    dHkJ:-110, rate:0.012, effects:['fizz'], log:'ニッケルがゆっくり溶け、緑色のNi²⁺と水素を発生。' },
  { id:'Ni_H2SO4', eq:'Ni + H₂SO₄ → NiSO₄ + H₂↑', ionEq:'Ni + 2H⁺ → Ni²⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'ニッケルと希硫酸', en:'Nickel + dilute H₂SO₄',
    reactants:{ solid:{'Ni':1}, species:{'H+':2,'SO4-2':1} }, products:{ species:{'Ni+2':1,'SO4-2':1}, gasMol:{'H2':1} },
    dHkJ:-110, rate:0.012, effects:['fizz'], log:'ニッケルが硫酸に溶け、緑色の溶液になる。' },

  { id:'Sn_HCl', eq:'Sn + 2HCl → SnCl₂ + H₂↑', ionEq:'Sn + 2H⁺ → Sn²⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'スズと塩酸', en:'Tin + HCl',
    reactants:{ solid:{'Sn':1}, species:{'H+':2} }, products:{ species:{'Sn+2':1}, gasMol:{'H2':1} },
    dHkJ:-55, rate:0.012, effects:['fizz'], log:'スズが希塩酸に溶け、Sn²⁺と水素を発生。さらに酸化されるとSn⁴⁺になる。' },
  { id:'Sn_NaOH', eq:'Sn + 2NaOH + 2H₂O → Na₂[Sn(OH)₄] + H₂↑', ionEq:'Sn + 2OH⁻ + 2H₂O → [Sn(OH)₄]²⁻ + H₂↑', rxClass:'両性金属（塩基との反応）', jp:'スズと水酸化ナトリウム', en:'Tin + NaOH (amphoteric)',
    reactants:{ solid:{'Sn':1}, species:{'OH-':2} }, products:{ species:{'SnO2-2':1}, gasMol:{'H2':1} },
    dHkJ:-50, rate:0.011, effects:['fizz'], log:'スズは両性金属。強塩基にも溶けてスズ酸イオンと水素を発生。' },
  { id:'Cr_HCl', eq:'Cr + 2HCl → CrCl₂ + H₂↑', ionEq:'Cr + 2H⁺ → Cr²⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'クロムと塩酸', en:'Chromium + HCl',
    reactants:{ solid:{'Cr':1}, species:{'H+':2} }, products:{ species:{'Cr+2':1}, gasMol:{'H2':1} }, forbidConc:['硝酸濃'],
    dHkJ:-70, rate:0.012, effects:['fizz'], log:'クロムが希塩酸に溶け、青色のCr²⁺と水素を発生。' },
  { id:'Cr_passivate', eq:'Cr + 濃硝酸 → （不動態被膜・反応せず）', ionEq:'表面に緻密な酸化被膜を形成 → 反応停止', rxClass:'不動態', jp:'クロムの不動態化', en:'Chromium passivation',
    reactants:{ solid:{'Cr':1} }, products:{}, requireConc:['硝酸濃'],
    dHkJ:0, rate:0, effects:['passivate'], log:'クロムは濃硝酸では表面に緻密な不動態被膜を形成し、反応が停止する（不動態）。' },
  { id:'Co_HCl', eq:'Co + 2HCl → CoCl₂ + H₂↑', ionEq:'Co + 2H⁺ → Co²⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'コバルトと塩酸', en:'Cobalt + HCl',
    reactants:{ solid:{'Co':1}, species:{'H+':2} }, products:{ species:{'Co+2':1}, gasMol:{'H2':1} },
    dHkJ:-60, rate:0.011, effects:['fizz'], log:'コバルトが希塩酸に溶け、淡桃色のCo²⁺水溶液と水素を発生。' },
  { id:'Mn_HCl', eq:'Mn + 2HCl → MnCl₂ + H₂↑', ionEq:'Mn + 2H⁺ → Mn²⁺ + H₂↑', rxClass:'酸化還元（金属＋酸）', jp:'マンガンと塩酸', en:'Manganese + HCl',
    reactants:{ solid:{'Mn':1}, species:{'H+':2} }, products:{ species:{'Mn+2':1}, gasMol:{'H2':1} },
    dHkJ:-220, rate:0.022, effects:['fizz'], log:'マンガンはイオン化傾向が大きく、希塩酸とよく反応してMn²⁺と水素を発生。' },

  { id:'Cu_HNO3', eq:'Cu + 4HNO₃(濃) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O', ionEq:'Cu + 4H⁺ + 2NO₃⁻ → Cu²⁺ + 2NO₂↑ + 2H₂O', rxClass:'酸化還元（濃硝酸）', jp:'銅と濃硝酸', en:'Copper + conc. nitric',
    reactants:{ solid:{'Cu':1}, species:{'H+':4,'NO3-':2} }, products:{ species:{'Cu+2':1}, gasMol:{'NO2':2} },
    dHkJ:-150, rate:0.02, effects:['gas','fizz'], requireConc:['硝酸濃'], log:'濃硝酸が銅を溶かし、溶液が青色に。赤褐色のNO₂が発生。' },
  { id:'Cu_HNO3_dil', eq:'3Cu + 8HNO₃(希) → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O', ionEq:'3Cu + 8H⁺ + 2NO₃⁻ → 3Cu²⁺ + 2NO↑ + 4H₂O', rxClass:'酸化還元（希硝酸）', jp:'銅と希硝酸', en:'Copper + dilute nitric',
    reactants:{ solid:{'Cu':3}, species:{'H+':8,'NO3-':2} }, products:{ species:{'Cu+2':3}, gasMol:{'NO':2} },
    dHkJ:-160, rate:0.018, effects:['gas','fizz'], forbidConc:['硝酸濃'], log:'希硝酸が銅を溶かし青色に。無色のNOが発生し、空気中で赤褐色のNO₂へ変化。' },
  { id:'Cu_H2SO4hot', eq:'Cu + 2H₂SO₄(濃) → CuSO₄ + SO₂↑ + 2H₂O', ionEq:'Cu + 4H⁺ + SO₄²⁻ → Cu²⁺ + SO₂↑ + 2H₂O', rxClass:'酸化還元（熱濃硫酸）', jp:'銅と熱濃硫酸', en:'Copper + hot conc. H₂SO₄',
    reactants:{ solid:{'Cu':1}, species:{'H+':4,'SO4-2':2} }, products:{ species:{'Cu+2':1,'SO4-2':1}, gasMol:{'SO2':1} },
    dHkJ:-130, rate:0.02, effects:['gas'], needHeat:true, requireConc:['硫酸濃'], log:'加熱した濃硫酸が銅を溶かし、二酸化硫黄を発生。希硫酸とは反応しない。' },
  { id:'Ag_HNO3', eq:'Ag + 2HNO₃(濃) → AgNO₃ + NO₂↑ + H₂O', ionEq:'Ag + 2H⁺ + NO₃⁻ → Ag⁺ + NO₂↑ + H₂O', rxClass:'酸化還元（濃硝酸）', jp:'銀と濃硝酸', en:'Silver + conc. nitric',
    reactants:{ solid:{'Ag':1}, species:{'H+':2,'NO3-':1} }, products:{ species:{'Ag+':1}, gasMol:{'NO2':1} },
    dHkJ:-100, rate:0.018, effects:['gas'], requireConc:['硝酸濃'], log:'銀が濃硝酸に溶け二酸化窒素が発生。' },
  { id:'Ag_HNO3_dil', eq:'3Ag + 4HNO₃(希) → 3AgNO₃ + NO↑ + 2H₂O', ionEq:'3Ag + 4H⁺ + NO₃⁻ → 3Ag⁺ + NO↑ + 2H₂O', rxClass:'酸化還元（希硝酸）', jp:'銀と希硝酸', en:'Silver + dilute nitric',
    reactants:{ solid:{'Ag':3}, species:{'H+':4,'NO3-':1} }, products:{ species:{'Ag+':3}, gasMol:{'NO':1} },
    dHkJ:-90, rate:0.012, effects:['gas'], forbidConc:['硝酸濃'], log:'銀が希硝酸に溶け、無色のNOが発生。' },
  { id:'Hg_HNO3', eq:'Hg + 4HNO₃(濃) → Hg(NO₃)₂ + 2NO₂↑ + 2H₂O', ionEq:'Hg + 4H⁺ + 2NO₃⁻ → Hg²⁺ + 2NO₂↑ + 2H₂O', rxClass:'酸化還元（濃硝酸）', jp:'水銀と濃硝酸', en:'Mercury + conc. nitric',
    reactants:{ solid:{'Hg':1}, species:{'H+':4,'NO3-':2} }, products:{ species:{'Hg+2':1}, gasMol:{'NO2':2} },
    dHkJ:-120, rate:0.014, effects:['gas'], requireConc:['硝酸濃'], log:'水銀が濃硝酸に溶け、赤褐色のNO₂が発生。' },

  { id:'neutralize_strong', eq:'酸 + 塩基 → 塩 + H₂O', ionEq:'H⁺ + OH⁻ → H₂O', rxClass:'中和', jp:'中和反応（強酸＋強塩基）', en:'Neutralization',
    reactants:{ species:{'H+':1,'OH-':1} }, products:{}, dHkJ:-57, rate:0.6, effects:['color'], log:'H⁺とOH⁻が中和して水を生じ、pHが中性へ近づく。指示薬の色が変化する。' },
  { id:'neutralize_HCl_NH3', eq:'NH₃ + HCl → NH₄Cl', ionEq:'NH₃ + H⁺ → NH₄⁺', rxClass:'中和（白煙）', jp:'中和（白煙）', en:'Neutralization (white fumes)',
    reactants:{ species:{'NH3':1,'H+':1} }, products:{ species:{'NH4+':1} }, dHkJ:-52, rate:0.5, effects:['fumes'], log:'白い煙（塩化アンモニウム）が立ち上り中和。' },
  { id:'neutralize_H2SO4_NH3', eq:'2NH₃ + H₂SO₄ → (NH₄)₂SO₄', ionEq:'NH₃ + H⁺ → NH₄⁺', rxClass:'中和', jp:'中和反応', en:'Neutralization',
    reactants:{ species:{'NH3':2,'H+':2} }, products:{ species:{'NH4+':2} }, dHkJ:-100, rate:0.5, effects:['color'], log:'中和反応で発熱、pHが中性へ。' },

  { id:'CaCO3_HCl', eq:'CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O', ionEq:'CaCO₃ + 2H⁺ → Ca²⁺ + H₂O + CO₂↑', rxClass:'気体発生（弱酸遊離）', jp:'炭酸カルシウムと塩酸', en:'Carbonate + HCl',
    reactants:{ solid:{'CaCO3':1}, species:{'H+':2} }, products:{ species:{'Ca+2':1}, gasMol:{'CO2':1} },
    dHkJ:-15, rate:0.05, effects:['fizz'], log:'炭酸カルシウムが発泡し二酸化炭素を発生。' },
  { id:'NaHCO3_HCl', eq:'NaHCO₃ + HCl → NaCl + CO₂↑ + H₂O', ionEq:'HCO₃⁻ + H⁺ → H₂O + CO₂↑', rxClass:'気体発生（弱酸遊離）', jp:'重曹と塩酸', en:'Bicarbonate + HCl',
    reactants:{ species:{'HCO3-':1,'H+':1} }, products:{ gasMol:{'CO2':1} },
    dHkJ:-12, rate:0.12, effects:['fizz'], log:'重曹が激しく発泡し二酸化炭素を発生。' },
  { id:'Na2CO3_HCl', eq:'Na₂CO₃ + 2HCl → 2NaCl + CO₂↑ + H₂O', ionEq:'CO₃²⁻ + 2H⁺ → H₂O + CO₂↑', rxClass:'気体発生（弱酸遊離）', jp:'炭酸ナトリウムと塩酸', en:'Carbonate + HCl',
    reactants:{ species:{'CO3-2':1,'H+':2} }, products:{ gasMol:{'CO2':1} },
    dHkJ:-14, rate:0.10, effects:['fizz'], log:'炭酸ナトリウムが酸と反応し二酸化炭素を発生。' },

  { id:'bleach_HCl', eq:'NaClO + 2HCl → Cl₂↑ + NaCl + H₂O', ionEq:'ClO⁻ + 2H⁺ + Cl⁻ → Cl₂↑ + H₂O', rxClass:'酸化還元（気体発生）', jp:'塩素ガス発生', en:'Chlorine generation',
    reactants:{ species:{'ClO-':1,'H+':2,'Cl-':1} }, products:{ gasMol:{'Cl2':1} },
    dHkJ:-100, rate:0.022, effects:['gas'], log:'淡黄緑色の塩素ガスが発生。換気必須。',
    fail:{ cause_jp:'塩素ガスが致死濃度に到達し、換気が間に合わなかった。', cause_en:'Chlorine reached a lethal concentration without adequate ventilation.', fix_jp:'塩素発生反応は必ずドラフト（換気装置）内で行い、発生と同時に換気を作動させること。', fix_en:'Always generate chlorine inside a fume hood and run ventilation from the start.' } },
  { id:'FeS_HCl', eq:'FeS + 2HCl → FeCl₂ + H₂S↑', ionEq:'FeS + 2H⁺ → Fe²⁺ + H₂S↑', rxClass:'弱酸遊離（気体発生）', jp:'硫化水素発生', en:'Hydrogen sulfide',
    reactants:{ solid:{'FeS':1}, species:{'H+':2} }, products:{ species:{'Fe+2':1}, gasMol:{'H2S':1} },
    dHkJ:-65, rate:0.02, effects:['gas','fizz'], log:'腐った卵臭の硫化水素が発生。',
    fail:{ cause_jp:'硫化水素が高濃度に達した。嗅覚は麻痺するため気付きにくく危険。', cause_en:'Hydrogen sulfide reached a dangerous concentration; the sense of smell becomes paralyzed.', fix_jp:'換気装置を常時作動させ、ガス検知器で濃度を監視すること。', fix_en:'Keep ventilation running and monitor concentration with a gas detector.' } },
  { id:'FeS_H2SO4', eq:'FeS + H₂SO₄ → FeSO₄ + H₂S↑', ionEq:'FeS + 2H⁺ → Fe²⁺ + H₂S↑', rxClass:'弱酸遊離（気体発生）', jp:'硫化水素発生', en:'Hydrogen sulfide',
    reactants:{ solid:{'FeS':1}, species:{'H+':2,'SO4-2':1} }, products:{ species:{'Fe+2':1,'SO4-2':1}, gasMol:{'H2S':1} },
    dHkJ:-65, rate:0.02, effects:['gas'], log:'硫酸でも硫化水素を発生。',
    fail:{ cause_jp:'硫化水素が高濃度に達した。', cause_en:'Hydrogen sulfide reached a dangerous concentration.', fix_jp:'換気装置を常時作動させること。', fix_en:'Keep ventilation running at all times.' } },

  { id:'H2O2_decomp', eq:'2H₂O₂ → 2H₂O + O₂↑', ionEq:'2H₂O₂ → 2H₂O + O₂↑', rxClass:'分解', jp:'過酸化水素の分解', en:'Decomposition of H₂O₂',
    reactants:{ species:{'H2O2':2} }, products:{ gasMol:{'O2':1} }, dHkJ:-98, rate:0.03, effects:['fizz'], needHeat:true, log:'加熱で酸素を放出し発泡。' },
  { id:'KMnO4_H2O2', eq:'2MnO₄⁻ + 5H₂O₂ + 6H⁺ → 2Mn²⁺ + 5O₂↑ + 8H₂O', ionEq:'2MnO₄⁻ + 5H₂O₂ + 6H⁺ → 2Mn²⁺ + 5O₂↑ + 8H₂O', rxClass:'酸化還元', jp:'過マンガン酸の還元', en:'Permanganate reduced',
    reactants:{ species:{'MnO4-':2,'H2O2':5,'H+':6} }, products:{ species:{'Mn+2':2}, gasMol:{'O2':5} }, dHkJ:-300, rate:0.04, effects:['fizz','color'], log:'過マンガン酸カリウムが還元され、紫色が消える。' },
  { id:'starch_iodine', eq:'デンプン + I₂ → ヨウ素デンプン（青紫）', ionEq:'デンプン + I₂ → 青紫色の包接化合物', rxClass:'呈色（指示薬）', jp:'ヨウ素デンプン反応', en:'Starch–iodine test',
    reactants:{ species:{'starch':1,'I2aq':1} }, products:{ species:{'SI':1} }, dHkJ:-4, rate:0.5, effects:['color'], log:'ヨウ素デンプン反応で青紫色に呈色（指示薬）。' },

  { id:'Fe_CuSO4', eq:'Fe + CuSO₄ → FeSO₄ + Cu↓', ionEq:'Fe + Cu²⁺ → Fe²⁺ + Cu↓', rxClass:'酸化還元（金属置換）', jp:'鉄と硫酸銅（置換）', en:'Iron displaces copper',
    reactants:{ solid:{'Fe':1}, species:{'Cu+2':1} }, products:{ species:{'Fe+2':1}, precip:{'Cu':1} },
    dHkJ:-150, rate:0.03, effects:['precip'], precipColor:[180,92,52], log:'鉄が銅イオンを置換し、銅が析出。イオン化傾向 Fe > Cu。青色が薄まる。' },
  { id:'Zn_CuSO4', eq:'Zn + CuSO₄ → ZnSO₄ + Cu↓', ionEq:'Zn + Cu²⁺ → Zn²⁺ + Cu↓', rxClass:'酸化還元（金属置換）', jp:'亜鉛と硫酸銅（置換）', en:'Zinc displaces copper',
    reactants:{ solid:{'Zn':1}, species:{'Cu+2':1} }, products:{ species:{'Zn+2':1}, precip:{'Cu':1} },
    dHkJ:-210, rate:0.03, effects:['precip'], precipColor:[180,92,52], log:'亜鉛が銅イオンを置換し、銅が析出。イオン化傾向 Zn > Cu。' },
  { id:'Cu_AgNO3', eq:'Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag↓', ionEq:'Cu + 2Ag⁺ → Cu²⁺ + 2Ag↓', rxClass:'酸化還元（金属置換）', jp:'銅と硝酸銀（銀樹）', en:'Copper displaces silver',
    reactants:{ solid:{'Cu':1}, species:{'Ag+':2} }, products:{ species:{'Cu+2':1}, precip:{'Ag':2} },
    dHkJ:-150, rate:0.03, effects:['precip'], precipColor:[222,224,228], log:'銅が銀を析出（銀樹）。イオン化傾向 Cu > Ag。溶液が青く色づく。' },

  { id:'AgCl_precip', eq:'AgNO₃ + NaCl → AgCl↓ + NaNO₃', ionEq:'Ag⁺ + Cl⁻ → AgCl↓', rxClass:'沈殿（白色）', jp:'塩化銀の沈殿', en:'Silver chloride precipitate',
    reactants:{ species:{'Ag+':1,'Cl-':1} }, products:{ precip:{'AgCl':1} },
    dHkJ:-65, rate:0.3, effects:['precip'], precipColor:[238,240,243], log:'Ag⁺とCl⁻が反応し、塩化銀の白色沈殿が生成。' },
  { id:'BaSO4_precip', eq:'BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl', ionEq:'Ba²⁺ + SO₄²⁻ → BaSO₄↓', rxClass:'沈殿（白色）', jp:'硫酸バリウムの沈殿', en:'Barium sulfate precipitate',
    reactants:{ species:{'Ba+2':1,'SO4-2':1} }, products:{ precip:{'BaSO4':1} },
    dHkJ:-25, rate:0.3, effects:['precip'], precipColor:[240,242,245], log:'Ba²⁺とSO₄²⁻が反応し、硫酸バリウムの白色沈殿が生成（硫酸イオンの検出）。' },
  { id:'PbI2_precip', eq:'Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃', ionEq:'Pb²⁺ + 2I⁻ → PbI₂↓', rxClass:'沈殿（黄色）', jp:'ヨウ化鉛の沈殿', en:'Lead iodide precipitate',
    reactants:{ species:{'Pb+2':1,'I-':2} }, products:{ precip:{'PbI2':1} },
    dHkJ:-30, rate:0.3, effects:['precip'], precipColor:[235,205,70], log:'Pb²⁺とI⁻が反応し、ヨウ化鉛の鮮やかな黄色沈殿が生成。' },

  { id:'sucrose_H2SO4', eq:'C₁₂H₂₂O₁₁ →(濃H₂SO₄) 12C + 11H₂O', ionEq:'C₁₂H₂₂O₁₁ → 12C + 11H₂O', rxClass:'脱水・炭化', jp:'砂糖の脱水・炭化', en:'Dehydration of sugar',
    reactants:{ species:{'sucrose':1} }, products:{ species:{'C':12} }, dHkJ:-260, rate:0.04, effects:['char','fumes'], requireConc:['硫酸濃'], log:'濃硫酸が砂糖を脱水し、黒い炭素の柱が成長。' },

  { id:'S_combust', eq:'S + O₂ → SO₂↑', ionEq:'S + O₂ → SO₂↑', rxClass:'燃焼（酸化）', jp:'硫黄の燃焼', en:'Sulfur combustion',
    reactants:{ solid:{'S':1} }, products:{ gasMol:{'SO2':1} },
    dHkJ:-297, rate:0.03, effects:['ignite','gas'], needHeat:true, flame:[120,150,255], log:'硫黄が青い炎を上げて燃え、二酸化硫黄を発生。',
    fail:{ cause_jp:'二酸化硫黄が高濃度に達した。刺激性で有毒。', cause_en:'Sulfur dioxide reached a dangerous concentration.', fix_jp:'燃焼実験は必ず換気装置内で行い、SO₂を吸い込まないこと。', fix_en:'Burn sulfur inside a fume hood; never inhale SO₂.' } },
  { id:'Fe_S', eq:'Fe + S → FeS', ionEq:'Fe + S → FeS', rxClass:'化合', jp:'鉄と硫黄の化合', en:'Iron + Sulfur synthesis',
    reactants:{ solid:{'Fe':1,'S':1} }, products:{}, dHkJ:-100, rate:0.05, effects:['ignite','precip'], needHeat:true, flame:[255,140,60], precipColor:[54,48,46], log:'加熱で鉄と硫黄が赤く発熱して化合し、黒い硫化鉄(FeS)が生成。' },
  { id:'Hg_vapor', eq:'Hg(l) → Hg(g)  （加熱で気化）', ionEq:'Hg(l) → Hg(g)', rxClass:'状態変化（気化）', jp:'水銀の気化（蒸気）', en:'Mercury vaporization',
    reactants:{ solid:{'Hg':1} }, products:{ gasMol:{'Hgv':1} }, dHkJ:60, rate:0.004, effects:['fumes'], needHeat:true, log:'⚠ 加熱で無臭・有毒の水銀蒸気が発生。気付きにくく危険。',
    fail:{ cause_jp:'水銀蒸気は無臭のため気付かぬうちに高濃度に達した。', cause_en:'Odorless mercury vapor built up unnoticed.', fix_jp:'水銀は加熱せず、必ず換気装置内で密閉して扱う。', fix_en:'Never heat mercury; handle it sealed inside a fume hood.' } },
  { id:'Al_Hg_amalgam', eq:'4Al(Hg) + 3O₂ → 2Al₂O₃（白い髭）+ 熱', ionEq:'4Al + 3O₂ → 2Al₂O₃', rxClass:'酸化（アマルガム）', jp:'アルミニウムアマルガム', en:'Aluminium amalgam',
    reactants:{ solid:{'Al':1,'Hg':0.02} }, products:{}, dHkJ:-320, rate:0.008, effects:['amalgam','fumes'], log:'水銀がアルミの酸化被膜を破壊。露出したアルミが空気中で急速に酸化し、白い酸化アルミニウムの髭が成長して発熱。' },
];

// ---- Ionization (activity) series, most reactive → least ------------------------
export const IONIZATION = ['K','Ca','Na','Mg','Al','Zn','Fe','Ni','Sn','Pb','H','Cu','Hg','Ag','Pt','Au'];

// ---- Pre-defined missions --------------------------------------------------------
export const MISSIONS = [
  { id:'gen_H2',  jp:'水素を発生させよ',           en:'Generate hydrogen gas',           hint:'金属＋酸（例：亜鉛＋塩酸）', target:{ producedGas:'H2', min:0.004 } },
  { id:'blue_cu', jp:'銅(II)の青い溶液をつくれ',     en:'Make a blue copper(II) solution', hint:'硫酸銅を水に溶かす／銅＋希硝酸', target:{ ion:'Cu+2', minConc:0.03 } },
  { id:'cl2_safe',jp:'塩素を発生させ安全に処理せよ', en:'Generate chlorine and handle it safely', hint:'漂白剤＋塩酸・換気必須', target:{ producedGas:'Cl2', min:0.004, notFailed:true } },
  { id:'gen_SO2', jp:'硫黄を燃やしSO₂を発生させよ', en:'Burn sulfur to generate SO₂', hint:'硫黄を加えて加熱（燃焼）', target:{ producedGas:'SO2', min:0.004 } },
  { id:'ppt_AgCl',jp:'白色沈殿AgClをつくれ',         en:'Form a white AgCl precipitate', hint:'硝酸銀＋塩化ナトリウム', target:{ precip:{ id:'AgCl', min:0.004 } } },
  { id:'displace_cu', jp:'イオン化傾向で銅を析出させよ', en:'Displace copper metal', hint:'亜鉛/鉄＋硫酸銅（Zn,Fe > Cu）', target:{ precip:{ id:'Cu', min:0.004 } } },
];
