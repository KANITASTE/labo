/* ============================================================
   Virtual Chemistry Lab — viewing-only demo system
   Pre-consent safe. No lab engine is started here.
   All demos are self-contained, simplified educational animations.
   ============================================================ */
(function(){
'use strict';

/* ---------- language helpers ---------- */
function lang(){ return document.documentElement.classList.contains('lang-en') ? 'en' : 'ja'; }
function t(o){ if(o==null) return ''; if(typeof o==='string') return o; return o[lang()] ?? o.ja ?? o.en ?? ''; }
var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- shared UI strings ---------- */
var UI = {
  close:{ja:'閉じる',en:'Close'},
  restart:{ja:'最初から再生',en:'Restart'},
  play:{ja:'再生',en:'Play'},
  pause:{ja:'一時停止',en:'Pause'},
  back:{ja:'一覧へ戻る',en:'Back to list'},
  tryLab:{ja:'実験室で試す',en:'Try in the Lab'},
  seeDemo:{ja:'デモを見る',en:'View demo'},
  toLab:{ja:'注意事項を確認して実験室へ',en:'Review safety notes & enter the Lab'},
  materials:{ja:'使用物質',en:'Materials'},
  equation:{ja:'反応式',en:'Reaction'},
  observe:{ja:'観察ポイント',en:'What to observe'},
  notes:{ja:'注意事項',en:'Notes'},
  consentBody:{ja:'実際のミッションに挑戦するには、注意事項および免責事項への同意が必要です。',
               en:'To take on the actual missions, you must first accept the safety notes and disclaimer.'},
  consentPrompt:{ja:'実験を開始するには、注意事項および免責事項をご確認のうえ、同意してください。',
                 en:'To begin an experiment, please review and accept the safety notes and disclaimer.'},
  viewOnly:{ja:'閲覧専用デモ',en:'View-only demo'},
  near:{ja:'中和点付近',en:'Near equivalence point'},
  pH:{ja:'pH',en:'pH'},
  temp:{ja:'温度',en:'Temp.'},
  gas:{ja:'気体発生量',en:'Gas evolved'},
  turbidity:{ja:'濁り',en:'Turbidity'},
  progress:{ja:'進行',en:'Progress'},
  selectMetal:{ja:'金属イオンを選ぶ',en:'Select a metal ion'},
  flameColor:{ja:'炎の色',en:'Flame colour'}
};
var CAT = {
  measure:{ja:'測定',en:'Measure'},
  mission:{ja:'ミッション',en:'Mission'},
  demo:{ja:'反応デモ',en:'Reaction demo'},
  color:{ja:'色の変化',en:'Colour change'},
  gasc:{ja:'気体の発生',en:'Gas evolution'},
  precipc:{ja:'沈殿の生成',en:'Precipitate'},
  flamec:{ja:'炎色反応',en:'Flame test'},
  indic:{ja:'指示薬の変化',en:'Indicator change'}
};
var DIFF = { beginner:{ja:'初級',en:'Beginner'}, intermediate:{ja:'中級',en:'Intermediate'}, advanced:{ja:'上級',en:'Advanced'} };

function dangerBadge(lv){
  var m={1:['安全','Safe'],2:['注意','Caution'],3:['中程度','Moderate'],4:['高','High'],5:['非常に高い','Very high']};
  var ja=lang()==='ja'; var txt=(ja?'危険度：':'Hazard: ')+m[lv][ja?0:1];
  return '<span class="badge-danger lv'+lv+'">⚠ '+txt+'</span>';
}
function esc(s){ return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }

/* ---------- colour utils ---------- */
function rgb(a,al){ return 'rgba('+a[0]+','+a[1]+','+a[2]+','+(al==null?1:al)+')'; }
function lerp(a,b,x){ return [a[0]+(b[0]-a[0])*x, a[1]+(b[1]-a[1])*x, a[2]+(b[2]-a[2])*x].map(Math.round); }
function ph2btb(ph){ // BTB: yellow(acid) -> green(neutral) -> blue(base)
  var Y=[222,201,66],G=[116,196,96],B=[70,122,214];
  if(ph<=6) return Y;
  if(ph<7) return lerp(Y,G,(ph-6));
  if(ph<7.6) return lerp(G,G,0);
  if(ph<9) return lerp(G,B,(ph-7.6)/1.4);
  return B;
}

/* ============================================================
   DEMO CATALOG  (chemistry drawn from the lab's own dataset)
   ============================================================ */
var D = {
  /* ---- MEASURE: neutralization titration ---- */
  neutralize:{ cat:'measure',
    name:{ja:'中和反応を測定する',en:'Measuring a Neutralization Reaction'},
    sub:'Measuring a Neutralization Reaction',
    danger:1,
    desc:{ja:'酸性の水溶液に塩基性の水溶液を少しずつ滴下しながら、pHと温度の変化を観察する自動デモです。操作はできません。',
          en:'A base is added drop by drop to an acidic solution while pH and temperature are tracked. This plays automatically and cannot be operated.'},
    eq:'H⁺ + OH⁻ → H₂O',
    materials:{ja:'塩酸（酸性）／水酸化ナトリウム水溶液（塩基性）／BTB溶液',en:'Hydrochloric acid / sodium hydroxide solution / BTB indicator'},
    obs:{ja:['pHが酸性→中性付近→塩基性へ連続的に変化する','中和点付近で温度がわずかに上昇する（発熱）','BTBが黄→緑→青へ段階的に変化する'],
         en:['pH shifts continuously from acidic through near-neutral to basic','Temperature rises slightly near the equivalence point (exothermic)','BTB changes yellow → green → blue in stages']},
    notes:{ja:'発熱は誇張していません。中和点とpH7は必ずしも一致しません（今回は強酸＋強塩基のため近い値です）。',
           en:'The temperature change is not exaggerated. The equivalence point is not always exactly pH 7 (here it is close, as both are strong).'},
    stage:{type:'titration',duration:15000,loop:true} },

  /* ---- Missions: beginner ---- */
  m_h2:{ cat:'mission', name:{ja:'水素を発生させる',en:'Generate hydrogen gas'}, danger:2,
    desc:{ja:'亜鉛に希塩酸を加えると水素が発生する様子を観察します。',en:'Zinc reacts with dilute hydrochloric acid to release hydrogen gas.'},
    eq:'Zn + 2HCl → ZnCl₂ + H₂↑',
    materials:{ja:'亜鉛／希塩酸',en:'Zinc / dilute hydrochloric acid'},
    obs:{ja:['金属表面から泡が連続して発生','発生する気体は水素（無色・可燃性）','溶液に亜鉛が溶けていく'],
         en:['Bubbles form steadily on the metal surface','The gas is hydrogen (colourless, flammable)','The zinc gradually dissolves']},
    notes:{ja:'水素は可燃性のため、実際には火気を近づけません。',en:'Hydrogen is flammable — keep flames away in reality.'},
    stage:{type:'gas',duration:12000,loop:true, liquid:[150,175,200], gasName:{ja:'水素 H₂',en:'Hydrogen H₂'}, prop:{ja:'無色・可燃性',en:'Colourless, flammable'}, rate:1.0} },
  m_whiteppt:{ cat:'mission', name:{ja:'白い沈殿を作る',en:'Make a white precipitate'}, danger:1,
    desc:{ja:'硝酸銀水溶液と塩化ナトリウム水溶液を混ぜ、白色沈殿ができる様子を観察します。',en:'Mixing silver nitrate and sodium chloride solutions forms a white precipitate.'},
    eq:'Ag⁺ + Cl⁻ → AgCl↓',
    materials:{ja:'硝酸銀水溶液／塩化ナトリウム水溶液',en:'Silver nitrate solution / sodium chloride solution'},
    obs:{ja:['2つの無色の液が混ざる','白く濁りはじめる','塩化銀の白色沈殿が沈む'],
         en:['Two colourless solutions mix','The mixture turns cloudy white','A white silver-chloride precipitate settles']},
    notes:{ja:'塩化銀は光で徐々に変色します（本デモでは省略）。',en:'Silver chloride slowly darkens in light (omitted here).'},
    stage:{type:'precip',duration:11000,loop:true, sol:[150,175,200], precip:[235,238,242]} },
  m_indi:{ cat:'mission', name:{ja:'指示薬の色を変える',en:'Change the indicator colour'}, danger:1,
    desc:{ja:'酸性・中性・塩基性でBTB溶液の色がどう変わるかを観察します。',en:'See how BTB indicator colour differs in acidic, neutral and basic solutions.'},
    eq:'BTB: pH<6 黄 / 中性 緑 / pH>7.6 青',
    materials:{ja:'BTB溶液／酸性・中性・塩基性の各溶液',en:'BTB indicator / acidic, neutral and basic solutions'},
    obs:{ja:['酸性で黄色','中性付近で緑色','塩基性で青色'],en:['Yellow in acid','Green near neutral','Blue in base']},
    notes:{ja:'色は指示薬の変色域に基づく簡略表現です。',en:'Colours are a simplified representation of the indicator range.'},
    stage:{type:'indicator',duration:12000,loop:true, ind:'BTB'} },

  /* ---- Missions: intermediate ---- */
  m_neutral:{ cat:'mission', name:{ja:'中和点を見つける',en:'Find the equivalence point'}, danger:1,
    desc:{ja:'pHの変化を測定し、中和点付近を確認します。',en:'Track pH to locate the equivalence point.'},
    eq:'H⁺ + OH⁻ → H₂O',
    materials:{ja:'塩酸／水酸化ナトリウム水溶液／BTB',en:'Hydrochloric acid / sodium hydroxide / BTB'},
    obs:{ja:['pHが急に変化する点が中和点付近','その付近で温度がわずかに上昇','指示薬が緑を通過する'],
         en:['The sharp pH change marks the equivalence region','Temperature rises slightly there','The indicator passes through green']},
    notes:{ja:'中和点とpH7は常に同じではありません。',en:'The equivalence point is not always pH 7.'},
    stage:{type:'titration',duration:15000,loop:true} },
  m_deposit:{ cat:'mission', name:{ja:'金属を析出させる',en:'Deposit a metal'}, danger:1,
    desc:{ja:'硫酸銅水溶液に亜鉛を入れると、銅が析出する様子を観察します。',en:'Zinc placed in copper(II) sulfate solution displaces copper metal.'},
    eq:'Zn + Cu²⁺ → Zn²⁺ + Cu↓',
    materials:{ja:'亜鉛／硫酸銅(II)水溶液',en:'Zinc / copper(II) sulfate solution'},
    obs:{ja:['青色の溶液の色が徐々に薄くなる','金属表面に赤褐色の銅が析出','イオン化傾向 Zn > Cu'],
         en:['The blue solution gradually fades','Red-brown copper deposits on the metal','Ionisation tendency: Zn > Cu']},
    notes:{ja:'色の変化と析出は理解しやすいよう簡略化しています。',en:'Colour change and deposition are simplified for clarity.'},
    stage:{type:'precip',duration:13000,loop:true, sol:[46,120,205], solTo:[150,175,200], precip:[176,96,56]} },
  m_yellowppt:{ cat:'mission', name:{ja:'黄色い沈殿を作る',en:'Make a yellow precipitate'}, danger:2,
    desc:{ja:'鉛(II)イオンとヨウ化物イオンから、鮮やかな黄色沈殿ができる様子を観察します。',en:'Lead(II) and iodide ions form a vivid yellow precipitate.'},
    eq:'Pb²⁺ + 2I⁻ → PbI₂↓',
    materials:{ja:'硝酸鉛(II)水溶液／ヨウ化カリウム水溶液',en:'Lead(II) nitrate solution / potassium iodide solution'},
    obs:{ja:['2つの無色の液が混ざる','鮮やかな黄色に濁る','ヨウ化鉛の黄色沈殿が沈む'],
         en:['Two colourless solutions mix','A vivid yellow cloudiness forms','A yellow lead-iodide precipitate settles']},
    notes:{ja:'鉛化合物は有毒です。デモは閲覧専用です。',en:'Lead compounds are toxic. This is a view-only demo.'},
    stage:{type:'precip',duration:11000,loop:true, sol:[150,175,200], precip:[232,204,72]} },

  /* ---- Missions: advanced ---- */
  m_dangergas:{ cat:'mission', name:{ja:'危険な気体を判別する',en:'Identify a hazardous gas'}, danger:5,
    desc:{ja:'塩素ガスの発生を例に、警告表示と安全な対応を確認します。閲覧専用です。',en:'Using chlorine generation, review the warning display and safe handling. View-only.'},
    eq:'ClO⁻ + 2H⁺ + Cl⁻ → Cl₂↑',
    materials:{ja:'塩素系漂白剤（次亜塩素酸ナトリウム）／塩酸',en:'Chlorine bleach (sodium hypochlorite) / hydrochloric acid'},
    obs:{ja:['淡黄緑色の気体が発生','刺激臭があり有毒','必ず換気装置内で扱う'],
         en:['A pale yellow-green gas forms','Pungent and toxic','Must be handled inside a fume hood']},
    notes:{ja:'家庭で「まぜるな危険」の代表例。実際に混ぜてはいけません。',en:'A classic "never mix" hazard. Never combine these in reality.'},
    stage:{type:'gas',duration:12000,loop:true, liquid:[150,175,200], gasName:{ja:'塩素 Cl₂',en:'Chlorine Cl₂'}, prop:{ja:'淡黄緑色・有毒',en:'Pale yellow-green, toxic'}, rate:0.7, gasColor:[150,190,90], danger:true} },
  m_exo:{ cat:'mission', name:{ja:'発熱反応を安全に観察する',en:'Observe an exothermic reaction safely'}, danger:1,
    desc:{ja:'中和反応の温度変化を測定し、急な発熱を避ける考え方を学びます。',en:'Track the temperature of a neutralization and learn to avoid sudden heat release.'},
    eq:'H⁺ + OH⁻ → H₂O   (ΔH < 0)',
    materials:{ja:'塩酸／水酸化ナトリウム水溶液',en:'Hydrochloric acid / sodium hydroxide solution'},
    obs:{ja:['中和が進むと温度が上昇','中和点付近で温度が最大','少量ずつ加えると急な発熱を防げる'],
         en:['Temperature rises as neutralization proceeds','It peaks near the equivalence point','Adding small amounts avoids sudden heating']},
    notes:{ja:'温度変化は控えめに表現しています。',en:'The temperature change is shown modestly.'},
    stage:{type:'titration',duration:15000,loop:true, tempFocus:true} },
  m_redox:{ cat:'mission', name:{ja:'酸化還元反応を完成させる',en:'Complete a redox reaction'}, danger:2,
    desc:{ja:'過マンガン酸カリウムが還元され、紫色が消える酸化還元反応を観察します。',en:'Permanganate is reduced and its purple colour disappears.'},
    eq:'2MnO₄⁻ + 5H₂O₂ + 6H⁺ → 2Mn²⁺ + 5O₂↑ + 8H₂O',
    materials:{ja:'過マンガン酸カリウム／過酸化水素水／希硫酸',en:'Potassium permanganate / hydrogen peroxide / dilute sulfuric acid'},
    obs:{ja:['濃い紫色から徐々に色が消える','酸素の泡が発生','MnO₄⁻が還元されてMn²⁺に'],
         en:['The deep purple colour gradually fades','Oxygen bubbles form','MnO₄⁻ is reduced to Mn²⁺']},
    notes:{ja:'色が消える＝還元の進行を示す指標です。',en:'The fading colour indicates the progress of reduction.'},
    stage:{type:'colorchange',duration:12000,loop:true, from:[140,40,150], to:[228,224,234], fizz:true} },

  /* ---- Reaction demos (extra) ---- */
  starch_iodine:{ cat:'demo', name:{ja:'ヨウ素デンプン反応',en:'Starch–iodine test'}, danger:1,
    desc:{ja:'ヨウ素溶液がデンプンと出会うと、青紫色に呈色します。',en:'Iodine solution turns deep blue-violet in the presence of starch.'},
    eq:'デンプン + I₂ → ヨウ素デンプン（青紫）',
    materials:{ja:'ヨウ素溶液／デンプン水溶液',en:'Iodine solution / starch solution'},
    obs:{ja:['薄い褐色の液が加わる','急に濃い青紫色に呈色','デンプン検出の指示反応'],
         en:['A pale brown solution is added','It rapidly turns deep blue-violet','Used to detect starch']},
    notes:{ja:'包接化合物による呈色で、加熱すると色が消えます。',en:'Colour comes from an inclusion compound and fades on heating.'},
    stage:{type:'colorchange',duration:9000,loop:true, from:[210,225,225], to:[34,28,92], drip:true} },
  h2o2_o2:{ cat:'demo', name:{ja:'過酸化水素の分解（触媒）',en:'Decomposition of H₂O₂ (catalyst)'}, danger:1,
    desc:{ja:'二酸化マンガンを触媒として、過酸化水素が分解し酸素を発生します。',en:'With manganese dioxide as a catalyst, hydrogen peroxide decomposes to release oxygen.'},
    eq:'2H₂O₂ →(MnO₂) 2H₂O + O₂↑',
    materials:{ja:'過酸化水素水／二酸化マンガン（触媒）',en:'Hydrogen peroxide / manganese dioxide (catalyst)'},
    obs:{ja:['触媒を加えると急に発泡','発生する気体は酸素','MnO₂は消費されない（触媒）'],
         en:['Bubbling starts as the catalyst is added','The gas is oxygen','MnO₂ is not consumed (catalyst)']},
    notes:{ja:'触媒は反応を速めるだけで、自身は変化しません。',en:'A catalyst only speeds the reaction; it is not used up.'},
    stage:{type:'gas',duration:11000,loop:true, liquid:[150,175,200], gasName:{ja:'酸素 O₂',en:'Oxygen O₂'}, prop:{ja:'無色・助燃性',en:'Colourless, supports combustion'}, rate:1.2} },
  agcl:{ cat:'demo', name:{ja:'塩化銀の白色沈殿',en:'Silver chloride precipitate'}, danger:1,
    desc:{ja:'銀イオンと塩化物イオンから白色の塩化銀が沈殿します。',en:'Silver and chloride ions form a white silver-chloride precipitate.'},
    eq:'Ag⁺ + Cl⁻ → AgCl↓',
    materials:{ja:'硝酸銀水溶液／塩化ナトリウム水溶液',en:'Silver nitrate solution / sodium chloride solution'},
    obs:{ja:['無色の液が混ざる','白く濁る','塩化物イオンの検出に使う'],
         en:['Colourless solutions mix','It turns cloudy white','Used to detect chloride ions']},
    notes:{ja:'塩化物イオンの定性検出に用いられます。',en:'Used for the qualitative detection of chloride ions.'},
    stage:{type:'precip',duration:10000,loop:true, sol:[150,175,200], precip:[235,238,242]} },
  displace:{ cat:'demo', name:{ja:'金属の析出（置換）',en:'Metal displacement'}, danger:1,
    desc:{ja:'鉄を硫酸銅水溶液に入れると、銅が析出し溶液の青色が薄まります。',en:'Iron placed in copper sulfate solution displaces copper; the blue colour fades.'},
    eq:'Fe + Cu²⁺ → Fe²⁺ + Cu↓',
    materials:{ja:'鉄／硫酸銅(II)水溶液',en:'Iron / copper(II) sulfate solution'},
    obs:{ja:['青色が徐々に薄くなる','赤褐色の銅が析出','イオン化傾向 Fe > Cu'],
         en:['The blue colour gradually fades','Red-brown copper is deposited','Ionisation tendency: Fe > Cu']},
    notes:{ja:'イオン化傾向の大小で置換の向きが決まります。',en:'The direction of displacement depends on ionisation tendency.'},
    stage:{type:'precip',duration:13000,loop:true, sol:[46,120,205], solTo:[150,180,190], precip:[176,96,56]} },
  s_combust:{ cat:'demo', name:{ja:'硫黄の燃焼',en:'Sulfur combustion'}, danger:3,
    desc:{ja:'硫黄が青い炎を上げて燃え、二酸化硫黄を発生します。閲覧専用です。',en:'Sulfur burns with a blue flame, producing sulfur dioxide. View-only.'},
    eq:'S + O₂ → SO₂↑',
    materials:{ja:'硫黄／酸素（空気）',en:'Sulfur / oxygen (air)'},
    obs:{ja:['青い炎を上げて燃える','刺激臭のあるSO₂が発生','必ず換気装置内で行う'],
         en:['Burns with a blue flame','Produces pungent SO₂','Must be done inside a fume hood']},
    notes:{ja:'これは燃焼であり、炎色反応ではありません。SO₂は有毒です。',en:'This is combustion, not a flame test. SO₂ is toxic.'},
    stage:{type:'combustion',duration:12000,loop:true, flame:[120,150,255], gasName:{ja:'二酸化硫黄 SO₂',en:'Sulfur dioxide SO₂'}, danger:true} },
  amalgam:{ cat:'demo', name:{ja:'アルミニウムアマルガム',en:'Aluminium amalgam'}, danger:5,
    desc:{ja:'水銀がアルミの酸化被膜を壊し、露出したアルミが酸化して白い髭が成長します。閲覧専用です。',en:'Mercury breaks aluminium\u2019s oxide film; the exposed metal oxidises and white "whiskers" grow. View-only.'},
    eq:'4Al + 3O₂ → 2Al₂O₃ (+ 熱)',
    materials:{ja:'アルミニウム／微量の水銀',en:'Aluminium / a trace of mercury'},
    obs:{ja:['表面から白い酸化物の髭が成長','わずかに発熱','水銀は極めて有毒'],
         en:['White oxide whiskers grow from the surface','Slight heat is released','Mercury is extremely toxic']},
    notes:{ja:'水銀は有毒で規制対象です。絶対に実際に試さないでください。',en:'Mercury is toxic and regulated. Never attempt this in reality.'},
    stage:{type:'amalgam',duration:13000,loop:true} },

  /* ---- Phenomena: colour ---- */
  ph_kmno4:{ cat:'color', name:{ja:'過マンガン酸カリウムの色の変化',en:'Permanganate colour change'}, danger:2,
    desc:{ja:'濃い紫色の過マンガン酸カリウムが還元され、色が消えていきます。',en:'Deep purple permanganate is reduced and its colour disappears.'},
    eq:'2MnO₄⁻ + 5H₂O₂ + 6H⁺ → 2Mn²⁺ + 5O₂↑ + 8H₂O',
    materials:{ja:'過マンガン酸カリウム／過酸化水素水',en:'Potassium permanganate / hydrogen peroxide'},
    obs:{ja:['濃い紫色','徐々に無色へ','MnO₄⁻ → Mn²⁺'],en:['Deep purple','Fades to colourless','MnO₄⁻ → Mn²⁺']},
    notes:{ja:'紫色が消えることが反応の進行を示します。',en:'The fading purple shows the reaction proceeding.'},
    stage:{type:'colorchange',duration:11000,loop:true, from:[140,40,150], to:[228,224,234], fizz:true} },
  ph_cu:{ cat:'color', name:{ja:'銅イオンの青い溶液',en:'Blue copper(II) solution'}, danger:1,
    desc:{ja:'硫酸銅が水に溶け、銅(II)イオンによる青色があらわれます。',en:'Copper sulfate dissolves, revealing the blue colour of copper(II) ions.'},
    eq:'CuSO₄ → Cu²⁺ + SO₄²⁻（青色）',
    materials:{ja:'硫酸銅(II)／水',en:'Copper(II) sulfate / water'},
    obs:{ja:['無色の水に固体が溶ける','鮮やかな青色に色づく','Cu²⁺による色'],en:['A solid dissolves in colourless water','A vivid blue colour develops','Colour due to Cu²⁺']},
    notes:{ja:'色の濃さは濃度に依存します。',en:'The intensity depends on concentration.'},
    stage:{type:'colorchange',duration:9000,loop:true, from:[210,222,228], to:[42,118,205]} },

  /* ---- Phenomena: gas ---- */
  gas_h2:{ cat:'gasc', name:{ja:'水素の発生',en:'Hydrogen evolution'}, danger:2,
    desc:{ja:'亜鉛と希塩酸から水素が発生します。',en:'Zinc and dilute hydrochloric acid release hydrogen.'},
    eq:'Zn + 2HCl → ZnCl₂ + H₂↑',
    materials:{ja:'亜鉛／希塩酸',en:'Zinc / dilute hydrochloric acid'},
    obs:{ja:['金属から泡が発生','水素（無色・可燃性）','火気厳禁'],en:['Bubbles from the metal','Hydrogen (colourless, flammable)','Keep away from flames']},
    notes:{ja:'水素は可燃性です。',en:'Hydrogen is flammable.'},
    stage:{type:'gas',duration:12000,loop:true, liquid:[150,175,200], gasName:{ja:'水素 H₂',en:'Hydrogen H₂'}, prop:{ja:'無色・可燃性',en:'Colourless, flammable'}, rate:1.0} },
  gas_o2:{ cat:'gasc', name:{ja:'酸素の発生',en:'Oxygen evolution'}, danger:1,
    desc:{ja:'過酸化水素が分解して酸素を発生します。',en:'Hydrogen peroxide decomposes to release oxygen.'},
    eq:'2H₂O₂ →(MnO₂) 2H₂O + O₂↑',
    materials:{ja:'過酸化水素水／二酸化マンガン',en:'Hydrogen peroxide / manganese dioxide'},
    obs:{ja:['触媒で急に発泡','酸素（無色・助燃性）','線香が激しく燃える'],en:['Rapid bubbling with catalyst','Oxygen (colourless, supports combustion)','Rekindles a glowing splint']},
    notes:{ja:'酸素はものを燃えやすくします。',en:'Oxygen makes things burn more readily.'},
    stage:{type:'gas',duration:11000,loop:true, liquid:[150,175,200], gasName:{ja:'酸素 O₂',en:'Oxygen O₂'}, prop:{ja:'無色・助燃性',en:'Colourless, supports combustion'}, rate:1.2} },
  gas_co2:{ cat:'gasc', name:{ja:'二酸化炭素の発生',en:'Carbon dioxide evolution'}, danger:1,
    desc:{ja:'炭酸カルシウムに塩酸を加えると二酸化炭素が発生します。',en:'Calcium carbonate and hydrochloric acid release carbon dioxide.'},
    eq:'CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O',
    materials:{ja:'炭酸カルシウム／希塩酸',en:'Calcium carbonate / dilute hydrochloric acid'},
    obs:{ja:['固体から発泡','二酸化炭素（無色）','石灰水を白濁させる'],en:['Bubbling from the solid','Carbon dioxide (colourless)','Turns limewater cloudy']},
    notes:{ja:'CO₂は石灰水の白濁で検出できます。',en:'CO₂ is detected by cloudy limewater.'},
    stage:{type:'gas',duration:11000,loop:true, liquid:[150,175,200], gasName:{ja:'二酸化炭素 CO₂',en:'Carbon dioxide CO₂'}, prop:{ja:'無色・水に溶ける',en:'Colourless, water-soluble'}, rate:0.9} },

  /* ---- Phenomena: precipitate ---- */
  pp_agcl:{ cat:'precipc', name:{ja:'塩化銀の白色沈殿',en:'White silver chloride'}, danger:1,
    desc:{ja:'銀イオンと塩化物イオンから白色沈殿ができます。',en:'Silver and chloride ions form a white precipitate.'},
    eq:'Ag⁺ + Cl⁻ → AgCl↓',
    materials:{ja:'硝酸銀水溶液／塩化ナトリウム水溶液',en:'Silver nitrate / sodium chloride'},
    obs:{ja:['白く濁る','細かい粒子が生成','一部が底に沈む'],en:['Turns cloudy white','Fine particles form','Some settles to the bottom']},
    notes:{ja:'塩化物イオンの検出に使われます。',en:'Used to detect chloride ions.'},
    stage:{type:'precip',duration:10000,loop:true, sol:[150,175,200], precip:[235,238,242]} },
  pp_pbi2:{ cat:'precipc', name:{ja:'ヨウ化鉛の黄色沈殿',en:'Yellow lead iodide'}, danger:2,
    desc:{ja:'鉛(II)イオンとヨウ化物イオンから黄色沈殿ができます。',en:'Lead(II) and iodide ions form a yellow precipitate.'},
    eq:'Pb²⁺ + 2I⁻ → PbI₂↓',
    materials:{ja:'硝酸鉛(II)水溶液／ヨウ化カリウム水溶液',en:'Lead(II) nitrate / potassium iodide'},
    obs:{ja:['鮮やかな黄色に濁る','黄色い粒子が生成','ゆっくり沈む'],en:['Vivid yellow cloudiness','Yellow particles form','Settle slowly']},
    notes:{ja:'鉛化合物は有毒です。',en:'Lead compounds are toxic.'},
    stage:{type:'precip',duration:11000,loop:true, sol:[150,175,200], precip:[232,204,72]} },
  pp_caco3:{ cat:'precipc', name:{ja:'炭酸カルシウムの白濁',en:'Calcium carbonate turbidity'}, danger:1,
    desc:{ja:'石灰水に二酸化炭素を通すと白く濁ります。',en:'Bubbling carbon dioxide into limewater turns it cloudy.'},
    eq:'CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O',
    materials:{ja:'石灰水／二酸化炭素',en:'Limewater / carbon dioxide'},
    obs:{ja:['透明な液が白く濁る','炭酸カルシウムが生成','CO₂の検出に使う'],en:['Clear liquid turns cloudy','Calcium carbonate forms','Used to detect CO₂']},
    notes:{ja:'過剰のCO₂では再び澄むことがあります（本デモでは省略）。',en:'Excess CO₂ can re-dissolve it (omitted here).'},
    stage:{type:'precip',duration:10000,loop:true, sol:[190,205,215], precip:[236,240,245]} },

  /* ---- Phenomena: indicators ---- */
  in_btb:{ cat:'indic', name:{ja:'BTB溶液',en:'BTB solution'}, danger:1,
    desc:{ja:'酸性・中性・塩基性でBTBの色が変化します。',en:'BTB changes colour across acidic, neutral and basic ranges.'},
    eq:'酸性 黄 / 中性 緑 / 塩基性 青',
    materials:{ja:'BTB溶液',en:'BTB indicator'},
    obs:{ja:['酸性：黄色','中性：緑色','塩基性：青色'],en:['Acid: yellow','Neutral: green','Base: blue']},
    notes:{ja:'変色域はpH6〜7.6付近です。',en:'Its range is around pH 6–7.6.'},
    stage:{type:'indicator',duration:12000,loop:true, ind:'BTB'} },
  in_pp:{ cat:'indic', name:{ja:'フェノールフタレイン',en:'Phenolphthalein'}, danger:1,
    desc:{ja:'酸性・中性では無色、塩基性で赤紫色になります。',en:'Colourless in acid and neutral, magenta-pink in base.'},
    eq:'pH<8.2 無色 / pH>8.2 赤紫',
    materials:{ja:'フェノールフタレイン溶液',en:'Phenolphthalein solution'},
    obs:{ja:['酸性：無色','中性：無色','塩基性：赤紫色'],en:['Acid: colourless','Neutral: colourless','Base: magenta-pink']},
    notes:{ja:'塩基性の検出によく使われます。',en:'Commonly used to detect basic solutions.'},
    stage:{type:'indicator',duration:12000,loop:true, ind:'PP'} },
  in_mo:{ cat:'indic', name:{ja:'メチルオレンジ',en:'Methyl orange'}, danger:1,
    desc:{ja:'酸性で赤、中性で橙、塩基性で黄色になります。',en:'Red in acid, orange near neutral, yellow in base.'},
    eq:'pH<3.1 赤 / 3.1〜4.4 橙 / pH>4.4 黄',
    materials:{ja:'メチルオレンジ溶液',en:'Methyl orange solution'},
    obs:{ja:['酸性：赤色','中間：橙色','塩基性：黄色'],en:['Acid: red','Middle: orange','Base: yellow']},
    notes:{ja:'変色域は酸性側（pH3.1〜4.4）です。',en:'Its range is on the acidic side (pH 3.1–4.4).'},
    stage:{type:'indicator',duration:12000,loop:true, ind:'MO'} },
  in_litmus:{ cat:'indic', name:{ja:'リトマス',en:'Litmus'}, danger:1,
    desc:{ja:'酸性で赤、塩基性で青になります。',en:'Red in acid, blue in base.'},
    eq:'酸性 赤 / 塩基性 青',
    materials:{ja:'リトマス溶液',en:'Litmus solution'},
    obs:{ja:['酸性：赤色','中性：紫色','塩基性：青色'],en:['Acid: red','Neutral: purple','Base: blue']},
    notes:{ja:'酸・塩基の大まかな判定に使われます。',en:'Used for a rough acid/base test.'},
    stage:{type:'indicator',duration:12000,loop:true, ind:'LITMUS'} }
};

/* indicator colour tables */
var IND = {
  BTB:{ acid:[222,201,66], neutral:[116,196,96], base:[70,122,214], pa:3, pn:7, pb:11 },
  PP:{ acid:[232,233,236], neutral:[232,233,236], base:[224,90,170], pa:3, pn:7, pb:11 },
  MO:{ acid:[214,84,58], neutral:[234,150,58], base:[232,198,82], pa:2, pn:4, pb:9 },
  LITMUS:{ acid:[210,80,70], neutral:[150,110,160], base:[70,112,200], pa:3, pn:7, pb:11 }
};

/* difficulty groups & lists */
var MISSION_GROUPS = [
  { diff:'beginner',     ids:['m_h2','m_whiteppt','m_indi'] },
  { diff:'intermediate', ids:['m_neutral','m_deposit','m_yellowppt'] },
  { diff:'advanced',     ids:['m_dangergas','m_exo','m_redox'] }
];
var DEMO_LIST = ['neutralize','starch_iodine','h2o2_o2','agcl','displace','s_combust','ph_kmno4','amalgam'];
var PHENOM = {
  color:['starch_iodine','ph_kmno4','ph_cu'],
  gas:['gas_h2','gas_o2','gas_co2'],
  precip:['pp_agcl','pp_pbi2','pp_caco3'],
  indicator:['in_btb','in_pp','in_mo','in_litmus']
};
var PHENOM_CAT = { color:'color', gas:'gasc', precip:'precipc', indicator:'indic' };

/* ============================================================
   CANVAS STAGE ENGINE
   ============================================================ */
var BK=new Image(); BK.src='assets/beaker.png'; var BKok=false; BK.onload=function(){BKok=true;};
function makeStage(vis, info, def){
  var W=380, H=408, dpr=Math.min(2, window.devicePixelRatio||1);
  var cv=document.createElement('canvas');
  cv.width=W*dpr; cv.height=H*dpr; cv.style.aspectRatio=W+' / '+H;
  vis.appendChild(cv);
  var ctx=cv.getContext('2d'); ctx.scale(dpr,dpr);
  var AR=1211/1299, dw,dh; if(W/H>AR){dh=H;dw=H*AR;}else{dw=W;dh=W/AR;}
  var _ox=(W-dw)/2, _oy=(H-dh)/2;
  var GEO={ ox:_ox, oy:_oy, dw:dw, dh:dh, left:_ox+dw*0.205, right:_ox+dw*0.835, cx:_ox+dw*0.52, floor:_oy+dh*0.885, fillMax:_oy+dh*0.33 };
  var flag=vis.querySelector('.stage-flag');
  var raf=null, start=null, paused=false, pauseStamp=0, offset=0, done=false;
  var bubbles=[], parts=[], fumes=[];
  var meters={}, sparks={};
  var dur=def.duration||12000;
  var metalIdx=0, metalT=0; // flame
  var reduced=RM;

  /* build info-panel meters based on type */
  function meter(key, label, colorFn){
    var wrap=document.createElement('div'); wrap.className='meter';
    wrap.innerHTML='<div class="mlabel"><span>'+esc(label)+'</span><b data-v>—</b></div><div class="track"><div class="fill"></div></div>';
    info.appendChild(wrap);
    meters[key]={ v:wrap.querySelector('[data-v]'), fill:wrap.querySelector('.fill'), color:colorFn };
  }
  function spark(key,label){
    var wrap=document.createElement('div'); wrap.className='meter';
    wrap.innerHTML='<div class="mlabel"><span>'+esc(label)+'</span></div>';
    var s=document.createElement('canvas'); s.className='spark'; s.width=300; s.height=60; wrap.appendChild(s);
    info.appendChild(wrap);
    sparks[key]={ cv:s, ctx:s.getContext('2d'), data:[] };
  }
  function readout(html){ var d=document.createElement('div'); d.className='meter'; d.innerHTML=html; info.appendChild(d); return d; }

  var T=def; var type=T.type;
  if(type==='titration'){ meter('ph',t(UI.pH),function(){return '#5aa2ff';}); meter('temp',t(UI.temp),function(){return '#ffb27a';}); spark('ph',t(UI.pH)+' (0–14)'); spark('temp',t(UI.temp)+' (°C)'); }
  else if(type==='gas'||type==='combustion'){ meter('gas',t(UI.gas),function(){return '#3fd9c8';});
    readout('<div class="mlabel"><span>'+esc(t(T.gasName||{ja:'気体',en:'Gas'}))+'</span></div>'+(T.prop?'<div class="note-txt" style="margin-top:2px">'+esc(t(T.prop))+'</div>':''));
    if(T.danger) readout('<div class="warn-label">⚠ '+esc(lang()==='ja'?'有毒・危険な気体。換気必須。':'Toxic / hazardous gas. Ventilation required.')+'</div>'); }
  else if(type==='precip'||type==='amalgam'){ meter('turb',t(UI.turbidity),function(){return '#cfd8e2';}); if(type==='amalgam') readout('<div class="warn-label">⚠ '+esc(lang()==='ja'?'水銀は有毒。閲覧専用。':'Mercury is toxic. View-only.')+'</div>'); }
  else if(type==='colorchange'){ meter('prog',t(UI.progress),function(){return '#a879ff';}); }
  else if(type==='indicator'){ meter('ph',t(UI.pH),function(){return '#5aa2ff';}); }
  else if(type==='flame'){ buildFlameControls(); }

  function buildFlameControls(){
    var wrap=document.createElement('div'); wrap.className='meter';
    wrap.innerHTML='<div class="mlabel"><span>'+esc(t(UI.selectMetal))+'</span></div>';
    var row=document.createElement('div'); row.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin-top:4px';
    T.metals.forEach(function(m,i){
      var b=document.createElement('button'); b.className='dbtn'; b.style.cssText='padding:8px 12px;font-size:12.5px';
      b.textContent=m.sym+' · '+t({ja:m.ja,en:m.en});
      b.addEventListener('click',function(){ metalIdx=i; metalT=0; updateFlameLabel(); });
      row.appendChild(b);
    });
    wrap.appendChild(row); info.appendChild(wrap);
    flameLabel=readout('');
    updateFlameLabel();
  }
  var flameLabel;
  function updateFlameLabel(){
    if(!flameLabel) return; var m=T.metals[metalIdx];
    flameLabel.innerHTML='<div class="mlabel"><span>'+esc(t(UI.flameColor))+'</span><b data-v>'+esc(t({ja:m.ja,en:m.en}))+'</b></div>'+
      '<div class="note-txt" style="margin-top:2px"><span style="display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:middle;margin-right:6px;background:'+rgb(m.color)+'"></span>'+esc(t({ja:m.cja,en:m.cen}))+'</div>';
  }

  /* ---------- drawing primitives ---------- */
  function clearBG(){ ctx.clearRect(0,0,W,H); ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H); }
  function beaker(fill, level, opts){
    opts=opts||{};
    var g=GEO, bw=g.right-g.left, cx=g.cx, floor=g.floor;
    var lvY=floor-level*(floor-g.fillMax);
    // base glass photo (black bg blends with #000 stage)
    if(BKok) ctx.drawImage(BK, g.ox, g.oy, g.dw, g.dh);
    // liquid + contents, clipped to the glass interior
    ctx.save();
    ctx.beginPath();
    var r=bw*0.11, topClip=g.oy+g.dh*0.15;
    ctx.moveTo(g.left, topClip);
    ctx.lineTo(g.left, floor-r);
    ctx.quadraticCurveTo(g.left, floor, g.left+r, floor);
    ctx.lineTo(g.right-r, floor);
    ctx.quadraticCurveTo(g.right, floor, g.right, floor-r);
    ctx.lineTo(g.right, topClip);
    ctx.closePath();
    ctx.clip();
    if(level>0){
      var al=opts.alpha==null?0.8:opts.alpha, rx=bw/2, ry=bw*0.10;
      // liquid body
      ctx.fillStyle=rgb(fill, al);
      ctx.fillRect(g.left, lvY, bw, floor-lvY);
      // rounded front of the liquid body at the surface
      ctx.beginPath(); ctx.ellipse(cx, lvY, rx, ry, 0, 0, 7); ctx.fill();
      // visible water surface (elliptical disc, like the lab)
      ctx.fillStyle=rgb(lerp(fill,[255,255,255],.30), Math.min(0.72, al+0.06));
      ctx.beginPath(); ctx.ellipse(cx, lvY, rx*0.97, ry*0.88, 0, 0, 7); ctx.fill();
      ctx.strokeStyle=rgb(lerp(fill,[255,255,255],.5), .38); ctx.lineWidth=1.1;
      ctx.beginPath(); ctx.ellipse(cx, lvY, rx*0.97, ry*0.88, 0, 0, 7); ctx.stroke();
    }
    if(opts.haze>0){ ctx.fillStyle=rgb(opts.precip||[235,238,242], opts.haze*0.5); ctx.fillRect(g.left,lvY,bw,floor-lvY); }
    if(opts.precip && parts.length){ parts.forEach(function(p){ ctx.fillStyle=rgb(opts.precip,.92); ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,7); ctx.fill(); }); }
    bubbles.forEach(function(b){ ctx.fillStyle='rgba(235,250,255,'+(0.22+0.4*b.o)+')'; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,7); ctx.fill(); });
    if(opts.extra) opts.extra(g, lvY, floor);
    ctx.restore();
    // top glass highlights composited over the liquid
    if(BKok){ ctx.globalCompositeOperation='lighten'; ctx.drawImage(BK, g.ox, g.oy, g.dw, g.dh); ctx.globalCompositeOperation='source-over'; }
    return {cx:cx, bw:bw, bot:floor, lvY:lvY, top:topClip, left:g.left, right:g.right};
  }
  function roundBeakerPath(cx,bw,top,bot){ var r=16; ctx.moveTo(cx-bw/2,top); ctx.lineTo(cx-bw/2,bot-r); ctx.quadraticCurveTo(cx-bw/2,bot,cx-bw/2+r,bot); ctx.lineTo(cx+bw/2-r,bot); ctx.quadraticCurveTo(cx+bw/2,bot,cx+bw/2,bot-r); ctx.lineTo(cx+bw/2,top); }
  function drip(cx, toY, on){ if(!on) return; var g=GEO; var tubeTop=g.oy+g.dh*0.02, tubeBot=g.oy+g.dh*0.17;
    ctx.fillStyle='rgba(150,190,220,.16)'; ctx.fillRect(cx-6,tubeTop,12,tubeBot-tubeTop);
    ctx.strokeStyle='rgba(160,200,230,.45)'; ctx.lineWidth=1.3; ctx.strokeRect(cx-6,tubeTop,12,tubeBot-tubeTop);
    var dy=(offset/700)%1; var y=tubeBot+dy*(toY-tubeBot-4);
    ctx.fillStyle='rgba(165,208,242,.9)'; ctx.beginPath(); ctx.ellipse(cx,y,3,4.5,0,0,7); ctx.fill(); }
  function drawFlame(color, x, baseY, scale, flick){
    var fl=reduced?0:Math.sin(offset/120)*0.06+Math.sin(offset/57)*0.04;
    var h=150*scale*(1+fl), w=52*scale;
    var g=ctx.createRadialGradient(x,baseY-h*0.45,4,x,baseY-h*0.4,h*0.75);
    g.addColorStop(0,'rgba(255,255,255,.85)');
    g.addColorStop(0.25,rgb(lerp(color,[255,255,255],.35),.95));
    g.addColorStop(0.6,rgb(color,.9));
    g.addColorStop(1,rgb(color,0));
    ctx.fillStyle=g; ctx.beginPath();
    ctx.moveTo(x,baseY);
    ctx.bezierCurveTo(x-w,baseY-h*0.3, x-w*0.5,baseY-h*0.8, x,baseY-h);
    ctx.bezierCurveTo(x+w*0.5,baseY-h*0.8, x+w,baseY-h*0.3, x,baseY);
    ctx.fill();
    // inner core
    ctx.fillStyle='rgba(200,225,255,.5)'; ctx.beginPath();
    ctx.moveTo(x,baseY); ctx.bezierCurveTo(x-w*0.4,baseY-h*0.25,x-w*0.2,baseY-h*0.5,x,baseY-h*0.62);
    ctx.bezierCurveTo(x+w*0.2,baseY-h*0.5,x+w*0.4,baseY-h*0.25,x,baseY); ctx.fill();
  }
  function drawSpark(s, arr, min, max, color){
    var c=s.ctx, w=s.cv.width, h=s.cv.height; c.clearRect(0,0,w,h);
    c.strokeStyle='rgba(255,255,255,.08)'; c.lineWidth=1; c.beginPath(); c.moveTo(0,h/2); c.lineTo(w,h/2); c.stroke();
    if(arr.length<2) return;
    c.strokeStyle=color; c.lineWidth=2; c.beginPath();
    arr.forEach(function(v,i){ var x=i/(arr.length-1)*w; var y=h-((v-min)/(max-min))*h; y=Math.max(3,Math.min(h-3,y)); if(i===0)c.moveTo(x,y); else c.lineTo(x,y); });
    c.stroke();
    var lx=w, ly=h-((arr[arr.length-1]-min)/(max-min))*h; ly=Math.max(3,Math.min(h-3,ly));
    c.fillStyle=color; c.beginPath(); c.arc(lx-3,ly,2.5,0,7); c.fill();
  }

  /* ---------- per-type frame ---------- */
  function spawnBubbles(rate, region){
    if(reduced) rate*=0.35;
    if(Math.random()<rate){ bubbles.push({x:region.cx-region.bw/2+8+Math.random()*(region.bw-16), y:region.bot-16, r:1.6+Math.random()*3, o:Math.random(), vy:0.6+Math.random()*1.1}); }
    for(var i=bubbles.length-1;i>=0;i--){ var b=bubbles[i]; b.y-=b.vy; b.x+=Math.sin((offset+i*40)/300)*0.4; if(b.y<region.lvY+2) bubbles.splice(i,1); }
    if(bubbles.length>90) bubbles.splice(0,bubbles.length-90);
  }

  function frame(ts){
    if(start==null) start=ts;
    if(!paused) offset=ts-start-0; // running time
    var run = paused ? pauseStamp : (ts-start);
    var p = dur>0 ? Math.min(1, run/dur) : 0;
    render(p, run);
    if(dur>0 && p>=1){ if(T.loop){ start=ts; bubbles=[]; parts=[]; fumes=[]; } else { done=true; } }
    raf=requestAnimationFrame(frame);
  }

  function render(p, run){
    clearBG();
    if(type==='titration'){
      var ph = 1.6 + 11.0*(1/(1+Math.exp(-15*(p-0.5))));
      var tp = 22 + 4.2*Math.exp(-Math.pow((p-0.5)/0.12,2));
      var col = ph2btb(ph);
      var reg = beaker(col, 0.62, {});
      drip(reg.cx, reg.lvY, true);
      spawnBubbles(0, reg); // no bubbles
      // flag near equivalence
      var near=Math.abs(ph-7)<1.1;
      if(flag) flag.classList.toggle('show', near);
      if(flag) flag.textContent=t(UI.near);
      // meters
      setMeter('ph', ph.toFixed(1), (ph/14), '#5aa2ff');
      setMeter('temp', tp.toFixed(1)+'°C', (tp-20)/10, '#ffb27a');
      if(sparks.ph){ sparks.ph.data.push(ph); if(sparks.ph.data.length>90)sparks.ph.data.shift(); drawSpark(sparks.ph, sparks.ph.data,0,14,'#5aa2ff'); }
      if(sparks.temp){ sparks.temp.data.push(tp); if(sparks.temp.data.length>90)sparks.temp.data.shift(); drawSpark(sparks.temp, sparks.temp.data,20,30,'#ffb27a'); }
    }
    else if(type==='gas'){
      var reg=beaker(T.liquid||[150,175,200], 0.55, {});
      spawnBubbles((T.rate||1)*0.7, reg);
      setMeter('gas', Math.round(p*100)+'%', p, T.danger?'#ff9a4d':'#3fd9c8');
    }
    else if(type==='combustion'){
      var reg=beaker([120,95,40], 0.13, {});
      var inten=Math.min(1,p*2);
      drawFlame(T.flame||[120,150,255], reg.cx, reg.lvY+4, 0.62+0.5*inten, true);
      if(!reduced && Math.random()<0.4) fumes.push({x:reg.cx+(Math.random()-0.5)*44,y:reg.top,r:6+Math.random()*8,o:0.4});
      updateFumes(reg.top-40);
      setMeter('gas', Math.round(p*100)+'%', p, '#ff9a4d');
    }
    else if(type==='precip'){
      var mix=Math.min(1, p/0.28);
      var solNow = T.solTo ? lerp(T.sol, T.solTo, Math.min(1,(p-0.2)/0.6<0?0:(p-0.2)/0.6)) : T.sol;
      var haze = Math.max(0, Math.min(1,(p-0.25)/0.4));
      var reg=beaker(solNow||[150,175,200], 0.6, {precip:T.precip, haze:haze});
      if(p<0.3) drip(reg.cx, reg.lvY, true);
      // grow settled particles
      if(p>0.35 && parts.length< (reduced?40:110) && Math.random()<0.5){
        parts.push({x:reg.cx-reg.bw/2+10+Math.random()*(reg.bw-20), y:reg.bot-18-Math.random()*30*(p-0.35), r:1.4+Math.random()*2.4});
      }
      // settle drift
      parts.forEach(function(q){ if(q.y<reg.bot-16) q.y+=0.3; });
      setMeter('turb', Math.round(Math.min(1,p/0.7)*100)+'%', Math.min(1,p/0.7), '#cfd8e2');
    }
    else if(type==='amalgam'){
      var pr=p;
      var reg=beaker([120,130,140], 0.24, { extra:function(g,lvY,floor){
        ctx.fillStyle='rgba(180,190,200,.9)'; ctx.fillRect(g.cx-28, floor-52, 56, 42);
        var n=Math.floor((reduced?14:34)*pr);
        for(var i=0;i<n;i++){ var wx=g.cx-24+(i*48/34); var gh=8+(Math.sin(i*3.1)*0.5+0.5)*38*pr; ctx.strokeStyle='rgba(240,244,248,'+(0.5+0.4*pr)+')'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(wx,floor-52); ctx.lineTo(wx+Math.sin(i)*3,floor-52-gh); ctx.stroke(); }
      }});
      if(!reduced && Math.random()<0.3) fumes.push({x:reg.cx+(Math.random()-0.5)*44,y:reg.bot-80,r:6+Math.random()*8,o:0.35});
      updateFumes(reg.bot-110);
      setMeter('turb', Math.round(p*100)+'%', p, '#eef2f6');
    }
    else if(type==='colorchange'){
      var cc=lerp(T.from, T.to, easeInOut(p));
      var reg=beaker(cc, 0.6, {});
      if(T.drip && p<0.4) drip(reg.cx, reg.lvY, true);
      if(T.fizz) spawnBubbles(0.5, reg);
      setMeter('prog', Math.round(p*100)+'%', p, '#a879ff');
    }
    else if(type==='indicator'){
      var tab=IND[T.ind]||IND.BTB;
      var phase=(run/ (dur/3))%3; // 0..3 across acid/neutral/base
      var col,phv,lbl;
      if(phase<1){ col=lerp(tab.acid,tab.neutral,smooth(phase)); phv=tab.pa+(tab.pn-tab.pa)*phase; }
      else if(phase<2){ col=lerp(tab.neutral,tab.base,smooth(phase-1)); phv=tab.pn+(tab.pb-tab.pn)*(phase-1); }
      else { col=lerp(tab.base,tab.acid,smooth(phase-2)); phv=tab.pb+(tab.pa-tab.pb)*(phase-2); }
      beaker(col,0.6,{});
      setMeter('ph', phv.toFixed(1), phv/14, '#5aa2ff');
      // phase label
      if(flag){ var L=phv<6?({ja:'酸性',en:'Acidic'}):(phv>8?({ja:'塩基性',en:'Basic'}):({ja:'中性付近',en:'Near neutral'})); flag.textContent=t(L); flag.classList.add('show'); }
    }
    else if(type==='flame'){
      metalT+=16; if(metalT> 3600){ metalT=0; metalIdx=(metalIdx+1)%T.metals.length; updateFlameLabel(); }
      // burner
      ctx.fillStyle='rgba(120,140,160,.4)'; ctx.fillRect(W/2-10,330,20,30);
      ctx.fillStyle='rgba(140,160,180,.3)'; ctx.beginPath(); ctx.ellipse(W/2,330,26,7,0,0,7); ctx.fill();
      drawFlame(T.metals[metalIdx].color, W/2, 330, 1.05, true);
    }
  }
  function updateFumes(topY){ for(var i=fumes.length-1;i>=0;i--){ var f=fumes[i]; f.y-=0.7; f.r+=0.25; f.o-=0.006; if(f.o<=0){fumes.splice(i,1);continue;} ctx.fillStyle='rgba(210,215,220,'+f.o+')'; ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,7); ctx.fill(); } }
  function easeInOut(x){ return x<0.5?2*x*x:1-Math.pow(-2*x+2,2)/2; }
  function smooth(x){ return x*x*(3-2*x); }
  function setMeter(k,val,frac,color){ var m=meters[k]; if(!m)return; if(m.v)m.v.textContent=val; if(m.fill){ m.fill.style.width=Math.max(0,Math.min(1,frac))*100+'%'; m.fill.style.background=color; } }

  raf=requestAnimationFrame(frame);

  return {
    stop:function(){ if(raf) cancelAnimationFrame(raf); raf=null; },
    restart:function(){ start=null; offset=0; pauseStamp=0; paused=false; done=false; bubbles=[]; parts=[]; fumes=[]; if(sparks.ph)sparks.ph.data=[]; if(sparks.temp)sparks.temp.data=[]; metalIdx=0; metalT=0; if(type==='flame')updateFlameLabel(); },
    toggle:function(){ paused=!paused; if(paused){ pauseStamp=(performance.now()-start); if(raf){cancelAnimationFrame(raf);raf=null;} } else { start=performance.now()-pauseStamp; raf=requestAnimationFrame(frame); } return paused; },
    isPaused:function(){ return paused; }
  };
}

