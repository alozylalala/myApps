// MyLife OS — app.js
// Runs via Babel standalone in the browser. No build step needed.
// Data persists via JSON export/import.

const { useState, useMemo, useEffect, useCallback } = React;

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styleEl = document.createElement('style');
styleEl.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg:#f7f6f2; --surface:#fff; --border:#e8e6e0;
    --text:#1a1917; --muted:#7a7874; --faint:#b0ada8;
    --accent:#2d5a3d; --accent-light:#eaf2ec;
    --danger:#c0392b; --danger-light:#fdf0ef;
    --warn:#b8860b; --warn-light:#fdf8e7;
    --blue:#2563eb; --blue-light:#eff6ff;
    --radius:12px;
    --shadow:0 1px 3px rgba(0,0,0,0.05),0 4px 16px rgba(0,0,0,0.04);
    --shadow-lg:0 4px 12px rgba(0,0,0,0.08),0 16px 40px rgba(0,0,0,0.06);
  }
  body { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }
  .serif { font-family:'DM Serif Display',serif; }

  /* Layout */
  .layout { display:flex; min-height:100vh; }
  .sidebar { width:230px; min-width:230px; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; padding:28px 16px; position:sticky; top:0; height:100vh; overflow-y:auto; }
  .logo { font-family:'DM Serif Display',serif; font-size:1.3rem; letter-spacing:-0.02em; }
  .logo-sub { font-size:0.7rem; color:var(--muted); letter-spacing:0.07em; text-transform:uppercase; margin-bottom:28px; margin-top:4px; }
  .nav-section { font-size:0.63rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--faint); padding:0 12px; margin:14px 0 4px; }
  .nav-item { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:8px; cursor:pointer; font-size:0.875rem; font-weight:500; color:var(--muted); border:none; background:none; width:100%; text-align:left; transition:all 0.15s; margin-bottom:2px; }
  .nav-item:hover { background:var(--bg); color:var(--text); }
  .nav-item.active { background:var(--accent-light); color:var(--accent); }
  .main { flex:1; padding:40px 48px; max-width:1100px; }

  /* Page */
  .page-title { font-family:'DM Serif Display',serif; font-size:2rem; letter-spacing:-0.03em; margin-bottom:2px; }
  .page-sub { color:var(--muted); font-size:0.875rem; margin-bottom:28px; }

  /* Cards */
  .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:24px; box-shadow:var(--shadow); }
  .card-sm { padding:16px 20px; }
  .card-title { font-size:0.68rem; font-weight:600; letter-spacing:0.09em; text-transform:uppercase; color:var(--muted); margin-bottom:6px; }
  .card-value { font-family:'DM Serif Display',serif; font-size:1.9rem; letter-spacing:-0.03em; line-height:1; }
  .pos { color:var(--accent); } .neg { color:var(--danger); }

  /* Grids */
  .g2 { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; margin-bottom:20px; }
  .g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:20px; }
  .g4 { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }

  /* Tabs */
  .pill-row { display:flex; gap:6px; margin-bottom:24px; flex-wrap:wrap; }
  .pill { padding:6px 14px; border-radius:99px; border:1px solid var(--border); background:transparent; font-family:'DM Sans',sans-serif; font-size:0.8rem; cursor:pointer; color:var(--muted); transition:all 0.15s; }
  .pill:hover { background:var(--bg); color:var(--text); }
  .pill.on { background:var(--text); color:#fff; border-color:var(--text); }

  /* Table */
  .tbl { width:100%; border-collapse:collapse; font-size:0.85rem; }
  .tbl th { font-size:0.67rem; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); text-align:left; padding:0 10px 10px 0; border-bottom:1px solid var(--border); }
  .tbl td { padding:11px 10px 11px 0; border-bottom:1px solid var(--border); vertical-align:middle; }
  .tbl tr:last-child td { border-bottom:none; }

  /* Badges */
  .badge { display:inline-block; padding:2px 9px; border-radius:99px; font-size:0.68rem; font-weight:600; }
  .b-green { background:var(--accent-light); color:var(--accent); }
  .b-red { background:var(--danger-light); color:var(--danger); }
  .b-yellow { background:var(--warn-light); color:var(--warn); }
  .b-blue { background:var(--blue-light); color:var(--blue); }
  .b-gray { background:var(--bg); color:var(--muted); }

  /* Forms */
  input[type=text],input[type=number],input[type=url],input[type=date],select,textarea {
    padding:8px 11px; border:1px solid var(--border); border-radius:8px;
    font-family:'DM Sans',sans-serif; font-size:0.85rem; background:var(--bg);
    color:var(--text); outline:none; transition:border-color 0.15s,background 0.15s; width:100%;
  }
  input:focus,select:focus,textarea:focus { border-color:var(--accent); background:#fff; }
  textarea { resize:vertical; min-height:64px; }
  label { font-size:0.75rem; font-weight:600; color:var(--muted); display:block; margin-bottom:4px; letter-spacing:0.04em; }
  .field { margin-bottom:12px; }
  .frow { display:flex; gap:10px; align-items:flex-end; }
  .frow .field { flex:1; margin-bottom:0; }

  /* Buttons */
  .btn { padding:8px 16px; border-radius:8px; border:none; font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:500; cursor:pointer; transition:all 0.15s; display:inline-flex; align-items:center; gap:6px; }
  .btn-primary { background:var(--accent); color:#fff; } .btn-primary:hover { opacity:0.85; }
  .btn-danger { background:var(--danger); color:#fff; } .btn-danger:hover { opacity:0.85; }
  .btn-ghost { background:transparent; color:var(--muted); border:1px solid var(--border); } .btn-ghost:hover { background:var(--bg); color:var(--text); }
  .btn-sm { padding:5px 12px; font-size:0.78rem; }

  /* Section header */
  .shd { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .shd h3 { font-size:0.9rem; font-weight:600; }

  /* Divider */
  .div { height:1px; background:var(--border); margin:18px 0; }

  /* Bar */
  .bar-track { flex:1; height:7px; background:var(--bg); border-radius:99px; overflow:hidden; }
  .bar-fill { height:100%; border-radius:99px; transition:width 0.6s ease; }

  /* Modal */
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.28); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(2px); }
  .modal { background:var(--surface); border-radius:16px; padding:28px; width:100%; max-width:520px; box-shadow:var(--shadow-lg); max-height:90vh; overflow-y:auto; }
  .modal-title { font-family:'DM Serif Display',serif; font-size:1.4rem; letter-spacing:-0.02em; margin-bottom:20px; }
  .modal-footer { display:flex; gap:8px; justify-content:flex-end; margin-top:20px; }

  /* Ring */
  .ring-wrap { position:relative; display:inline-flex; }
  .ring-inner { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .ring-pct { font-family:'DM Serif Display',serif; font-size:1.4rem; line-height:1; }
  .ring-lbl { font-size:0.58rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.06em; margin-top:2px; }

  /* Amortisation */
  .amort-wrap { max-height:280px; overflow-y:auto; border:1px solid var(--border); border-radius:8px; }
  .amort-row { display:flex; font-size:0.78rem; }
  .amort-row > div { padding:7px 10px; border-bottom:1px solid var(--border); flex:1; text-align:right; }
  .amort-row > div:first-child { text-align:left; }
  .amort-head > div { font-size:0.63rem; font-weight:600; text-transform:uppercase; letter-spacing:0.07em; color:var(--muted); background:var(--bg); padding:6px 10px; }

  /* Notes */
  .note-chip { display:inline-flex; align-items:center; gap:4px; font-size:0.7rem; color:var(--muted); background:var(--bg); border-radius:6px; padding:2px 8px; margin-top:3px; cursor:pointer; text-decoration:none; }
  .note-chip:hover { background:var(--border); }
  .rec-dot { width:6px; height:6px; border-radius:50%; background:var(--blue); display:inline-block; margin-right:5px; vertical-align:middle; }

  /* Data bar */
  .data-bar { position:fixed; bottom:0; left:0; right:0; background:var(--surface); border-top:1px solid var(--border); padding:10px 24px; display:flex; align-items:center; gap:12px; z-index:100; font-size:0.78rem; }
  .data-bar-status { color:var(--muted); flex:1; }
  .save-pulse { color:var(--accent); font-weight:600; }

  /* Toast */
  .toast { position:fixed; bottom:60px; left:50%; transform:translateX(-50%); background:var(--text); color:#fff; padding:10px 20px; border-radius:99px; font-size:0.82rem; font-weight:500; z-index:300; box-shadow:var(--shadow-lg); animation:fadeup 0.2s ease; }
  @keyframes fadeup { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }

  /* Import drop zone */
  .dropzone { border:2px dashed var(--border); border-radius:12px; padding:32px; text-align:center; color:var(--muted); font-size:0.875rem; cursor:pointer; transition:all 0.2s; }
  .dropzone:hover, .dropzone.drag { border-color:var(--accent); background:var(--accent-light); color:var(--accent); }

  /* Utils */
  .fw6 { font-weight:600; }
  .fs-sm { font-size:0.8rem; }
  .text-muted { color:var(--muted); }
  .text-accent { color:var(--accent); }
  .text-danger { color:var(--danger); }
  .mt16 { margin-top:16px; }
  .gap8 { gap:8px; }
`;
document.head.appendChild(styleEl);

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS & HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const APP_VERSION = "1.0.0";
const DATA_KEY    = "mylife-os-data";
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TODAY  = new Date();

const fmt  = n => (n??0).toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});
const fmt2 = n => (n??0).toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});
const uid  = () => Math.random().toString(36).slice(2,9);
const ts   = () => new Date().toISOString();

const CATEGORIES = ["employment","freelance","investment","rental","other-income","housing","insurance","living","transport","health","taxes","education","other"];
const FREQS      = ["monthly","quarterly","annually","one-off"];
const CAT_COLORS = {housing:"#2d5a3d",insurance:"#5a8c6e",taxes:"#c0392b",living:"#8faead",employment:"#2563eb",freelance:"#7c3aed",investment:"#0891b2",other:"#9ca3af"};

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT DATA (used only on first launch)
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  version: APP_VERSION,
  lastSaved: null,
  finance: {
    items: [
      {id:uid(),label:"Salary",amount:7500,type:"income",category:"employment",recurring:true,frequency:"monthly",notes:"Base salary after 401k",url:""},
      {id:uid(),label:"Freelance",amount:1200,type:"income",category:"freelance",recurring:false,frequency:"one-off",notes:"Contract work",url:""},
      {id:uid(),label:"Rent",amount:1800,type:"expense",category:"housing",recurring:true,frequency:"monthly",notes:"12-month lease",url:""},
      {id:uid(),label:"Groceries",amount:420,type:"expense",category:"living",recurring:true,frequency:"monthly",notes:"",url:""},
      {id:uid(),label:"Health Insurance",amount:310,type:"expense",category:"insurance",recurring:true,frequency:"monthly",notes:"Renews January",url:""},
      {id:uid(),label:"Car Insurance",amount:140,type:"expense",category:"insurance",recurring:true,frequency:"monthly",notes:"⚠️ Renews Apr 30",url:""},
      {id:uid(),label:"Utilities",amount:180,type:"expense",category:"living",recurring:true,frequency:"monthly",notes:"",url:""},
      {id:uid(),label:"Subscriptions",amount:95,type:"expense",category:"living",recurring:true,frequency:"monthly",notes:"Netflix, Spotify, iCloud",url:""},
    ],
    loans: [
      {id:uid(),name:"Home Loan",principal:380000,balance:342000,annualRate:6.25,termMonths:360,startDate:"2020-06-01",notes:"30yr fixed — consider refinancing in 2026"},
      {id:uid(),name:"Car Loan",principal:28000,balance:12400,annualRate:4.9,termMonths:60,startDate:"2021-09-01",notes:"Paying extra $200/mo since Jan 2023"},
    ],
    taxFiling: "single",
  },
  tasks: [
    {id:uid(),text:"Renew car insurance",due:"2026-04-30",done:false,priority:"high",created:ts()},
    {id:uid(),text:"File Q1 tax estimate",due:"2026-04-15",done:true,priority:"high",created:ts()},
    {id:uid(),text:"Review stock portfolio",due:"2026-05-01",done:false,priority:"medium",created:ts()},
    {id:uid(),text:"Schedule dentist",due:"2026-05-10",done:false,priority:"low",created:ts()},
  ],
  docs: [
    {id:uid(),name:"Tax Return 2024.pdf",type:"pdf",tag:"Taxes",updated:"2024-03-12",notes:""},
    {id:uid(),name:"Health Insurance Policy.pdf",type:"pdf",tag:"Insurance",updated:"2024-01-05",notes:""},
    {id:uid(),name:"Car Insurance Certificate.pdf",type:"pdf",tag:"Insurance",updated:"2024-02-20",notes:""},
    {id:uid(),name:"Lease Agreement 2025.docx",type:"doc",tag:"Housing",updated:"2025-01-01",notes:""},
  ],
  feed: [
    {id:uid(),source:"IRS News",title:"2025 Tax Brackets & Standard Deduction Updates",desc:"Key changes to federal income tax rates affecting your 2025 filing.",tag:"Taxes",read:false,saved:ts()},
    {id:uid(),source:"CNBC",title:"Fed Holds Rates Steady — What It Means for Your Savings",desc:"Federal Reserve decision and impact on savings accounts and bonds.",tag:"Finance",read:false,saved:ts()},
    {id:uid(),source:"Coursera",title:"AI for Finance Professionals (Free audit)",desc:"6-week course covering how AI is reshaping financial planning.",tag:"Learning",read:false,saved:ts()},
    {id:uid(),source:"LinkedIn Learning",title:"Python for Data Analysis — Updated 2025",desc:"Revised curriculum covering pandas 2.0 and modern data workflows.",tag:"Skills",read:false,saved:ts()},
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PERSISTENCE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function exportJSON(data) {
  const blob = new Blob([JSON.stringify({...data, lastSaved: ts()}, null, 2)], {type:"application/json"});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `mylife-os-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      // Basic validation
      if (!parsed.finance || !parsed.tasks) throw new Error("Invalid file format");
      onSuccess(parsed);
    } catch(err) {
      onError("Could not parse file: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ─────────────────────────────────────────────────────────────────────────────
// TAX & AMORT LOGIC
// ─────────────────────────────────────────────────────────────────────────────
const BRACKETS = {
  single:[{r:.10,min:0,max:11600},{r:.12,min:11600,max:47150},{r:.22,min:47150,max:100525},{r:.24,min:100525,max:191950},{r:.32,min:191950,max:243725},{r:.35,min:243725,max:609350},{r:.37,min:609350,max:Infinity}],
  mfj:   [{r:.10,min:0,max:23200},{r:.12,min:23200,max:94300},{r:.22,min:94300,max:201050},{r:.24,min:201050,max:383900},{r:.32,min:383900,max:487450},{r:.35,min:487450,max:731200},{r:.37,min:731200,max:Infinity}],
};
const STD = {single:14600,mfj:29200};

function calcTax(gross, filing) {
  const deduction = STD[filing]||STD.single;
  const taxable   = Math.max(0, gross - deduction);
  let tax=0; const breakdown=[];
  for(const b of (BRACKETS[filing]||BRACKETS.single)){
    if(taxable<=b.min) break;
    const chunk=Math.min(taxable,b.max)-b.min, t=chunk*b.r;
    tax+=t; breakdown.push({rate:b.r,chunk,tax:t});
  }
  return {tax, taxable, deduction, breakdown, effective:gross>0?tax/gross:0};
}

function buildAmort(principal, annualRate, termMonths, startDate) {
  const r   = annualRate/100/12;
  const pmt = r===0 ? principal/termMonths : principal*r*Math.pow(1+r,termMonths)/(Math.pow(1+r,termMonths)-1);
  let bal=principal; const rows=[];
  const start=new Date(startDate||Date.now());
  for(let i=1;i<=termMonths;i++){
    const int=bal*r, prin=pmt-int;
    bal=Math.max(0,bal-prin);
    const d=new Date(start); d.setMonth(d.getMonth()+i);
    rows.push({month:i,date:`${MONTHS[d.getMonth()]} ${d.getFullYear()}`,payment:pmt,interest:int,principal:prin,balance:bal});
  }
  return {payment:pmt,rows};
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function RingChart({value, max, color="#2d5a3d", size=100, label=""}) {
  const r=38, circ=2*Math.PI*r, p=Math.min((value??0)/(max||1),1);
  return (
    React.createElement('div',{className:"ring-wrap",style:{width:size,height:size}},
      React.createElement('svg',{width:size,height:size,viewBox:"0 0 90 90"},
        React.createElement('circle',{cx:45,cy:45,r,fill:"none",stroke:"#e8e6e0",strokeWidth:7}),
        React.createElement('circle',{cx:45,cy:45,r,fill:"none",stroke:color,strokeWidth:7,
          strokeDasharray:circ,strokeDashoffset:circ*(1-p),strokeLinecap:"round",
          style:{transform:"rotate(-90deg)",transformOrigin:"center",transition:"stroke-dashoffset 0.7s ease"}})
      ),
      React.createElement('div',{className:"ring-inner"},
        React.createElement('span',{className:"ring-pct"},Math.round(p*100)+"%"),
        React.createElement('span',{className:"ring-lbl"},label)
      )
    )
  );
}

function Toast({msg, onDone}) {
  useEffect(()=>{ const t=setTimeout(onDone,2500); return ()=>clearTimeout(t); },[]);
  return React.createElement('div',{className:"toast"},msg);
}

// ─────────────────────────────────────────────────────────────────────────────
// ITEM MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ItemModal({item, onSave, onClose}) {
  const blank = {id:uid(),label:"",amount:"",type:"expense",category:"living",recurring:false,frequency:"monthly",notes:"",url:""};
  const [f,setF] = useState(item||blank);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const valid = f.label.trim() && parseFloat(f.amount)>0;

  return React.createElement('div',{className:"overlay",onClick:e=>e.target===e.currentTarget&&onClose()},
    React.createElement('div',{className:"modal"},
      React.createElement('div',{className:"modal-title"},item?"Edit Line Item":"New Line Item"),
      React.createElement('div',{className:"frow"},
        React.createElement('div',{className:"field",style:{flex:2}},
          React.createElement('label',null,"Label"),
          React.createElement('input',{type:"text",value:f.label,onChange:e=>set("label",e.target.value),placeholder:"e.g. Health Insurance"})
        ),
        React.createElement('div',{className:"field"},
          React.createElement('label',null,"Amount ($)"),
          React.createElement('input',{type:"number",value:f.amount,onChange:e=>set("amount",e.target.value),placeholder:"0"})
        )
      ),
      React.createElement('div',{className:"frow"},
        React.createElement('div',{className:"field"},
          React.createElement('label',null,"Type"),
          React.createElement('select',{value:f.type,onChange:e=>set("type",e.target.value)},
            React.createElement('option',{value:"income"},"Income"),
            React.createElement('option',{value:"expense"},"Expense")
          )
        ),
        React.createElement('div',{className:"field"},
          React.createElement('label',null,"Category"),
          React.createElement('select',{value:f.category,onChange:e=>set("category",e.target.value)},
            CATEGORIES.map(c=>React.createElement('option',{key:c,value:c},c.charAt(0).toUpperCase()+c.slice(1).replace(/-/g," ")))
          )
        )
      ),
      React.createElement('div',{className:"frow",style:{marginBottom:12}},
        React.createElement('div',{className:"field"},
          React.createElement('label',null,"Frequency"),
          React.createElement('select',{value:f.frequency,onChange:e=>set("frequency",e.target.value)},
            FREQS.map(fr=>React.createElement('option',{key:fr,value:fr},fr.charAt(0).toUpperCase()+fr.slice(1)))
          )
        ),
        React.createElement('div',{className:"field",style:{display:"flex",alignItems:"center",gap:8,paddingTop:20}},
          React.createElement('input',{type:"checkbox",id:"rec",checked:f.recurring,onChange:e=>set("recurring",e.target.checked),style:{width:"auto"}}),
          React.createElement('label',{htmlFor:"rec",style:{margin:0,fontSize:"0.85rem",fontWeight:500,color:"var(--text)",letterSpacing:0}},"Recurring")
        )
      ),
      React.createElement('div',{className:"field"},
        React.createElement('label',null,"Notes"),
        React.createElement('textarea',{value:f.notes,onChange:e=>set("notes",e.target.value),placeholder:"Renewal date, policy number, description…"})
      ),
      React.createElement('div',{className:"field"},
        React.createElement('label',null,"Payment / Reference URL"),
        React.createElement('input',{type:"url",value:f.url,onChange:e=>set("url",e.target.value),placeholder:"https://…"})
      ),
      React.createElement('div',{className:"modal-footer"},
        React.createElement('button',{className:"btn btn-ghost",onClick:onClose},"Cancel"),
        React.createElement('button',{className:"btn btn-primary",disabled:!valid,style:{opacity:valid?1:0.5},
          onClick:()=>onSave({...f,amount:parseFloat(f.amount)})},"Save")
      )
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOAN MODAL
// ─────────────────────────────────────────────────────────────────────────────
function LoanModal({loan, onSave, onClose}) {
  const blank = {id:uid(),name:"",principal:"",balance:"",annualRate:"",termMonths:"",startDate:"",notes:""};
  const [f,setF] = useState(loan?{...loan}:blank);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const valid = f.name && f.principal && f.balance && f.annualRate && f.termMonths;

  return React.createElement('div',{className:"overlay",onClick:e=>e.target===e.currentTarget&&onClose()},
    React.createElement('div',{className:"modal"},
      React.createElement('div',{className:"modal-title"},loan?"Edit Loan":"Add Loan"),
      React.createElement('div',{className:"field"},
        React.createElement('label',null,"Loan Name"),
        React.createElement('input',{type:"text",value:f.name,onChange:e=>set("name",e.target.value),placeholder:"e.g. Home Loan"})
      ),
      React.createElement('div',{className:"frow"},
        React.createElement('div',{className:"field"},
          React.createElement('label',null,"Original Principal ($)"),
          React.createElement('input',{type:"number",value:f.principal,onChange:e=>set("principal",e.target.value)})
        ),
        React.createElement('div',{className:"field"},
          React.createElement('label',null,"Current Balance ($)"),
          React.createElement('input',{type:"number",value:f.balance,onChange:e=>set("balance",e.target.value)})
        )
      ),
      React.createElement('div',{className:"frow"},
        React.createElement('div',{className:"field"},
          React.createElement('label',null,"Annual Rate (%)"),
          React.createElement('input',{type:"number",value:f.annualRate,step:"0.01",onChange:e=>set("annualRate",e.target.value)})
        ),
        React.createElement('div',{className:"field"},
          React.createElement('label',null,"Term (months)"),
          React.createElement('input',{type:"number",value:f.termMonths,onChange:e=>set("termMonths",e.target.value)})
        )
      ),
      React.createElement('div',{className:"field"},
        React.createElement('label',null,"Start Date"),
        React.createElement('input',{type:"date",value:f.startDate,onChange:e=>set("startDate",e.target.value)})
      ),
      React.createElement('div',{className:"field"},
        React.createElement('label',null,"Notes"),
        React.createElement('textarea',{value:f.notes,onChange:e=>set("notes",e.target.value),placeholder:"Rate type, refinance plans, lender…"})
      ),
      React.createElement('div',{className:"modal-footer"},
        React.createElement('button',{className:"btn btn-ghost",onClick:onClose},"Cancel"),
        React.createElement('button',{className:"btn btn-primary",disabled:!valid,style:{opacity:valid?1:0.5},
          onClick:()=>onSave({...f,principal:parseFloat(f.principal),balance:parseFloat(f.balance),annualRate:parseFloat(f.annualRate),termMonths:parseInt(f.termMonths)})},"Save")
      )
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINANCE MODULE
// ─────────────────────────────────────────────────────────────────────────────
function Finance({data, onChange}) {
  const [tab, setTab]         = useState("overview");
  const [editItem, setEditItem] = useState(null);
  const [editLoan, setEditLoan] = useState(null);
  const [expandLoan, setExpandLoan] = useState(null);

  const {items=[], loans=[], taxFiling="single"} = data;
  const income   = items.filter(i=>i.type==="income");
  const expenses = items.filter(i=>i.type==="expense");
  const totalIncome   = income.reduce((s,i)=>s+i.amount,0);
  const totalExpenses = expenses.reduce((s,i)=>s+i.amount,0);
  const net = totalIncome - totalExpenses;
  const savingsRate = totalIncome>0 ? net/totalIncome : 0;

  const annualIncome = income.reduce((s,i)=>{
    const mult = i.frequency==="monthly"?12:i.frequency==="quarterly"?4:1;
    return s+i.amount*mult;
  },0);
  const taxCalc = useMemo(()=>calcTax(annualIncome,taxFiling),[annualIncome,taxFiling]);
  const catTotals = expenses.reduce((acc,e)=>({...acc,[e.category]:(acc[e.category]||0)+e.amount}),{});
  const maxCat    = Math.max(...Object.values(catTotals),1);

  const saveItem = item => { onChange(d=>({...d,finance:{...d.finance,items:d.finance.items.find(i=>i.id===item.id)?d.finance.items.map(i=>i.id===item.id?item:i):[...d.finance.items,item]}})); setEditItem(null); };
  const delItem  = id   => onChange(d=>({...d,finance:{...d.finance,items:d.finance.items.filter(i=>i.id!==id)}}));
  const saveLoan = loan => { onChange(d=>({...d,finance:{...d.finance,loans:d.finance.loans.find(l=>l.id===loan.id)?d.finance.loans.map(l=>l.id===loan.id?loan:l):[...d.finance.loans,loan]}})); setEditLoan(null); };
  const delLoan  = id   => onChange(d=>({...d,finance:{...d.finance,loans:d.finance.loans.filter(l=>l.id!==id)}}));
  const setFiling = v  => onChange(d=>({...d,finance:{...d.finance,taxFiling:v}}));

  const totalLoanBal = loans.reduce((s,l)=>s+l.balance,0);
  const totalLoanPmt = loans.reduce((s,l)=>s+buildAmort(l.principal,l.annualRate,l.termMonths,l.startDate).payment,0);

  const TABS = [["overview","Overview"],["items","Income & Expenses"],["tax","Tax Estimator"],["loans","Loans"]];

  return React.createElement('div',null,
    React.createElement('div',{className:"page-title serif"},"Finance"),
    React.createElement('div',{className:"page-sub"},`${MONTHS[TODAY.getMonth()]} ${TODAY.getFullYear()} · Personal P&L`),
    React.createElement('div',{className:"pill-row"},
      TABS.map(([id,lbl])=>React.createElement('button',{key:id,className:`pill ${tab===id?"on":""}`,onClick:()=>setTab(id)},lbl))
    ),

    // OVERVIEW
    tab==="overview" && React.createElement('div',null,
      React.createElement('div',{className:"g3"},
        [["Monthly Income",totalIncome,"pos",`${income.length} sources`],
         ["Monthly Expenses",totalExpenses,"neg",`${expenses.length} items`],
         ["Net / Savings",net,net>=0?"pos":"neg",`${(savingsRate*100).toFixed(1)}% savings rate`]
        ].map(([t,v,c,s])=>React.createElement('div',{key:t,className:"card card-sm"},
          React.createElement('div',{className:"card-title"},t),
          React.createElement('div',{className:`card-value ${c}`},fmt(v)),
          React.createElement('div',{style:{fontSize:"0.75rem",color:"var(--muted)",marginTop:5}},s)
        ))
      ),
      React.createElement('div',{className:"g2"},
        React.createElement('div',{className:"card"},
          React.createElement('div',{className:"shd"},React.createElement('h3',null,"Expenses by Category")),
          Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>
            React.createElement('div',{key:cat,style:{display:"flex",alignItems:"center",gap:12,marginBottom:10}},
              React.createElement('div',{style:{width:88,fontSize:"0.78rem",color:"var(--muted)",flexShrink:0}},cat.charAt(0).toUpperCase()+cat.slice(1).replace(/-/g," ")),
              React.createElement('div',{className:"bar-track"},React.createElement('div',{className:"bar-fill",style:{width:`${(amt/maxCat)*100}%`,background:CAT_COLORS[cat]||"#9ca3af"}})),
              React.createElement('div',{style:{width:68,textAlign:"right",fontSize:"0.78rem"}},fmt(amt))
            )
          )
        ),
        React.createElement('div',{className:"card"},
          React.createElement('div',{className:"shd"},React.createElement('h3',null,"Snapshot")),
          React.createElement('div',{style:{display:"flex",gap:20,alignItems:"center",marginBottom:18}},
            React.createElement(RingChart,{value:totalExpenses,max:totalIncome,color:"#c0392b",label:"spent"}),
            React.createElement('div',{style:{fontSize:"0.82rem"}},
              React.createElement('div',{className:"fw6"},fmt(totalExpenses)+" spent"),
              React.createElement('div',{style:{color:"var(--muted)",marginTop:3}},"of "+fmt(totalIncome)+" income"),
              React.createElement('div',{style:{marginTop:10}},
                React.createElement('span',{className:"pos fw6"},fmt(net)),
                React.createElement('span',{style:{color:"var(--muted)"}}," to save")
              )
            )
          ),
          React.createElement('div',{className:"div"}),
          React.createElement('div',{style:{fontSize:"0.82rem",display:"flex",flexDirection:"column",gap:8}},
            [["Est. annual federal tax",fmt(taxCalc.tax),"text-danger"],
             ["Total loan balance",fmt(totalLoanBal),"fw6"],
             ["Monthly loan payments",fmt(totalLoanPmt),"text-danger"]
            ].map(([k,v,cls])=>React.createElement('div',{key:k,style:{display:"flex",justifyContent:"space-between"}},
              React.createElement('span',{className:"text-muted"},k),
              React.createElement('span',{className:cls+" fw6"},v)
            ))
          )
        )
      )
    ),

    // INCOME & EXPENSES
    tab==="items" && React.createElement('div',{className:"card"},
      React.createElement('div',{className:"shd"},
        React.createElement('h3',null,"Line Items"),
        React.createElement('button',{className:"btn btn-primary btn-sm",onClick:()=>setEditItem(false)},"+ Add Item")
      ),
      React.createElement('table',{className:"tbl"},
        React.createElement('thead',null,React.createElement('tr',null,
          ["Item","Category","Freq.","Notes / Links",React.createElement('span',{style:{float:"right"}},"Amount"),""].map((h,i)=>React.createElement('th',{key:i},h))
        )),
        React.createElement('tbody',null,
          [...income,...expenses].map(item=>React.createElement('tr',{key:item.id},
            React.createElement('td',null,
              React.createElement('div',{style:{fontWeight:500}},item.recurring&&React.createElement('span',{className:"rec-dot",title:"Recurring"}),item.label),
              React.createElement('span',{className:`badge ${item.type==="income"?"b-green":"b-red"}`},item.type)
            ),
            React.createElement('td',null,React.createElement('span',{className:"badge b-gray"},item.category.replace(/-/g," "))),
            React.createElement('td',{style:{fontSize:"0.78rem",color:"var(--muted)"}},item.frequency),
            React.createElement('td',{style:{maxWidth:160}},
              item.notes&&React.createElement('div',{className:"note-chip",title:item.notes,onClick:()=>setEditItem(item)},"📝 ",item.notes.slice(0,28),(item.notes.length>28?"…":"")),
              item.url&&React.createElement('a',{href:item.url,target:"_blank",rel:"noreferrer",className:"note-chip"},"🔗 Pay link")
            ),
            React.createElement('td',{style:{textAlign:"right",fontWeight:600,color:item.type==="income"?"var(--accent)":"var(--danger)"}},fmt(item.amount)),
            React.createElement('td',{style:{whiteSpace:"nowrap"}},
              React.createElement('button',{className:"btn btn-ghost btn-sm",style:{marginRight:4},onClick:()=>setEditItem(item)},"✏️"),
              React.createElement('button',{className:"btn btn-ghost btn-sm",onClick:()=>delItem(item.id)},"🗑")
            )
          ))
        )
      ),
      React.createElement('div',{className:"div"}),
      React.createElement('div',{style:{display:"flex",justifyContent:"space-between",fontSize:"0.85rem"}},
        React.createElement('div',null,
          React.createElement('span',{className:"text-muted"},"Income "),React.createElement('span',{className:"fw6 text-accent"},fmt(totalIncome)),
          React.createElement('span',{style:{margin:"0 12px",color:"var(--border)"}},"|"),
          React.createElement('span',{className:"text-muted"},"Expenses "),React.createElement('span',{className:"fw6 text-danger"},fmt(totalExpenses))
        ),
        React.createElement('div',null,React.createElement('span',{className:"text-muted"},"Net "),React.createElement('span',{className:`fw6 ${net>=0?"text-accent":"text-danger"}`},fmt(net)))
      )
    ),

    // TAX
    tab==="tax" && React.createElement('div',null,
      React.createElement('div',{className:"g2"},
        React.createElement('div',{className:"card"},
          React.createElement('div',{className:"shd"},React.createElement('h3',null,"Tax Settings")),
          React.createElement('div',{className:"field"},
            React.createElement('label',null,"Filing Status"),
            React.createElement('select',{value:taxFiling,onChange:e=>setFiling(e.target.value)},
              React.createElement('option',{value:"single"},"Single"),
              React.createElement('option',{value:"mfj"},"Married Filing Jointly")
            )
          ),
          React.createElement('div',{className:"div"}),
          React.createElement('div',{style:{fontSize:"0.83rem",display:"flex",flexDirection:"column",gap:9}},
            [["Gross Annual Income",fmt(annualIncome),""],["Standard Deduction",`(${fmt(taxCalc.deduction)})`,""],["Taxable Income",fmt(taxCalc.taxable),"fw6"]].map(([k,v,c])=>
              React.createElement('div',{key:k,style:{display:"flex",justifyContent:"space-between"}},React.createElement('span',{className:"text-muted"},k),React.createElement('span',{className:c},v))
            ),
            React.createElement('div',{className:"div"}),
            React.createElement('div',{style:{display:"flex",justifyContent:"space-between"}},React.createElement('span',{className:"text-muted"},"Estimated Federal Tax"),React.createElement('span',{className:"fw6 text-danger",style:{fontSize:"1.05rem"}},fmt(taxCalc.tax))),
            React.createElement('div',{style:{display:"flex",justifyContent:"space-between"}},React.createElement('span',{className:"text-muted"},"Effective Rate"),React.createElement('span',{className:"fw6"},`${(taxCalc.effective*100).toFixed(2)}%`)),
            React.createElement('div',{style:{display:"flex",justifyContent:"space-between"}},React.createElement('span',{className:"text-muted"},"Monthly Provision"),React.createElement('span',{className:"fw6 text-danger"},fmt(taxCalc.tax/12)))
          )
        ),
        React.createElement('div',{className:"card"},
          React.createElement('div',{className:"shd"},React.createElement('h3',null,"Income Sources")),
          React.createElement('table',{className:"tbl"},
            React.createElement('thead',null,React.createElement('tr',null,["Source","Freq.","Annual"].map(h=>React.createElement('th',{key:h,style:h==="Annual"?{textAlign:"right"}:{}},h)))),
            React.createElement('tbody',null,income.map(i=>{
              const mult=i.frequency==="monthly"?12:i.frequency==="quarterly"?4:1;
              return React.createElement('tr',{key:i.id},
                React.createElement('td',{style:{fontWeight:500}},i.label),
                React.createElement('td',{style:{fontSize:"0.78rem",color:"var(--muted)"}},i.frequency),
                React.createElement('td',{style:{textAlign:"right",color:"var(--accent)",fontWeight:600}},fmt(i.amount*mult))
              );
            }))
          )
        )
      ),
      React.createElement('div',{className:"card"},
        React.createElement('div',{className:"shd"},React.createElement('h3',null,"Bracket Breakdown"),React.createElement('span',{style:{fontSize:"0.75rem",color:"var(--muted)"}},`2024 Federal · ${taxFiling==="mfj"?"MFJ":"Single"}`)),
        taxCalc.breakdown.map((b,i)=>React.createElement('div',{key:i,style:{display:"flex",alignItems:"center",gap:14,marginBottom:10}},
          React.createElement('div',{style:{width:40,fontSize:"0.78rem",fontWeight:600,color:"var(--muted)",flexShrink:0}},`${(b.rate*100).toFixed(0)}%`),
          React.createElement('div',{className:"bar-track"},React.createElement('div',{className:"bar-fill",style:{width:`${Math.min(b.chunk/Math.max(taxCalc.taxable,1),1)*100}%`,background:`hsl(${12+i*18},68%,${50-i*4}%)`}})),
          React.createElement('div',{style:{width:80,textAlign:"right",fontSize:"0.78rem",color:"var(--muted)"}},fmt(b.chunk)),
          React.createElement('div',{style:{width:72,textAlign:"right",fontSize:"0.78rem",fontWeight:600,color:"var(--danger)"}},fmt(b.tax))
        )),
        React.createElement('div',{style:{marginTop:12,padding:12,background:"var(--warn-light)",borderRadius:8,fontSize:"0.76rem",color:"var(--warn)"}},
          "⚠️ Federal estimate only — excludes state taxes, FICA, AMT, and itemised deductions. Consult a tax professional for filing."
        )
      )
    ),

    // LOANS
    tab==="loans" && React.createElement('div',null,
      React.createElement('div',{style:{display:"flex",justifyContent:"flex-end",marginBottom:16}},
        React.createElement('button',{className:"btn btn-primary btn-sm",onClick:()=>setEditLoan(false)},"+ Add Loan")
      ),
      loans.map(loan=>{
        const amort   = buildAmort(loan.principal,loan.annualRate,loan.termMonths,loan.startDate);
        const paidOff = loan.principal - loan.balance;
        const totalInt= amort.rows.reduce((s,r)=>s+r.interest,0);
        const isOpen  = expandLoan===loan.id;
        const elapsed = amort.rows.findIndex(r=>r.balance<=loan.balance);
        const curRow  = amort.rows[Math.max(0,elapsed)]||amort.rows[0];
        const monthsLeft = Math.max(0, amort.rows.filter(r=>r.balance>0).length - elapsed);

        return React.createElement('div',{key:loan.id,className:"card",style:{marginBottom:16}},
          React.createElement('div',{className:"shd"},
            React.createElement('div',null,
              React.createElement('div',{style:{fontFamily:"'DM Serif Display',serif",fontSize:"1.1rem"}},loan.name),
              loan.notes&&React.createElement('div',{style:{fontSize:"0.74rem",color:"var(--muted)",marginTop:2}},"📝 ",loan.notes)
            ),
            React.createElement('div',{style:{display:"flex",gap:8}},
              React.createElement('button',{className:"btn btn-ghost btn-sm",onClick:()=>setExpandLoan(isOpen?null:loan.id)},isOpen?"▲ Hide":"▼ Schedule"),
              React.createElement('button',{className:"btn btn-ghost btn-sm",onClick:()=>setEditLoan(loan)},"Edit"),
              React.createElement('button',{className:"btn btn-ghost btn-sm",style:{color:"var(--danger)"},onClick:()=>delLoan(loan.id)},"Delete")
            )
          ),
          React.createElement('div',{style:{display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr",gap:20,alignItems:"center"}},
            React.createElement('div',{style:{display:"flex",gap:14,alignItems:"center"}},
              React.createElement(RingChart,{value:paidOff,max:loan.principal,color:"var(--accent)",size:90,label:"paid"}),
              React.createElement('div',{style:{fontSize:"0.8rem",display:"flex",flexDirection:"column",gap:5}},
                React.createElement('div',null,React.createElement('span',{className:"text-muted"},"Paid off "),React.createElement('span',{className:"fw6"},fmt(paidOff))),
                React.createElement('div',null,React.createElement('span',{className:"text-muted"},"Remaining "),React.createElement('span',{className:"fw6 text-danger"},fmt(loan.balance)))
              )
            ),
            React.createElement('div',{style:{fontSize:"0.82rem",display:"flex",flexDirection:"column",gap:5}},
              React.createElement('div',{className:"text-muted",style:{fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}},"Monthly Payment"),
              React.createElement('div',{style:{fontFamily:"'DM Serif Display',serif",fontSize:"1.3rem"}},fmt2(amort.payment)),
              React.createElement('div',{style:{fontSize:"0.73rem",color:"var(--muted)"}},`${loan.annualRate}% · ${loan.termMonths} mo · ~${monthsLeft} left`)
            ),
            React.createElement('div',{style:{fontSize:"0.82rem",display:"flex",flexDirection:"column",gap:5}},
              React.createElement('div',{className:"text-muted",style:{fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}},"This Month (est.)"),
              React.createElement('div',null,React.createElement('span',{className:"text-muted fs-sm"},"Principal "),React.createElement('span',{className:"fw6 text-accent"},fmt2(curRow.principal))),
              React.createElement('div',null,React.createElement('span',{className:"text-muted fs-sm"},"Interest "),React.createElement('span',{className:"fw6 text-danger"},fmt2(curRow.interest)))
            ),
            React.createElement('div',{style:{fontSize:"0.82rem",display:"flex",flexDirection:"column",gap:5}},
              React.createElement('div',{className:"text-muted",style:{fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.07em"}},"Lifetime Interest"),
              React.createElement('div',{style:{fontFamily:"'DM Serif Display',serif",fontSize:"1.1rem",color:"var(--danger)"}},fmt(totalInt)),
              React.createElement('div',{style:{fontSize:"0.73rem",color:"var(--muted)"}},`over ${loan.termMonths} months`)
            )
          ),
          isOpen&&React.createElement('div',null,
            React.createElement('div',{className:"div"}),
            React.createElement('div',{className:"shd"},React.createElement('h3',null,"Amortisation Schedule"),React.createElement('span',{style:{fontSize:"0.73rem",color:"var(--muted)"}},"First 36 months")),
            React.createElement('div',{className:"amort-wrap"},
              React.createElement('div',{className:"amort-row amort-head"},
                ["Mo.","Date","Payment","Principal","Interest","Balance"].map(h=>React.createElement('div',{key:h},h))
              ),
              amort.rows.slice(0,36).map(r=>React.createElement('div',{key:r.month,className:"amort-row",style:{background:r.month%2===0?"var(--bg)":"var(--surface)"}},
                React.createElement('div',{style:{textAlign:"left",fontWeight:500}},r.month),
                React.createElement('div',null,r.date),
                React.createElement('div',null,fmt2(r.payment)),
                React.createElement('div',{style:{color:"var(--accent)"}},fmt2(r.principal)),
                React.createElement('div',{style:{color:"var(--danger)"}},fmt2(r.interest)),
                React.createElement('div',{style:{fontWeight:600}},fmt2(r.balance))
              ))
            )
          )
        );
      }),
      loans.length===0&&React.createElement('div',{className:"card text-muted"},"No loans added yet."),
      loans.length>0&&React.createElement('div',{className:"card",style:{marginTop:16}},
        React.createElement('div',{className:"shd"},React.createElement('h3',null,"Portfolio Summary")),
        React.createElement('div',{style:{display:"flex",gap:36,flexWrap:"wrap"}},
          [["Total Balance",fmt(totalLoanBal),""],["Combined Monthly",fmt(totalLoanPmt),"text-danger"],["Lifetime Interest",fmt(loans.reduce((s,l)=>s+buildAmort(l.principal,l.annualRate,l.termMonths,l.startDate).rows.reduce((r,row)=>r+row.interest,0),0)),"text-danger"]].map(([k,v,c])=>
            React.createElement('div',{key:k},
              React.createElement('div',{style:{fontSize:"0.68rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--muted)",marginBottom:4}},k),
              React.createElement('div',{className:`serif ${c}`,style:{fontSize:"1.5rem",letterSpacing:"-0.02em"}},v)
            )
          )
        )
      )
    ),

    editItem!==null&&React.createElement(ItemModal,{item:editItem||null,onSave:saveItem,onClose:()=>setEditItem(null)}),
    editLoan!==null&&React.createElement(LoanModal,{loan:editLoan||null,onSave:saveLoan,onClose:()=>setEditLoan(null)})
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CALENDAR & TASKS
// ─────────────────────────────────────────────────────────────────────────────
function CalendarTasks({data, onChange}) {
  const tasks = data || [];
  const [newTask,setNewTask] = useState("");
  const [newDue,setNewDue]   = useState("");
  const [newPri,setNewPri]   = useState("medium");
  const [filter,setFilter]   = useState("all");

  const toggle = id => onChange(ts=>ts.map(t=>t.id===id?{...t,done:!t.done}:t));
  const del    = id => onChange(ts=>ts.filter(t=>t.id!==id));
  const add    = () => {
    if(!newTask.trim()) return;
    onChange(ts=>[...ts,{id:uid(),text:newTask,due:newDue,done:false,priority:newPri,created:ts()}]);
    setNewTask(""); setNewDue(""); setNewPri("medium");
  };

  const filtered = filter==="all"?tasks:filter==="done"?tasks.filter(t=>t.done):tasks.filter(t=>!t.done);
  const pCol = {high:"b-red",medium:"b-yellow",low:"b-gray"};
  const year=TODAY.getFullYear(), month=TODAY.getMonth();
  const firstDay=new Date(year,month,1).getDay(), daysInMonth=new Date(year,month+1,0).getDate();
  const cells=[]; for(let i=0;i<firstDay;i++)cells.push(null); for(let d=1;d<=daysInMonth;d++)cells.push(d);

  // days with tasks due this month
  const taskDays = new Set(tasks.filter(t=>t.due).map(t=>{ const d=new Date(t.due); return d.getFullYear()===year&&d.getMonth()===month?d.getDate():null; }).filter(Boolean));

  return React.createElement('div',null,
    React.createElement('div',{className:"page-title serif"},"Calendar & Tasks"),
    React.createElement('div',{className:"page-sub"},`${MONTHS[month]} ${year}`),
    React.createElement('div',{className:"g2"},
      React.createElement('div',{className:"card"},
        React.createElement('div',{className:"shd"},React.createElement('h3',null,`${MONTHS[month]} ${year}`)),
        React.createElement('div',{style:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}},
          ["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>React.createElement('div',{key:d,style:{fontSize:"0.63rem",fontWeight:600,textTransform:"uppercase",color:"var(--muted)",textAlign:"center",padding:"4px 0",letterSpacing:"0.05em"}},d)),
          cells.map((d,i)=>React.createElement('div',{key:i,style:{
            aspectRatio:1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",
            borderRadius:8,cursor:d?"pointer":"default",
            background:d===TODAY.getDate()?"var(--accent)":"transparent",
            color:d===TODAY.getDate()?"white":taskDays.has(d)?"var(--accent)":"inherit",
            fontWeight:(d===TODAY.getDate()||taskDays.has(d))?600:"normal",
            opacity:!d?0:1,
            outline:taskDays.has(d)&&d!==TODAY.getDate()?"2px solid var(--accent-light)":"none",
          }},d||""))
        )
      ),
      React.createElement('div',{className:"card"},
        React.createElement('div',{className:"shd"},React.createElement('h3',null,"Tasks"),
          React.createElement('div',{style:{display:"flex",gap:5}},
            ["all","active","done"].map(f=>React.createElement('button',{key:f,className:`pill ${filter===f?"on":""}`,style:{padding:"4px 10px",fontSize:"0.73rem"},onClick:()=>setFilter(f)},f.charAt(0).toUpperCase()+f.slice(1)))
          )
        ),
        filtered.length===0&&React.createElement('div',{style:{color:"var(--muted)",fontSize:"0.85rem",padding:"12px 0"}},"No tasks here."),
        filtered.map(t=>React.createElement('div',{key:t.id,style:{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 0",borderBottom:"1px solid var(--border)"}},
          React.createElement('div',{onClick:()=>toggle(t.id),style:{width:18,height:18,borderRadius:5,border:`2px solid ${t.done?"var(--accent)":"var(--border)"}`,background:t.done?"var(--accent)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,marginTop:1,color:"white",fontSize:"0.7rem"}},t.done?"✓":""),
          React.createElement('div',{style:{flex:1}},
            React.createElement('div',{style:{fontSize:"0.875rem",textDecoration:t.done?"line-through":"none",color:t.done?"var(--muted)":"inherit"}},t.text),
            React.createElement('div',{style:{fontSize:"0.72rem",color:"var(--muted)",marginTop:2}},t.due?`Due ${t.due} · `:"",React.createElement('span',{className:`badge ${pCol[t.priority]}`},t.priority))
          ),
          React.createElement('button',{className:"btn btn-ghost btn-sm",onClick:()=>del(t.id),style:{fontSize:"0.75rem"}},"🗑")
        )),
        React.createElement('div',{style:{marginTop:14,display:"flex",flexDirection:"column",gap:8}},
          React.createElement('input',{type:"text",placeholder:"Task description…",value:newTask,onChange:e=>setNewTask(e.target.value),onKeyDown:e=>e.key==="Enter"&&add()}),
          React.createElement('div',{style:{display:"flex",gap:8}},
            React.createElement('input',{type:"date",value:newDue,onChange:e=>setNewDue(e.target.value),style:{flex:1}}),
            React.createElement('select',{value:newPri,onChange:e=>setNewPri(e.target.value),style:{width:110}},
              ["high","medium","low"].map(p=>React.createElement('option',{key:p,value:p},p.charAt(0).toUpperCase()+p.slice(1)))
            ),
            React.createElement('button',{className:"btn btn-primary",onClick:add},"Add")
          )
        )
      )
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────
function Documents({data, onChange}) {
  const docs = data || [];
  const [search,setSearch]   = useState("");
  const [filter,setFilter]   = useState("All");
  const [addModal,setAddModal]= useState(false);
  const [newDoc,setNewDoc]   = useState({name:"",type:"pdf",tag:"Other",updated:new Date().toISOString().slice(0,10),notes:""});

  const tags = ["All",...Array.from(new Set(docs.map(d=>d.tag)))];
  const icons = {pdf:"📄",xls:"📊",doc:"📝",other:"📁"};
  const tagCol = {Taxes:"b-red",Insurance:"b-yellow",Finance:"b-green",Housing:"b-gray",Other:"b-gray"};
  const visible = docs.filter(d=>d.name.toLowerCase().includes(search.toLowerCase())&&(filter==="All"||d.tag===filter));

  const addDoc = () => { if(!newDoc.name.trim()) return; onChange(ds=>[...ds,{id:uid(),...newDoc}]); setNewDoc({name:"",type:"pdf",tag:"Other",updated:new Date().toISOString().slice(0,10),notes:""}); setAddModal(false); };
  const delDoc = id => onChange(ds=>ds.filter(d=>d.id!==id));

  return React.createElement('div',null,
    React.createElement('div',{className:"page-title serif"},"Documents & Notes"),
    React.createElement('div',{className:"page-sub"},"Your important files, all in one place"),
    React.createElement('div',{style:{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap",alignItems:"center"}},
      React.createElement('input',{type:"text",placeholder:"Search…",value:search,onChange:e=>setSearch(e.target.value),style:{maxWidth:260}}),
      React.createElement('div',{className:"pill-row",style:{marginBottom:0}},tags.map(t=>React.createElement('button',{key:t,className:`pill ${filter===t?"on":""}`,onClick:()=>setFilter(t)},t))),
      React.createElement('button',{className:"btn btn-primary btn-sm",style:{marginLeft:"auto"},onClick:()=>setAddModal(true)},"+ Add")
    ),
    React.createElement('div',{className:"card"},
      visible.length===0&&React.createElement('div',{style:{color:"var(--muted)",fontSize:"0.875rem",padding:"12px 0"}},"No documents found."),
      visible.map(d=>React.createElement('div',{key:d.id,style:{display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:"1px solid var(--border)"}},
        React.createElement('div',{style:{fontSize:"1.4rem",width:36,textAlign:"center"}},icons[d.type]||"📁"),
        React.createElement('div',{style:{flex:1}},
          React.createElement('div',{style:{fontSize:"0.875rem",fontWeight:500}},d.name),
          React.createElement('div',{style:{fontSize:"0.72rem",color:"var(--muted)",marginTop:2}},`Updated ${d.updated} · `,React.createElement('span',{className:`badge ${tagCol[d.tag]||"b-gray"}`},d.tag)),
          d.notes&&React.createElement('div',{style:{fontSize:"0.75rem",color:"var(--muted)",marginTop:2}},d.notes)
        ),
        React.createElement('button',{className:"btn btn-ghost btn-sm",style:{color:"var(--danger)"},onClick:()=>delDoc(d.id)},"🗑")
      ))
    ),
    addModal&&React.createElement('div',{className:"overlay",onClick:e=>e.target===e.currentTarget&&setAddModal(false)},
      React.createElement('div',{className:"modal"},
        React.createElement('div',{className:"modal-title"},"Add Document Reference"),
        React.createElement('div',{className:"field"},React.createElement('label',null,"File Name"),React.createElement('input',{type:"text",value:newDoc.name,onChange:e=>setNewDoc(p=>({...p,name:e.target.value})),placeholder:"e.g. Tax Return 2025.pdf"})),
        React.createElement('div',{className:"frow"},
          React.createElement('div',{className:"field"},React.createElement('label',null,"Type"),React.createElement('select',{value:newDoc.type,onChange:e=>setNewDoc(p=>({...p,type:e.target.value}))},["pdf","doc","xls","other"].map(t=>React.createElement('option',{key:t,value:t},t.toUpperCase())))),
          React.createElement('div',{className:"field"},React.createElement('label',null,"Tag"),React.createElement('input',{type:"text",value:newDoc.tag,onChange:e=>setNewDoc(p=>({...p,tag:e.target.value})),placeholder:"Taxes, Insurance…"}))
        ),
        React.createElement('div',{className:"field"},React.createElement('label',null,"Date Updated"),React.createElement('input',{type:"date",value:newDoc.updated,onChange:e=>setNewDoc(p=>({...p,updated:e.target.value}))})),
        React.createElement('div',{className:"field"},React.createElement('label',null,"Notes"),React.createElement('textarea',{value:newDoc.notes,onChange:e=>setNewDoc(p=>({...p,notes:e.target.value})),placeholder:"Where is this file stored? Policy number? Expiry?"})),
        React.createElement('div',{className:"modal-footer"},
          React.createElement('button',{className:"btn btn-ghost",onClick:()=>setAddModal(false)},"Cancel"),
          React.createElement('button',{className:"btn btn-primary",onClick:addDoc},"Add")
        )
      )
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STAY CURRENT
// ─────────────────────────────────────────────────────────────────────────────
function StayCurrent({data, onChange}) {
  const feed = data || [];
  const [filter,setFilter] = useState("All");
  const [addModal,setAddModal] = useState(false);
  const [newItem,setNewItem] = useState({source:"",title:"",desc:"",tag:"Finance"});

  const tags = ["All",...Array.from(new Set(feed.map(f=>f.tag)))];
  const mark  = id => onChange(fs=>fs.map(f=>f.id===id?{...f,read:true}:f));
  const del   = id => onChange(fs=>fs.filter(f=>f.id!==id));
  const add   = () => { if(!newItem.title.trim()) return; onChange(fs=>[{id:uid(),...newItem,read:false,saved:ts()},...fs]); setNewItem({source:"",title:"",desc:"",tag:"Finance"}); setAddModal(false); };

  const visible = filter==="All"?feed:feed.filter(f=>f.tag===filter);
  const unread  = feed.filter(f=>!f.read).length;

  return React.createElement('div',null,
    React.createElement('div',{className:"page-title serif"},"Stay Current"),
    React.createElement('div',{className:"page-sub"},`${unread} unread · News & learning to keep you sharp`),
    React.createElement('div',{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}},
      React.createElement('div',{className:"pill-row",style:{marginBottom:0}},tags.map(t=>React.createElement('button',{key:t,className:`pill ${filter===t?"on":""}`,onClick:()=>setFilter(t)},t))),
      React.createElement('button',{className:"btn btn-primary btn-sm",onClick:()=>setAddModal(true)},"+ Add Item")
    ),
    React.createElement('div',{className:"card"},
      visible.length===0&&React.createElement('div',{style:{color:"var(--muted)",fontSize:"0.875rem",padding:"12px 0"}},"Nothing here yet."),
      visible.map(item=>React.createElement('div',{key:item.id,style:{padding:"16px 0",borderBottom:"1px solid var(--border)",opacity:item.read?0.5:1}},
        React.createElement('div',{style:{fontSize:"0.67rem",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--muted)",marginBottom:4}},item.source),
        React.createElement('div',{style:{fontSize:"0.9rem",fontWeight:500,marginBottom:4,lineHeight:1.4}},item.title),
        React.createElement('div',{style:{fontSize:"0.78rem",color:"var(--muted)",lineHeight:1.5}},item.desc),
        React.createElement('div',{style:{marginTop:8,display:"flex",gap:8,alignItems:"center"}},
          React.createElement('span',{className:"badge b-gray"},item.tag),
          !item.read&&React.createElement('button',{className:"btn btn-ghost btn-sm",style:{fontSize:"0.7rem",padding:"2px 10px"},onClick:()=>mark(item.id)},"Mark read"),
          React.createElement('button',{className:"btn btn-ghost btn-sm",style:{fontSize:"0.7rem",padding:"2px 10px",color:"var(--danger)"},onClick:()=>del(item.id)},"Remove")
        )
      ))
    ),
    addModal&&React.createElement('div',{className:"overlay",onClick:e=>e.target===e.currentTarget&&setAddModal(false)},
      React.createElement('div',{className:"modal"},
        React.createElement('div',{className:"modal-title"},"Add to Feed"),
        React.createElement('div',{className:"frow"},
          React.createElement('div',{className:"field"},React.createElement('label',null,"Source"),React.createElement('input',{type:"text",value:newItem.source,onChange:e=>setNewItem(p=>({...p,source:e.target.value})),placeholder:"e.g. IRS, Coursera…"})),
          React.createElement('div',{className:"field"},React.createElement('label',null,"Tag"),React.createElement('input',{type:"text",value:newItem.tag,onChange:e=>setNewItem(p=>({...p,tag:e.target.value})),placeholder:"Finance, Learning…"}))
        ),
        React.createElement('div',{className:"field"},React.createElement('label',null,"Title"),React.createElement('input',{type:"text",value:newItem.title,onChange:e=>setNewItem(p=>({...p,title:e.target.value})),placeholder:"Article or course title"})),
        React.createElement('div',{className:"field"},React.createElement('label',null,"Description"),React.createElement('textarea',{value:newItem.desc,onChange:e=>setNewItem(p=>({...p,desc:e.target.value})),placeholder:"Brief summary…"})),
        React.createElement('div',{className:"modal-footer"},
          React.createElement('button',{className:"btn btn-ghost",onClick:()=>setAddModal(false)},"Cancel"),
          React.createElement('button',{className:"btn btn-primary",onClick:add},"Add")
        )
      )
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA MANAGER (Import / Export)
// ─────────────────────────────────────────────────────────────────────────────
function DataManager({data, onImport, onClose}) {
  const [drag,setDrag] = useState(false);
  const [error,setError] = useState("");

  const handleFile = file => {
    importJSON(file, imported=>{ onImport(imported); onClose(); }, setError);
  };
  const handleDrop = e => { e.preventDefault(); setDrag(false); const f=e.dataTransfer.files[0]; if(f) handleFile(f); };

  return React.createElement('div',{className:"overlay",onClick:e=>e.target===e.currentTarget&&onClose()},
    React.createElement('div',{className:"modal"},
      React.createElement('div',{className:"modal-title"},"Data & Backup"),

      React.createElement('div',{style:{marginBottom:24}},
        React.createElement('div',{style:{fontSize:"0.8rem",fontWeight:600,color:"var(--muted)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}},"Export"),
        React.createElement('p',{style:{fontSize:"0.85rem",color:"var(--muted)",marginBottom:12}},"Download all your data as a JSON file. Keep this somewhere safe — it's your only backup."),
        React.createElement('button',{className:"btn btn-primary",onClick:()=>exportJSON(data)},"⬇ Download mylife-os-backup.json")
      ),

      React.createElement('div',{className:"div"}),

      React.createElement('div',null,
        React.createElement('div',{style:{fontSize:"0.8rem",fontWeight:600,color:"var(--muted)",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}},"Import"),
        React.createElement('p',{style:{fontSize:"0.85rem",color:"var(--muted)",marginBottom:12}},"Load a previously exported JSON file. This will replace all current data."),
        React.createElement('div',{
          className:`dropzone ${drag?"drag":""}`,
          onDragOver:e=>{e.preventDefault();setDrag(true)},
          onDragLeave:()=>setDrag(false),
          onDrop:handleDrop,
          onClick:()=>document.getElementById('file-input').click()
        },
          React.createElement('div',{style:{fontSize:"1.5rem",marginBottom:8}},"📂"),
          React.createElement('div',null,"Drop your JSON file here, or click to browse"),
          React.createElement('input',{id:"file-input",type:"file",accept:".json",style:{display:"none"},onChange:e=>{ if(e.target.files[0]) handleFile(e.target.files[0]); }})
        ),
        error&&React.createElement('div',{style:{marginTop:8,color:"var(--danger)",fontSize:"0.82rem"}},error)
      ),

      React.createElement('div',{className:"div"}),
      React.createElement('div',{style:{fontSize:"0.78rem",color:"var(--muted)"}},
        `Version ${data.version||"1.0.0"} · Last saved: ${data.lastSaved ? new Date(data.lastSaved).toLocaleString() : "never"}`
      ),
      React.createElement('div',{className:"modal-footer"},
        React.createElement('button',{className:"btn btn-ghost",onClick:onClose},"Close")
      )
    )
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────────────────────────────────────
const NAV = [
  {id:"finance",  label:"Finance",          icon:"💰"},
  {id:"calendar", label:"Calendar & Tasks", icon:"📅"},
  {id:"docs",     label:"Documents",        icon:"📁"},
  {id:"current",  label:"Stay Current",     icon:"📡"},
];

function App() {
  const [active,   setActive]   = useState("finance");
  const [appData,  setAppData]  = useState(()=>{ try { const s=localStorage.getItem(DATA_KEY); return s?JSON.parse(s):DEFAULT_DATA; } catch(e){ return DEFAULT_DATA; } });
  const [dataModal,setDataModal]= useState(false);
  const [toast,    setToast]    = useState(null);
  const [dirty,    setDirty]    = useState(false);

  // Sync to localStorage on every change (as a cache / session restore)
  useEffect(()=>{
    try { localStorage.setItem(DATA_KEY, JSON.stringify(appData)); setDirty(true); } catch(e){}
  },[appData]);

  const update = useCallback(fn=>{
    setAppData(prev=>{
      const next = typeof fn==="function" ? fn(prev) : fn;
      return next;
    });
  },[]);

  const handleExport = () => {
    const withTs = {...appData, lastSaved:ts()};
    setAppData(withTs);
    exportJSON(withTs);
    setToast("✓ Backup downloaded");
    setDirty(false);
  };

  const handleImport = imported => {
    setAppData({...DEFAULT_DATA,...imported,version:APP_VERSION});
    setToast("✓ Data imported successfully");
    setDirty(false);
  };

  // Finance updater
  const updateFinance = fn => update(d=>({...d,finance:typeof fn==="function"?fn(d.finance):fn}));
  // Tasks updater
  const updateTasks = fn => update(d=>({...d,tasks:typeof fn==="function"?fn(d.tasks):fn}));
  // Docs updater
  const updateDocs  = fn => update(d=>({...d,docs:typeof fn==="function"?fn(d.docs):fn}));
  // Feed updater
  const updateFeed  = fn => update(d=>({...d,feed:typeof fn==="function"?fn(d.feed):fn}));

  const pages = {
    finance:  React.createElement(Finance, {data:appData.finance, onChange:updateFinance}),
    calendar: React.createElement(CalendarTasks, {data:appData.tasks, onChange:updateTasks}),
    docs:     React.createElement(Documents, {data:appData.docs, onChange:updateDocs}),
    current:  React.createElement(StayCurrent, {data:appData.feed, onChange:updateFeed}),
  };

  return React.createElement('div',{className:"layout"},
    // Sidebar
    React.createElement('aside',{className:"sidebar"},
      React.createElement('div',{className:"logo"},"MyLife OS"),
      React.createElement('div',{className:"logo-sub"},"Personal Dashboard"),
      NAV.map(n=>React.createElement('button',{key:n.id,className:`nav-item ${active===n.id?"active":""}`,onClick:()=>setActive(n.id)},
        React.createElement('span',{style:{width:20,textAlign:"center"}},n.icon),n.label
      )),
      React.createElement('div',{style:{marginTop:"auto"}}),
      React.createElement('div',{className:"div",style:{margin:"12px 0"}}),
      React.createElement('button',{className:"nav-item",onClick:handleExport},
        React.createElement('span',{style:{width:20,textAlign:"center"}},"⬇"),
        React.createElement('span',null,"Save Backup",dirty&&React.createElement('span',{style:{width:6,height:6,borderRadius:"50%",background:"var(--warn)",display:"inline-block",marginLeft:6,verticalAlign:"middle"},title:"Unsaved changes"}))
      ),
      React.createElement('button',{className:"nav-item",onClick:()=>setDataModal(true)},
        React.createElement('span',{style:{width:20,textAlign:"center"}},"🗄"),
        "Data & Import"
      ),
      React.createElement('div',{style:{fontSize:"0.7rem",color:"var(--muted)",padding:"8px 12px"}},
        TODAY.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})
      )
    ),

    // Main
    React.createElement('main',{className:"main",style:{paddingBottom:32}},pages[active]),

    // Modals & Toast
    dataModal&&React.createElement(DataManager,{data:appData,onImport:handleImport,onClose:()=>setDataModal(false)}),
    toast&&React.createElement(Toast,{msg:toast,onDone:()=>setToast(null)})
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