/* ============================================================
   MODAL MANAGER
   ============================================================ */
var modal=document.getElementById('demoModal');
var mBody=document.getElementById('dmBody'), mFoot=document.getElementById('dmFoot');
var mCat=document.getElementById('dmCat'), mTitle=document.getElementById('dmTitle');
var mClose=document.getElementById('dmClose');
var trigger=null, stage=null, CUR=null, opening=false;

function lockScroll(on){ document.body.style.overflow=on?'hidden':''; }

function openModal(state, el){
  if(el) trigger=el;
  CUR=state;
  if(!modal.classList.contains('open')){
    modal.hidden=false; modal.classList.add('open'); lockScroll(true);
    document.addEventListener('keydown', onKey, true);
  }
  renderState();
}
function closeModal(){
  if(!modal.classList.contains('open')) return;
  stopStage();
  modal.classList.remove('open'); modal.hidden=true; lockScroll(false);
  document.removeEventListener('keydown', onKey, true);
  CUR=null;
  if(trigger && trigger.focus){ try{ trigger.focus(); }catch(e){} }
  trigger=null;
}
function stopStage(){ if(stage){ stage.stop(); stage=null; } }

function onKey(e){
  if(e.key==='Escape'){ e.preventDefault(); closeModal(); return; }
  if(e.key==='Tab'){ trapFocus(e); }
}
function trapFocus(e){
  var f=modal.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
  f=Array.prototype.filter.call(f,function(x){ return x.offsetParent!==null && !x.disabled; });
  if(!f.length) return;
  var first=f[0], last=f[f.length-1];
  if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
}

modal.addEventListener('mousedown', function(e){ if(e.target===modal) closeModal(); });
mClose.addEventListener('click', closeModal);

/* ---- footer button builder ---- */
function footBtn(label, cls, fn){ var b=document.createElement('button'); b.className='dbtn'+(cls?' '+cls:''); b.textContent=label; b.addEventListener('click',fn); return b; }

/* ---- render dispatch ---- */
function renderState(){
  stopStage();
  mBody.innerHTML=''; mFoot.innerHTML='';
  var s=CUR; if(!s) return;
  if(s.view==='demo') renderDemo(s);
  else if(s.view==='missions') renderMissions(s);
  else if(s.view==='demolist') renderDemoList(s);
  else if(s.view==='phenom') renderPhenom(s);
  // focus first control
  setTimeout(function(){ var f=modal.querySelector('.dm-body button, .dm-foot button'); if(f) f.focus(); },30);
}

/* ---- demo player view ---- */
function renderDemo(s){
  var d=D[s.id]; if(!d) return;
  mCat.textContent=t(CAT[d.cat]).toUpperCase();
  mTitle.innerHTML=esc(t(d.name))+(d.sub&&lang()==='ja'?'<span class="sub">'+esc(d.sub)+'</span>':'');
  var body=document.createElement('div');
  body.innerHTML=
    '<p class="dm-desc">'+esc(t(d.desc))+'</p>'+
    '<div class="stage">'+
      '<div class="stage-vis"><span class="stage-flag"></span></div>'+
      '<div class="stage-info"></div>'+
    '</div>';
  mBody.appendChild(body);
  var vis=body.querySelector('.stage-vis'), info=body.querySelector('.stage-info');
  stage=makeStage(vis, info, d.stage);
  // all reference info sits in the right column beside the beaker (no scroll on PC)
  var blocks=document.createElement('div');
  blocks.style.cssText='display:flex;flex-direction:column;gap:11px;margin-top:2px';
  blocks.innerHTML=
    '<div class="info-block"><h5>'+esc(t(UI.equation))+'</h5><div class="eqn">'+esc(d.eq)+'</div></div>'+
    '<div class="info-block"><h5>'+esc(t(UI.observe))+'</h5><ul class="obs-list">'+t(d.obs).map(function(o){return '<li>'+esc(o)+'</li>';}).join('')+'</ul></div>'+
    '<div class="info-block"><h5>'+esc(t(UI.materials))+'</h5><div class="note-txt">'+esc(t(d.materials))+'</div></div>'+
    '<div class="info-block" style="display:flex;align-items:flex-start;gap:10px;flex-wrap:wrap">'+dangerBadge(d.danger)+'<span class="note-txt" style="flex:1;min-width:160px">'+esc(t(d.notes))+'</span></div>';
  info.appendChild(blocks);

  // footer
  var pauseBtn=footBtn(t(UI.pause),'',function(){ var p=stage.toggle(); pauseBtn.textContent=p?t(UI.play):t(UI.pause); });
  mFoot.appendChild(pauseBtn);
  mFoot.appendChild(footBtn(t(UI.restart),'',function(){ stage.restart(); pauseBtn.textContent=t(UI.pause); }));
  if(s.back) mFoot.appendChild(footBtn(t(UI.back),'',function(){ openModal(s.back); }));
  if(s.id==='neutralize') mFoot.appendChild(footBtn(t(UI.tryLab),'primary',gotoLab));
  mFoot.appendChild(footBtn(t(UI.close),'',closeModal));
}

/* ---- mission list view ---- */
function renderMissions(s){
  mCat.textContent=t(CAT.mission).toUpperCase();
  mTitle.textContent=lang()==='ja'?'ミッションモード':'Mission Mode';
  var html='';
  MISSION_GROUPS.forEach(function(g){
    html+='<div class="diff-group"><div class="diff-head"><span class="dname">'+esc(t(DIFF[g.diff]))+'</span><span class="drule"></span></div><div class="dgrid">';
    g.ids.forEach(function(id){ html+=tileHTML(id,'mission'); });
    html+='</div></div>';
  });
  html+='<div class="consent-note">'+esc(t(UI.consentBody))+'</div>';
  mBody.innerHTML=html;
  wireTiles(mBody, function(id){ openModal({view:'demo', id:id, back:{view:'missions'}}); });
  mFoot.appendChild(footBtn(t(UI.close),'',closeModal));
  mFoot.appendChild(footBtn(t(UI.toLab),'primary',gotoLab));
}

/* ---- reaction demo list view ---- */
function renderDemoList(s){
  mCat.textContent=t(CAT.demo).toUpperCase();
  mTitle.textContent=lang()==='ja'?'反応デモ一覧':'Reaction Demos';
  var html='<p class="dm-desc">'+esc(lang()==='ja'?'既存データで正しく再現できる反応のみを掲載しています。すべて閲覧専用です。':'Only reactions that the dataset can reproduce accurately are listed. All are view-only.')+'</p><div class="dgrid">';
  DEMO_LIST.forEach(function(id){ html+=tileHTML(id,'demo'); });
  html+='</div>';
  mBody.innerHTML=html;
  wireTiles(mBody, function(id){ openModal({view:'demo', id:id, back:{view:'demolist'}}); });
  mFoot.appendChild(footBtn(t(UI.close),'',closeModal));
}

/* ---- phenomenon preset view ---- */
function renderPhenom(s){
  var catKey=PHENOM_CAT[s.cat];
  mCat.textContent=t(CAT[catKey]).toUpperCase();
  mTitle.textContent=t(CAT[catKey]);
  var ids=PHENOM[s.cat]||[];
  var html='<p class="dm-desc">'+esc(lang()==='ja'?'見たいプリセットデモを選んでください。すべて閲覧専用です。':'Choose a preset demo. All are view-only.')+'</p><div class="dgrid">';
  ids.forEach(function(id){ html+=tileHTML(id,'phenom'); });
  html+='</div>';
  mBody.innerHTML=html;
  wireTiles(mBody, function(id){ openModal({view:'demo', id:id, back:{view:'phenom', cat:s.cat}}); });
  mFoot.appendChild(footBtn(t(UI.close),'',closeModal));
}

function tileHTML(id, mode){
  var d=D[id];
  var meta='';
  if(mode==='mission'){ meta='<div class="tmeta">'+esc(t(UI.observe))+'：'+esc(t(d.obs)[0])+'</div>'; }
  else { meta='<div class="tmeta">'+esc(t(UI.materials))+'：'+esc(t(d.materials))+'</div>'; }
  return '<button class="dtile" data-id="'+id+'" type="button">'+
    '<div class="trow" style="justify-content:space-between">'+dangerBadge(d.danger)+'</div>'+
    '<h4>'+esc(t(d.name))+'</h4>'+
    '<div class="tdesc">'+esc(t(d.desc))+'</div>'+
    meta+
    '<span class="seebtn">'+esc(t(UI.seeDemo))+' →</span>'+
    '</button>';
}
function wireTiles(root, cb){
  root.querySelectorAll('.dtile').forEach(function(b){ b.addEventListener('click',function(){ cb(b.dataset.id); }); });
}

/* ============================================================
   CONSENT-GATED LAB NAVIGATION
   ============================================================ */
function consented(){
  var chk=document.getElementById('agchk');
  if(chk && chk.checked) return true;
  try{
    var l=lang();
    return sessionStorage.getItem(l==='en'?'vclDisclaimerAcceptedEn':'vclDisclaimerAcceptedJa')==='1';
  }catch(e){ return false; }
}
function gotoLab(){
  if(consented()){
    if(typeof window.enterLab==='function'){
      // ensure checkbox reflects consent so enterLab proceeds
      var chk=document.getElementById('agchk'); if(chk && !chk.checked){ try{ sessionStorage.setItem(lang()==='en'?'vclDisclaimerAcceptedEn':'vclDisclaimerAcceptedJa','1'); }catch(e){} chk.checked=true; if(typeof window.syncAgree==='function') window.syncAgree(); }
      window.enterLab(lang());
    }
  } else {
    closeModal();
    promptConsent();
  }
}
function promptConsent(){
  var reduced=RM;
  window.scrollTo({top:0, behavior: reduced?'auto':'smooth'});
  var chk=document.getElementById('agchk');
  var msg=document.getElementById('consentMsg');
  if(!msg){
    msg=document.createElement('div'); msg.id='consentMsg';
    msg.style.cssText='margin-top:12px;max-width:520px;font-size:13px;color:#ffcf9a;border:1px solid rgba(255,154,77,.45);background:rgba(255,120,50,.1);border-radius:10px;padding:11px 14px;line-height:1.6';
    msg.setAttribute('role','alert');
    var note=document.querySelector('.startnote');
    if(note && note.parentNode) note.parentNode.insertBefore(msg, note.nextSibling);
  }
  msg.textContent=t(UI.consentPrompt);
  msg.style.display='block';
  setTimeout(function(){ try{ if(chk) chk.focus(); }catch(e){} }, reduced?0:420);
}
// clear the prompt once the user consents
document.addEventListener('change', function(e){ if(e.target && e.target.id==='agchk'){ var m=document.getElementById('consentMsg'); if(m && e.target.checked) m.style.display='none'; } });

/* ============================================================
   OBSERVE → smooth scroll + gentle highlight
   ============================================================ */
function observeScroll(){
  var gal=document.getElementById('gallery');
  var hdr=document.getElementById('hdr');
  if(!gal) return;
  var reduced=RM;
  var offset=(hdr?hdr.offsetHeight:0)+16;
  var y=gal.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({top:y, behavior: reduced?'auto':'smooth'});
  var cards=gal.querySelectorAll('.gcard');
  setTimeout(function(){
    cards.forEach(function(c){ c.classList.remove('pulse-target'); void c.offsetWidth; c.classList.add('pulse-target'); });
    setTimeout(function(){ cards.forEach(function(c){ c.classList.remove('pulse-target'); }); }, 1900);
  }, reduced?0:520);
}

/* ============================================================
   CARD WIRING
   ============================================================ */
function activate(el, fn){
  el.addEventListener('click', fn);
  el.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fn(); } });
}
document.querySelectorAll('.fcard.clickable').forEach(function(c){
  activate(c, function(){
    var f=c.dataset.feature;
    if(f==='observe') observeScroll();
    else if(f==='measure') openModal({view:'demo', id:'neutralize'}, c);
    else if(f==='missions') openModal({view:'missions'}, c);
    else if(f==='demos') openModal({view:'demolist'}, c);
  });
});
document.querySelectorAll('.gcard.clickable').forEach(function(c){
  activate(c, function(){ openModal({view:'phenom', cat:c.dataset.phenom}, c); });
});

/* ============================================================
   LIVE LANGUAGE SWITCH
   ============================================================ */
window.onSiteLangChange=function(){ if(CUR && modal.classList.contains('open')) renderState(); var m=document.getElementById('consentMsg'); if(m && m.style.display!=='none') m.textContent=t(UI.consentPrompt); };

})();
