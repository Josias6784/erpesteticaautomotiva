import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Users, Car, CalendarDays, ClipboardList, Package,
  Wrench, DollarSign, BarChart2, Settings, Plus, Search,
  X, Check, Clock, Edit2, Trash2, Eye, ChevronLeft, ChevronRight,
  Star, Phone, Mail, MapPin, CreditCard, Banknote, QrCode,
  TrendingUp, TrendingDown, CheckCircle2, User, Hash,
  AlertTriangle, List, Calendar, Upload, Palette, Tag, Menu,
  ChevronDown, Columns, LogOut
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ── THEMES ─────────────────────────────────────────────────────── */
const THEMES = [
  { id:"laranja", label:"🔥 Laranja", accent:"#f97316", accentd:"#ea6700", bg:"#0f0f0f", surface:"#1a1a1a", card:"#222", border:"#2a2a2a", border2:"#333", text:"#f4f4f4", text2:"#aaa", text3:"#666" },
  { id:"azul",    label:"💙 Azul",    accent:"#3b82f6", accentd:"#2563eb", bg:"#0a0e1a", surface:"#111827", card:"#1a2233", border:"#1e2d45", border2:"#253553", text:"#f0f4ff", text2:"#94a3b8", text3:"#4b5e7a" },
  { id:"roxo",    label:"💜 Roxo",    accent:"#a855f7", accentd:"#9333ea", bg:"#0d0a14", surface:"#150f20", card:"#1c1328", border:"#2a1a40", border2:"#35234d", text:"#f3eeff", text2:"#b08ad0", text3:"#6b4e8a" },
  { id:"verde",   label:"💚 Verde",   accent:"#22c55e", accentd:"#16a34a", bg:"#080f0a", surface:"#0f1a12", card:"#162118", border:"#1a2e1e", border2:"#223d28", text:"#eefff2", text2:"#86b896", text3:"#3d6b4a" },
  { id:"vermelho",label:"❤️ Vermelho",accent:"#ef4444", accentd:"#dc2626", bg:"#120808", surface:"#1c1010", card:"#221515", border:"#3a1414", border2:"#4d1f1f", text:"#fff0f0", text2:"#cc8888", text3:"#7a4040" },
  { id:"ciano",   label:"🩵 Ciano",   accent:"#06b6d4", accentd:"#0891b2", bg:"#050f14", surface:"#091820", card:"#0f2230", border:"#0e2d3d", border2:"#163a4d", text:"#e8faff", text2:"#7ab8c8", text3:"#3a6878" },
  { id:"rosa",    label:"🩷 Rosa",    accent:"#ec4899", accentd:"#db2777", bg:"#14080f", surface:"#1e1018", card:"#281420", border:"#3d1530", border2:"#4d1e3d", text:"#ffeef8", text2:"#cc7aaa", text3:"#7a3a60" },
  { id:"dourado", label:"✨ Dourado", accent:"#eab308", accentd:"#ca9800", bg:"#0f0d00", surface:"#1a1700", card:"#221f00", border:"#332d00", border2:"#4d4400", text:"#fffde8", text2:"#c8b866", text3:"#7a7030" },
  { id:"teal",    label:"🌊 Teal",    accent:"#14b8a6", accentd:"#0d9488", bg:"#050f0e", surface:"#091818", card:"#0f2220", border:"#0e2d2b", border2:"#163d3a", text:"#e8fff8", text2:"#7ab8b0", text3:"#3a6860" },
  { id:"claro",   label:"☀️ Claro",   accent:"#f97316", accentd:"#ea6700", bg:"#f5f5f5", surface:"#ffffff", card:"#ffffff", border:"#e0e0e0", border2:"#d0d0d0", text:"#111111", text2:"#555555", text3:"#999999" },
];

function makeCSS(t) {
  return `
    :root {
      --accent:${t.accent}; --accentd:${t.accentd};
      --bg:${t.bg}; --surface:${t.surface}; --card:${t.card};
      --border:${t.border}; --border2:${t.border2};
      --text:${t.text}; --text2:${t.text2}; --text3:${t.text3};
    }
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:var(--bg);color:var(--text);font-family:'Sora',sans-serif;min-height:100vh;}
    input,select,textarea{background:var(--surface);color:var(--text);border:1px solid var(--border2);border-radius:8px;padding:9px 12px;font-size:13px;font-family:'Sora',sans-serif;outline:none;transition:.15s;}
    input:focus,select:focus,textarea:focus{border-color:var(--accent);}
    button{cursor:pointer;font-family:'Sora',sans-serif;}
    table{border-collapse:collapse;width:100%;}
    th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--border);}
    th{font-size:11px;text-transform:uppercase;color:var(--text3);font-weight:600;letter-spacing:.5px;}
    ::-webkit-scrollbar{width:5px;height:5px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}
    .anim-in{animation:fadeUp .25s ease;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
    .cal-cell:hover{background:color-mix(in srgb,var(--accent) 10%,var(--card))!important;border-color:var(--accent)!important;}
    @media(max-width:700px){.hide-sm{display:none!important;}.stack-sm{flex-direction:column!important;}.full-sm{width:100%!important;}}
  `;
}

/* ── MOCK DATA ───────────────────────────────────────────────────── */
const td = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const yd = () => { const d=new Date(); d.setDate(d.getDate()-1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };

const INIT_CLIENTES = [
  {id:1,nome:"Rafael Souza",cpf:"123.456.789-00",tel:"(91)99123-4567",email:"rafael@email.com",cidade:"Belém/PA",pontos:320,visitCount:4,lastVisit:"2026-02-20",since:"2023-01-10"},
  {id:2,nome:"Fernanda Lima",cpf:"234.567.890-11",tel:"(91)98765-4321",email:"fernanda@email.com",cidade:"Belém/PA",pontos:150,visitCount:2,lastVisit:"2026-02-15",since:"2023-06-20"},
  {id:3,nome:"Carlos Mendes",cpf:"456.789.123-00",tel:"(91)97654-3210",email:"carlos@email.com",cidade:"Ananindeua/PA",pontos:480,visitCount:7,lastVisit:"2026-02-22",since:"2022-11-05"},
  {id:4,nome:"Juliana Costa",cpf:"567.890.234-33",tel:"(91)96543-2109",email:"juliana@email.com",cidade:"Belém/PA",pontos:90,visitCount:1,lastVisit:"2026-01-30",since:"2024-03-12"},
  {id:5,nome:"Marcos Pereira",cpf:"678.901.345-44",tel:"(91)95432-1098",email:"marcos@email.com",cidade:"Castanhal/PA",pontos:210,visitCount:3,lastVisit:"2026-02-18",since:"2023-08-01"},
];
const INIT_VEICULOS = [
  {id:1,clienteId:1,placa:"ABC-1234",tipo:"Carro",marca:"Toyota",modelo:"Corolla",ano:2020,cor:"Prata",obs:""},
  {id:2,clienteId:2,placa:"DEF-5678",tipo:"SUV/Pickup",marca:"Honda",modelo:"HRV",ano:2022,cor:"Branco",obs:""},
  {id:3,clienteId:2,placa:"GHI-9012",tipo:"Carro",marca:"Fiat",modelo:"Argo",ano:2021,cor:"Vermelho",obs:""},
  {id:4,clienteId:3,placa:"JKL-3456",tipo:"SUV/Pickup",marca:"Jeep",modelo:"Compass",ano:2023,cor:"Preto",obs:""},
  {id:5,clienteId:5,placa:"MNO-7890",tipo:"Moto",marca:"Honda",modelo:"CB500",ano:2019,cor:"Azul",obs:""},
];
const INIT_SERVICOS = [
  {id:1,nome:"Lavagem Simples",categoria:"Lavagem",precos:{Carro:60,Moto:35,"SUV/Pickup":80,"Van/Kombi":90,Caminhão:120,Barco:200,Quadriciclo:50,Outro:70},pontosPorReal:1,ativo:true},
  {id:2,nome:"Polimento Completo",categoria:"Polimento",precos:{Carro:450,Moto:200,"SUV/Pickup":550,"Van/Kombi":600,Caminhão:800,Barco:1200,Quadriciclo:250,Outro:400},pontosPorReal:2,ativo:true},
  {id:3,nome:"Vitrificação",categoria:"Proteção",precos:{Carro:1000,Moto:600,"SUV/Pickup":1200,"Van/Kombi":1400,Caminhão:1800,Barco:2500,Quadriciclo:700,Outro:900},pontosPorReal:3,ativo:true},
  {id:4,nome:"Higienização Interna",categoria:"Higienização",precos:{Carro:50,Moto:30,"SUV/Pickup":70,"Van/Kombi":90,Caminhão:110,Barco:150,Quadriciclo:40,Outro:60},pontosPorReal:1,ativo:true},
  {id:5,nome:"Película Protetora",categoria:"Proteção",precos:{Carro:800,Moto:300,"SUV/Pickup":1000,"Van/Kombi":1200,Caminhão:1500,Barco:2000,Quadriciclo:400,Outro:700},pontosPorReal:2,ativo:true},
  {id:6,nome:"Cristalização",categoria:"Polimento",precos:{Carro:350,Moto:150,"SUV/Pickup":420,"Van/Kombi":480,Caminhão:600,Barco:900,Quadriciclo:180,Outro:300},pontosPorReal:1,ativo:true},
  {id:7,nome:"Pintura de Roda",categoria:"Personalização",precos:{Carro:200,Moto:120,"SUV/Pickup":240,"Van/Kombi":240,Caminhão:320,Barco:400,Quadriciclo:120,Outro:200},pontosPorReal:1,ativo:true},
];
const INIT_COLABORADORES = [
  {id:1,nome:"Alex Santos",cargo:"Detailer Senior",tel:"(91)99111-2222",email:"alex@estetica.com",ativo:true},
  {id:2,nome:"Bruno Matos",cargo:"Detailer",tel:"(91)99222-3333",email:"bruno@estetica.com",ativo:true},
  {id:3,nome:"Camila Rocha",cargo:"Gerente",tel:"(91)99333-4444",email:"camila@estetica.com",ativo:true},
  {id:4,nome:"Diego Ferreira",cargo:"Assistente",tel:"(91)99444-5555",email:"diego@estetica.com",ativo:true},
];
const INIT_ESTOQUE = [
  {id:1,nome:"Shampoo Automotivo 5L",categoria:"Lavagem",quantidade:8,minimo:3,unidade:"un",custo:45,obs:""},
  {id:2,nome:"Cera Carnaúba 500g",categoria:"Polimento",quantidade:5,minimo:2,unidade:"un",custo:80,obs:""},
  {id:3,nome:"Microfibra 40x40",categoria:"Acessórios",quantidade:25,minimo:10,unidade:"un",custo:12,obs:""},
  {id:4,nome:"Detergente Neutro 1L",categoria:"Lavagem",quantidade:2,minimo:5,unidade:"un",custo:18,obs:"Estoque baixo!"},
  {id:5,nome:"Esponja de Polimento",categoria:"Polimento",quantidade:12,minimo:4,unidade:"un",custo:22,obs:""},
  {id:6,nome:"Removedor de Insetos 500ml",categoria:"Lavagem",quantidade:3,minimo:3,unidade:"un",custo:35,obs:""},
  {id:7,nome:"Argila Automotiva 200g",categoria:"Polimento",quantidade:4,minimo:2,unidade:"un",custo:55,obs:""},
  {id:8,nome:"Verniz Automotivo 1L",categoria:"Pintura",quantidade:1,minimo:3,unidade:"un",custo:95,obs:"Estoque crítico!"},
];
const INIT_OS = [
  {id:101,clienteId:1,veiculoId:1,colaboradorId:1,boxId:1,agendamentoId:null,servicos:[{servicoId:2,preco:450},{servicoId:6,preco:350}],status:"Finalizado",entrada:"2026-02-20",saida:"2026-02-20",pagamento:"PIX",valorTotal:800,desconto:0,obs:""},
  {id:102,clienteId:3,veiculoId:4,colaboradorId:2,boxId:2,agendamentoId:null,servicos:[{servicoId:1,preco:80}],status:"Entregue",entrada:"2026-02-22",saida:"2026-02-22",pagamento:"Cartão Débito",valorTotal:80,desconto:0,obs:""},
  {id:103,clienteId:2,veiculoId:3,colaboradorId:4,boxId:1,agendamentoId:null,servicos:[{servicoId:3,preco:1000}],status:"Em Execução",entrada:td(),saida:null,pagamento:null,valorTotal:1000,desconto:50,obs:"Cliente VIP"},
  {id:104,clienteId:5,veiculoId:null,colaboradorId:3,boxId:null,agendamentoId:null,servicos:[{servicoId:4,preco:50}],status:"Aguardando",entrada:td(),saida:null,pagamento:null,valorTotal:50,desconto:0,obs:""},
];
const INIT_AGENDAMENTOS = [
  {id:201,clienteId:1,veiculoId:1,servicoId:2,colaboradorId:1,data:td(),hora:"09:00",status:"Confirmado",obs:"",convertidoOS:false},
  {id:202,clienteId:4,veiculoId:2,servicoId:1,colaboradorId:2,data:td(),hora:"14:00",status:"Aguardando",obs:"",convertidoOS:false},
  {id:203,clienteId:3,veiculoId:4,servicoId:5,colaboradorId:1,data:yd(),hora:"10:00",status:"Confirmado",obs:"",convertidoOS:true},
];
const INIT_FINANCEIRO = [
  {id:301,tipo:"Entrada",descricao:"OS #101 - Rafael",valor:800,data:"2026-02-20",categoria:"Serviço",osId:101},
  {id:302,tipo:"Entrada",descricao:"OS #102 - Carlos",valor:80,data:"2026-02-22",categoria:"Serviço",osId:102},
  {id:303,tipo:"Saida",descricao:"Compra de insumos",valor:320,data:"2026-02-18",categoria:"Estoque",osId:null},
  {id:304,tipo:"Saida",descricao:"Conta de energia",valor:480,data:"2026-02-01",categoria:"Fixo",osId:null},
  {id:305,tipo:"Entrada",descricao:"OS #100 - Fernanda",valor:450,data:"2026-02-10",categoria:"Serviço",osId:null},
];
const MESES_RECEITA = [
  {mes:"Set",receita:4200,despesa:2100},{mes:"Out",receita:5800,despesa:2400},
  {mes:"Nov",receita:6200,despesa:2800},{mes:"Dez",receita:7500,despesa:3100},
  {mes:"Jan",receita:5300,despesa:2200},{mes:"Fev",receita:6800,despesa:2600},
];

/* ── HELPERS ─────────────────────────────────────────────────────── */
const fmtDate = s => { if(!s) return "—"; const [y,m,d]=s.split("-"); return `${d}/${m}/${y}`; };
const fmtCurr = v => `R$${(+v||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const STATUS_COLORS = {
  "Aguardando":"#eab308","Em Execução":"#3b82f6","Finalizado":"#22c55e","Entregue":"#8b5cf6","Cancelado":"#ef4444"
};
const MONTH_NAMES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DAY_NAMES = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const BASE_VEHICLE_TYPES = ["Carro","Moto","SUV/Pickup","Van/Kombi","Caminhão","Barco","Quadriciclo","Outro"];
const PAG_OPTS = ["PIX","Cartão Crédito","Cartão Débito","Dinheiro","Transferência"];

function gerarSlots(abertura, fechamento, intervalo) {
  const slots = [];
  const [ah, am] = abertura.split(":").map(Number);
  const [fh, fm] = fechamento.split(":").map(Number);
  let cur = ah * 60 + (am||0);
  const end = fh * 60 + (fm||0);
  while(cur < end) {
    slots.push(`${String(Math.floor(cur/60)).padStart(2,"0")}:${String(cur%60).padStart(2,"0")}`);
    cur += intervalo;
  }
  return slots;
}

/* ── UI PRIMITIVES ───────────────────────────────────────────────── */
function Btn({children, variant="primary", small, style, ...p}) {
  const base = {
    display:"inline-flex",alignItems:"center",gap:6,padding:small?"6px 12px":"9px 18px",
    borderRadius:9,border:"none",fontWeight:600,fontSize:small?11:13,
    transition:"all .15s",fontFamily:"'Sora',sans-serif",whiteSpace:"nowrap",
  };
  const variants = {
    primary:{background:"var(--accent)",color:"#fff"},
    secondary:{background:"var(--surface)",color:"var(--text)",border:"1px solid var(--border2)"},
    ghost:{background:"transparent",color:"var(--text2)",border:"1px solid var(--border)"},
    danger:{background:"rgba(239,68,68,.12)",color:"#ef4444",border:"1px solid rgba(239,68,68,.2)"},
  };
  return <button style={{...base,...variants[variant],...style}} {...p}>{children}</button>;
}

function Input({label, style, ...p}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:4,...style}}>
      {label && <label style={{fontSize:11,fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.5}}>{label}</label>}
      <input style={{width:"100%"}} {...p}/>
    </div>
  );
}

function Select({label, children, style, ...p}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:4,...style}}>
      {label && <label style={{fontSize:11,fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.5}}>{label}</label>}
      <select style={{width:"100%"}} {...p}>{children}</select>
    </div>
  );
}

function Card({children, style}) {
  return <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:14,padding:"16px 20px",...style}}>{children}</div>;
}

function Modal({title, onClose, children, width=540}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16}} onClick={onClose}>
      <div style={{background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,width:"100%",maxWidth:width,maxHeight:"88vh",display:"flex",flexDirection:"column",overflow:"hidden",animation:"fadeUp .2s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 20px",borderBottom:"1px solid var(--border)"}}>
          <div style={{fontWeight:700,fontSize:15}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:"var(--text2)",cursor:"pointer",padding:4,display:"flex",alignItems:"center"}}><X size={18}/></button>
        </div>
        <div style={{padding:"20px",overflowY:"auto",flex:1}}>{children}</div>
      </div>
    </div>
  );
}

function Badge({children, color="#666"}) {
  return <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:20,padding:"2px 10px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>;
}

function Empty({icon:Icon=Package,msg="Nenhum registro"}) {
  return (
    <div style={{textAlign:"center",padding:"48px 24px",color:"var(--text3)"}}>
      <Icon size={40} style={{opacity:.3,marginBottom:12}}/>
      <div style={{fontSize:13}}>{msg}</div>
    </div>
  );
}

function StatCard({icon:Icon,label,value,color="var(--accent)",sub}) {
  return (
    <Card style={{display:"flex",alignItems:"center",gap:14}}>
      <div style={{width:42,height:42,borderRadius:12,background:color+"22",color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <Icon size={18}/>
      </div>
      <div>
        <div style={{fontSize:11,color:"var(--text3)",fontWeight:500}}>{label}</div>
        <div style={{fontSize:22,fontWeight:800}}>{value}</div>
        {sub && <div style={{fontSize:10,color:"var(--text3)"}}>{sub}</div>}
      </div>
    </Card>
  );
}

/* ── MONTH CALENDAR ──────────────────────────────────────────────── */
function MonthCalendar({year, month, events=[], onDayClick, renderEvent}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const todayStr = td();
  const cells = [];
  for(let i=0; i<firstDay; i++) cells.push(null);
  for(let d=1; d<=daysInMonth; d++) cells.push(d);
  while(cells.length % 7 !== 0) cells.push(null);

  return (
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
      {DAY_NAMES.map(d=>(
        <div key={d} style={{textAlign:"center",fontSize:10,fontWeight:700,color:"var(--text3)",padding:"6px 0",textTransform:"uppercase"}}>{d}</div>
      ))}
      {cells.map((d,i)=>{
        const str = d ? `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}` : null;
        const isToday = str === todayStr;
        const dayEvents = str ? events.filter(e=>e.date===str) : [];
        return (
          <div key={i} className={d&&onDayClick?"cal-cell":""} onClick={()=>d&&onDayClick&&onDayClick(str)}
            style={{minHeight:72,background:d?"var(--card)":"transparent",border:d?`1px solid ${isToday?"var(--accent)":"var(--border)"}`:"none",borderRadius:8,padding:d?"4px":0,cursor:d&&onDayClick?"pointer":"default",position:"relative"}}>
            {d && (
              <div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                  {onDayClick ? <span style={{fontSize:9,color:"var(--accent)",opacity:.5}}>+</span> : <span/>}
                  <span style={{fontSize:11,fontWeight:isToday?800:500,color:isToday?"var(--accent)":"var(--text2)"}}>{d}</span>
                </div>
                {dayEvents.slice(0,2).map((ev,ei)=>renderEvent ? renderEvent(ev,ei) : null)}
                {dayEvents.length>2 && <div style={{fontSize:9,color:"var(--text3)",textAlign:"center"}}>+{dayEvents.length-2}</div>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── DASHBOARD ───────────────────────────────────────────────────── */
function Dashboard({os, clientes, agendamentos, estoque, financeiro, isMobile}) {
  const hoje = td();
  const agHoje = agendamentos.filter(a=>a.data===hoje).length;
  const osAtivas = os.filter(o=>o.status==="Em Execução"||o.status==="Aguardando").length;
  const receitaMes = financeiro.filter(f=>f.tipo==="Entrada"&&f.data.startsWith("2026-02")).reduce((s,f)=>s+f.valor,0);
  const estoqueAlerta = estoque.filter(e=>e.quantidade<=e.minimo).length;
  const osHoje = os.filter(o=>o.entrada===hoje);

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{color:"var(--text3)",fontSize:12}}>Bom dia! Hoje é {fmtDate(hoje)} 👋</div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:12}}>
        <StatCard icon={ClipboardList} label="OS Ativas" value={osAtivas} color="var(--accent)"/>
        <StatCard icon={CalendarDays} label="Ag. Hoje" value={agHoje} color="#3b82f6"/>
        <StatCard icon={DollarSign} label="Receita Fev" value={fmtCurr(receitaMes)} color="#22c55e"/>
        <StatCard icon={AlertTriangle} label="Alerta Estoque" value={estoqueAlerta} color="#ef4444"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"2fr 1fr",gap:12}}>
        <Card>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Receita x Despesa</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MESES_RECEITA}>
              <defs>
                <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/>
              <XAxis dataKey="mes" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`R$${v/1000}k`}/>
              <Tooltip contentStyle={{background:"var(--card)",border:"1px solid var(--border2)",borderRadius:8,fontSize:12}}/>
              <Area type="monotone" dataKey="receita" name="Receita" stroke="var(--accent)" fill="url(#gr)" strokeWidth={2}/>
              <Area type="monotone" dataKey="despesa" name="Despesa" stroke="#ef4444" fill="rgba(239,68,68,.1)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>OS por Status</div>
          {Object.entries(STATUS_COLORS).map(([s,c])=>{
            const cnt = os.filter(o=>o.status===s).length;
            return (
              <div key={s} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <div style={{width:8,height:8,borderRadius:2,background:c}}/>
                  <span style={{fontSize:12,color:"var(--text2)"}}>{s}</span>
                </div>
                <span style={{fontWeight:700,fontSize:13}}>{cnt}</span>
              </div>
            );
          })}
        </Card>
      </div>
      <Card>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>OS de Hoje</div>
        {osHoje.length===0 ? <Empty icon={ClipboardList} msg="Nenhuma OS para hoje"/> : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {osHoje.map(o=>{
              const cli=clientes.find(c=>c.id===o.clienteId);
              return (
                <div key={o.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"var(--surface)",borderRadius:10,gap:8,flexWrap:"wrap"}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>OS#{o.id} · {cli?.nome||"—"}</div>
                    <div style={{fontSize:11,color:"var(--text2)"}}>{o.servicos.length} serviço(s) · {fmtCurr(o.valorTotal)}</div>
                  </div>
                  <Badge color={STATUS_COLORS[o.status]}>{o.status}</Badge>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── CLIENTES ────────────────────────────────────────────────────── */
function Clientes({clientes, setClientes, isMobile}) {
  const [modal, setModal] = useState(null); // null | "add" | {obj}
  const [sel, setSel] = useState(null);
  const [search, setSearch] = useState("");
  const blank = {nome:"",cpf:"",tel:"",email:"",cidade:"",obs:""};
  const [form, setForm] = useState(blank);
  const F = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const save = () => {
    if(!form.nome) return;
    if(modal==="add") {
      setClientes(p=>[...p,{...form,id:Date.now(),pontos:0,visitCount:0,lastVisit:null,since:td()}]);
    } else {
      setClientes(p=>p.map(c=>c.id===modal.id?{...modal,...form}:c));
    }
    setModal(null);
  };

  const del = id => { if(window.confirm("Remover cliente?")) setClientes(p=>p.filter(c=>c.id!==id)); };

  const filtered = clientes.filter(c=>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.cpf.includes(search) || c.tel.includes(search)
  );

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
        <div style={{fontWeight:800,fontSize:isMobile?20:26}}>Clientes</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{paddingLeft:28,width:isMobile?140:200}}/>
          </div>
          <Btn onClick={()=>{setForm(blank);setModal("add")}}><Plus size={14}/>Novo</Btn>
        </div>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              {!isMobile && <th>Telefone</th>}
              {!isMobile && <th>Cidade</th>}
              <th>Visitas</th>
              <th>Pontos</th>
              <th style={{width:80}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 ? (
              <tr><td colSpan={6}><Empty icon={Users} msg="Nenhum cliente encontrado"/></td></tr>
            ) : filtered.map(c=>(
              <tr key={c.id} style={{transition:".15s"}} onMouseEnter={e=>e.currentTarget.style.background="var(--surface)"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:"var(--accent)22",color:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,flexShrink:0}}>{c.nome[0]}</div>
                    <div>
                      <div style={{fontWeight:600}}>{c.nome}</div>
                      <div style={{fontSize:10,color:"var(--text3)"}}>{c.email}</div>
                    </div>
                  </div>
                </td>
                {!isMobile && <td style={{fontSize:12,color:"var(--text2)"}}>{c.tel}</td>}
                {!isMobile && <td style={{fontSize:12,color:"var(--text2)"}}>{c.cidade}</td>}
                <td style={{fontSize:12}}>{c.visitCount} <span style={{fontSize:10,color:"var(--text3)"}}>visitas</span></td>
                <td><span style={{color:"var(--accent)",fontWeight:700}}>⭐ {c.pontos}</span></td>
                <td>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>setSel(c)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4}}><Eye size={14}/></button>
                    <button onClick={()=>{setForm({nome:c.nome,cpf:c.cpf,tel:c.tel,email:c.email,cidade:c.cidade,obs:c.obs||""});setModal(c)}} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4}}><Edit2 size={14}/></button>
                    <button onClick={()=>del(c.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:4}}><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title={modal==="add"?"Novo Cliente":"Editar Cliente"} onClose={()=>setModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Nome Completo *" value={form.nome} onChange={F("nome")} style={{gridColumn:"1/-1"}}/>
            <Input label="CPF" value={form.cpf} onChange={F("cpf")}/>
            <Input label="Telefone" value={form.tel} onChange={F("tel")}/>
            <Input label="Email" type="email" value={form.email} onChange={F("email")}/>
            <Input label="Cidade" value={form.cidade} onChange={F("cidade")}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14}/>Salvar</Btn>
          </div>
        </Modal>
      )}

      {sel && (
        <Modal title="Detalhes do Cliente" onClose={()=>setSel(null)}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:60,height:60,borderRadius:"50%",background:"var(--accent)22",color:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,margin:"0 auto 8px"}}>{sel.nome[0]}</div>
            <div style={{fontWeight:800,fontSize:18}}>{sel.nome}</div>
            <div style={{fontSize:12,color:"var(--text3)"}}>Cliente desde {fmtDate(sel.since)}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
            <div style={{textAlign:"center",padding:"12px 8px",background:"var(--surface)",borderRadius:10}}>
              <div style={{fontSize:28,fontWeight:800,color:"var(--accent)"}}>{sel.visitCount}</div>
              <div style={{fontSize:10,color:"var(--text3)"}}>visitas</div>
            </div>
            <div style={{textAlign:"center",padding:"12px 8px",background:"var(--surface)",borderRadius:10}}>
              <div style={{fontSize:18,fontWeight:800,color:"#eab308"}}>⭐ {sel.pontos}</div>
              <div style={{fontSize:10,color:"var(--text3)"}}>pontos</div>
            </div>
            <div style={{textAlign:"center",padding:"12px 8px",background:"var(--surface)",borderRadius:10}}>
              <div style={{fontSize:13,fontWeight:700}}>{fmtDate(sel.lastVisit)}</div>
              <div style={{fontSize:10,color:"var(--text3)"}}>última visita</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["CPF",sel.cpf],["Tel",sel.tel],["Email",sel.email],["Cidade",sel.cidade]].map(([l,v])=>(
              <div key={l} style={{padding:"8px 12px",background:"var(--surface)",borderRadius:8}}>
                <div style={{fontSize:10,color:"var(--text3)"}}>{l}</div>
                <div style={{fontSize:13,fontWeight:500}}>{v||"—"}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── VEÍCULOS ────────────────────────────────────────────────────── */
function Veiculos({veiculos, setVeiculos, clientes, vehicleTypes, isMobile}) {
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = {clienteId:"",placa:"",tipo:"Carro",marca:"",modelo:"",ano:new Date().getFullYear(),cor:"",obs:""};
  const [form, setForm] = useState(blank);
  const F = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const save = () => {
    if(!form.placa||!form.clienteId) return;
    if(modal==="add") setVeiculos(p=>[...p,{...form,id:Date.now(),ano:+form.ano,clienteId:+form.clienteId}]);
    else setVeiculos(p=>p.map(v=>v.id===modal.id?{...modal,...form,ano:+form.ano,clienteId:+form.clienteId}:v));
    setModal(null);
  };
  const del = id => { if(window.confirm("Remover veículo?")) setVeiculos(p=>p.filter(v=>v.id!==id)); };

  const filtered = veiculos.filter(v=>{
    const cli=clientes.find(c=>c.id===v.clienteId);
    return v.placa.toLowerCase().includes(search.toLowerCase())||v.modelo.toLowerCase().includes(search.toLowerCase())||(cli?.nome||"").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
        <div style={{fontWeight:800,fontSize:isMobile?20:26}}>Veículos</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{paddingLeft:28,width:isMobile?140:200}}/>
          </div>
          <Btn onClick={()=>{setForm(blank);setModal("add")}}><Plus size={14}/>Novo</Btn>
        </div>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table>
          <thead>
            <tr>
              <th>Veículo</th>
              <th>Placa</th>
              {!isMobile && <th>Tipo</th>}
              <th>Dono</th>
              <th style={{width:80}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 ? <tr><td colSpan={5}><Empty icon={Car} msg="Nenhum veículo"/></td></tr> : filtered.map(v=>{
              const cli=clientes.find(c=>c.id===v.clienteId);
              return (
                <tr key={v.id} onMouseEnter={e=>e.currentTarget.style.background="var(--surface)"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <td>
                    <div style={{fontWeight:600}}>{v.marca} {v.modelo}</div>
                    <div style={{fontSize:10,color:"var(--text3)"}}>{v.ano} · {v.cor}</div>
                  </td>
                  <td><Badge color="var(--accent)">{v.placa}</Badge></td>
                  {!isMobile && <td style={{fontSize:12,color:"var(--text2)"}}>{v.tipo}</td>}
                  <td style={{fontSize:12}}>{cli?.nome||"—"}</td>
                  <td>
                    <div style={{display:"flex",gap:4}}>
                      <button onClick={()=>{setForm({clienteId:v.clienteId,placa:v.placa,tipo:v.tipo,marca:v.marca,modelo:v.modelo,ano:v.ano,cor:v.cor,obs:v.obs||""});setModal(v)}} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4}}><Edit2 size={14}/></button>
                      <button onClick={()=>del(v.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:4}}><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title={modal==="add"?"Novo Veículo":"Editar Veículo"} onClose={()=>setModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Select label="Cliente *" value={form.clienteId} onChange={F("clienteId")} style={{gridColumn:"1/-1"}}>
              <option value="">Selecionar...</option>
              {clientes.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
            <Input label="Placa *" value={form.placa} onChange={F("placa")}/>
            <Select label="Tipo" value={form.tipo} onChange={F("tipo")}>
              {vehicleTypes.map(t=><option key={t} value={t}>{t}</option>)}
            </Select>
            <Input label="Marca" value={form.marca} onChange={F("marca")}/>
            <Input label="Modelo" value={form.modelo} onChange={F("modelo")}/>
            <Input label="Ano" type="number" value={form.ano} onChange={F("ano")}/>
            <Input label="Cor" value={form.cor} onChange={F("cor")}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14}/>Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── COLABORADORES ───────────────────────────────────────────────── */
function Colaboradores({colaboradores, setColaboradores, isMobile}) {
  const [modal, setModal] = useState(null);
  const blank = {nome:"",cargo:"",tel:"",email:"",ativo:true};
  const [form, setForm] = useState(blank);
  const F = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const save = () => {
    if(!form.nome) return;
    if(modal==="add") setColaboradores(p=>[...p,{...form,id:Date.now(),ativo:true}]);
    else setColaboradores(p=>p.map(c=>c.id===modal.id?{...modal,...form}:c));
    setModal(null);
  };
  const del = id => { if(window.confirm("Remover?")) setColaboradores(p=>p.filter(c=>c.id!==id)); };

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontWeight:800,fontSize:isMobile?20:26}}>Colaboradores</div>
        <Btn onClick={()=>{setForm(blank);setModal("add")}}><Plus size={14}/>Novo</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:12}}>
        {colaboradores.length===0 ? <Card><Empty icon={User} msg="Nenhum colaborador"/></Card> : colaboradores.map(c=>(
          <Card key={c.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:"var(--accent)22",color:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:17}}>{c.nome[0]}</div>
                <div>
                  <div style={{fontWeight:700}}>{c.nome}</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>{c.cargo}</div>
                  <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{c.tel}</div>
                </div>
              </div>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>{setForm({nome:c.nome,cargo:c.cargo,tel:c.tel,email:c.email});setModal(c)}} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4}}><Edit2 size={14}/></button>
                <button onClick={()=>del(c.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:4}}><Trash2 size={14}/></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title={modal==="add"?"Novo Colaborador":"Editar Colaborador"} onClose={()=>setModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Nome *" value={form.nome} onChange={F("nome")} style={{gridColumn:"1/-1"}}/>
            <Input label="Cargo" value={form.cargo} onChange={F("cargo")}/>
            <Input label="Telefone" value={form.tel} onChange={F("tel")}/>
            <Input label="Email" type="email" value={form.email} onChange={F("email")} style={{gridColumn:"1/-1"}}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14}/>Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── ESTOQUE ─────────────────────────────────────────────────────── */
function Estoque({estoque, setEstoque, isMobile}) {
  const [modal, setModal] = useState(null);
  const [movModal, setMovModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = {nome:"",categoria:"",quantidade:0,minimo:2,unidade:"un",custo:0,obs:""};
  const [form, setForm] = useState(blank);
  const [mov, setMov] = useState({tipo:"Entrada",quantidade:1,obs:""});
  const F = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const save = () => {
    if(!form.nome) return;
    if(modal==="add") setEstoque(p=>[...p,{...form,id:Date.now(),quantidade:+form.quantidade,minimo:+form.minimo,custo:+form.custo}]);
    else setEstoque(p=>p.map(i=>i.id===modal.id?{...modal,...form,quantidade:+form.quantidade,minimo:+form.minimo,custo:+form.custo}:i));
    setModal(null);
  };
  const del = id => { if(window.confirm("Remover?")) setEstoque(p=>p.filter(i=>i.id!==id)); };
  const saveMov = () => {
    const q=+mov.quantidade||0;
    setEstoque(p=>p.map(i=>i.id===movModal.id?{...i,quantidade:mov.tipo==="Entrada"?i.quantidade+q:Math.max(0,i.quantidade-q)}:i));
    setMovModal(null);
  };

  const filtered = estoque.filter(e=>e.nome.toLowerCase().includes(search.toLowerCase())||e.categoria.toLowerCase().includes(search.toLowerCase()));
  const alertas = estoque.filter(e=>e.quantidade<=e.minimo);

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
        <div style={{fontWeight:800,fontSize:isMobile?20:26}}>Estoque</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{paddingLeft:28,width:160}}/>
          </div>
          <Btn onClick={()=>{setForm(blank);setModal("add")}}><Plus size={14}/>Item</Btn>
        </div>
      </div>

      {alertas.length>0 && (
        <Card style={{background:"rgba(239,68,68,.06)",border:"1px solid rgba(239,68,68,.2)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <AlertTriangle size={15} color="#ef4444"/>
            <span style={{fontWeight:700,fontSize:13,color:"#ef4444"}}>Itens com estoque baixo</span>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {alertas.map(e=><Badge key={e.id} color="#ef4444">{e.nome}: {e.quantidade} {e.unidade}</Badge>)}
          </div>
        </Card>
      )}

      <Card style={{padding:0,overflow:"hidden"}}>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qtd</th>
              {!isMobile && <th>Mínimo</th>}
              {!isMobile && <th>Custo Unit.</th>}
              <th>Status</th>
              <th style={{width:100}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 ? <tr><td colSpan={6}><Empty icon={Package} msg="Nenhum item"/></td></tr> : filtered.map(e=>{
              const low=e.quantidade<=e.minimo;
              return (
                <tr key={e.id} onMouseEnter={ev=>ev.currentTarget.style.background="var(--surface)"} onMouseLeave={ev=>ev.currentTarget.style.background=""}>
                  <td>
                    <div style={{fontWeight:600}}>{e.nome}</div>
                    <div style={{fontSize:10,color:"var(--text3)"}}>{e.categoria}</div>
                  </td>
                  <td style={{fontWeight:700,color:low?"#ef4444":"var(--text)"}}>{e.quantidade} <span style={{fontSize:10,color:"var(--text3)"}}>{e.unidade}</span></td>
                  {!isMobile && <td style={{fontSize:12,color:"var(--text2)"}}>{e.minimo}</td>}
                  {!isMobile && <td style={{fontSize:12}}>{fmtCurr(e.custo)}</td>}
                  <td><Badge color={low?"#ef4444":"#22c55e"}>{low?"Baixo":"OK"}</Badge></td>
                  <td>
                    <div style={{display:"flex",gap:4}}>
                      <button onClick={()=>{setMovModal(e);setMov({tipo:"Entrada",quantidade:1,obs:""});}} style={{background:"none",border:"none",color:"var(--accent)",cursor:"pointer",padding:4,fontSize:11,fontWeight:600}}>Mov</button>
                      <button onClick={()=>{setForm({nome:e.nome,categoria:e.categoria,quantidade:e.quantidade,minimo:e.minimo,unidade:e.unidade,custo:e.custo,obs:e.obs||""});setModal(e)}} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4}}><Edit2 size={13}/></button>
                      <button onClick={()=>del(e.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:4}}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title={modal==="add"?"Novo Item":"Editar Item"} onClose={()=>setModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Nome *" value={form.nome} onChange={F("nome")} style={{gridColumn:"1/-1"}}/>
            <Input label="Categoria" value={form.categoria} onChange={F("categoria")}/>
            <Input label="Unidade" value={form.unidade} onChange={F("unidade")}/>
            <Input label="Quantidade" type="number" value={form.quantidade} onChange={F("quantidade")}/>
            <Input label="Estoque Mínimo" type="number" value={form.minimo} onChange={F("minimo")}/>
            <Input label="Custo Unit. (R$)" type="number" value={form.custo} onChange={F("custo")} style={{gridColumn:"1/-1"}}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14}/>Salvar</Btn>
          </div>
        </Modal>
      )}

      {movModal && (
        <Modal title={`Movimentação: ${movModal.nome}`} onClose={()=>setMovModal(null)} width={360}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Select label="Tipo" value={mov.tipo} onChange={e=>setMov(p=>({...p,tipo:e.target.value}))}>
              <option>Entrada</option>
              <option>Saída</option>
            </Select>
            <Input label="Quantidade" type="number" value={mov.quantidade} onChange={e=>setMov(p=>({...p,quantidade:e.target.value}))}/>
            <div style={{padding:"10px 14px",background:"var(--surface)",borderRadius:8,fontSize:12}}>
              Estoque atual: <strong>{movModal.quantidade}</strong> → <strong style={{color:mov.tipo==="Entrada"?"#22c55e":"#ef4444"}}>{mov.tipo==="Entrada"?movModal.quantidade+(+mov.quantidade||0):Math.max(0,movModal.quantidade-(+mov.quantidade||0))}</strong>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setMovModal(null)}>Cancelar</Btn>
            <Btn onClick={saveMov}><Check size={14}/>Confirmar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── SERVIÇOS ────────────────────────────────────────────────────── */
function Servicos({servicos, setServicos, vehicleTypes, isMobile}) {
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const blank = {nome:"",categoria:"",pontosPorReal:1,ativo:true};
  const [form, setForm] = useState({...blank,precos:{}});
  const F = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const openAdd = () => {
    const precos = {};
    vehicleTypes.forEach(t=>precos[t]=0);
    setForm({...blank,precos});
    setModal("add");
  };
  const openEdit = s => {
    const precos = {...s.precos};
    vehicleTypes.forEach(t=>{ if(!precos[t]) precos[t]=0; });
    setForm({nome:s.nome,categoria:s.categoria,pontosPorReal:s.pontosPorReal||1,ativo:s.ativo,precos});
    setModal(s);
  };
  const save = () => {
    if(!form.nome) return;
    const obj = {...form,pontosPorReal:+form.pontosPorReal};
    if(modal==="add") setServicos(p=>[...p,{...obj,id:Date.now()}]);
    else setServicos(p=>p.map(s=>s.id===modal.id?{...modal,...obj}:s));
    setModal(null);
  };
  const del = id => { if(window.confirm("Remover?")) setServicos(p=>p.filter(s=>s.id!==id)); };
  const toggleAtivo = id => setServicos(p=>p.map(s=>s.id===id?{...s,ativo:!s.ativo}:s));

  const filtered = servicos.filter(s=>s.nome.toLowerCase().includes(search.toLowerCase())||s.categoria.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
        <div style={{fontWeight:800,fontSize:isMobile?20:26}}>Serviços</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{position:"relative"}}>
            <Search size={13} style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." style={{paddingLeft:28,width:160}}/>
          </div>
          <Btn onClick={openAdd}><Plus size={14}/>Novo</Btn>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(auto-fill,minmax(300px,1fr))",gap:12}}>
        {filtered.length===0 ? <Card><Empty icon={Wrench} msg="Nenhum serviço"/></Card> : filtered.map(s=>(
          <Card key={s.id} style={{opacity:s.ativo?1:.55}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontWeight:700,fontSize:14}}>{s.nome}</div>
                <div style={{fontSize:11,color:"var(--text3)"}}>{s.categoria}</div>
              </div>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{background:"rgba(234,179,8,.15)",color:"#eab308",border:"1px solid rgba(234,179,8,.3)",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700}}>⭐ {s.pontosPorReal}x</span>
                <button onClick={()=>openEdit(s)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4}}><Edit2 size={13}/></button>
                <button onClick={()=>del(s.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:4}}><Trash2 size={13}/></button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:4}}>
              {vehicleTypes.slice(0,4).map(t=>(
                <div key={t} style={{display:"flex",justifyContent:"space-between",fontSize:11,padding:"4px 8px",background:"var(--surface)",borderRadius:6}}>
                  <span style={{color:"var(--text3)"}}>{t}</span>
                  <span style={{fontWeight:600}}>{fmtCurr(s.precos?.[t]||0)}</span>
                </div>
              ))}
            </div>
            <div style={{marginTop:8}}>
              <button onClick={()=>toggleAtivo(s.id)} style={{background:"none",border:"none",fontSize:11,color:s.ativo?"#22c55e":"var(--text3)",cursor:"pointer",padding:0,fontWeight:600}}>{s.ativo?"● Ativo":"○ Inativo"}</button>
            </div>
          </Card>
        ))}
      </div>

      {modal && (
        <Modal title={modal==="add"?"Novo Serviço":"Editar Serviço"} onClose={()=>setModal(null)} width={600}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Nome *" value={form.nome} onChange={F("nome")} style={{gridColumn:"1/-1"}}/>
            <Input label="Categoria" value={form.categoria} onChange={F("categoria")}/>
            <Input label="Pontos por R$1" type="number" value={form.pontosPorReal} onChange={F("pontosPorReal")} min={0} max={10}/>
          </div>
          <div style={{marginTop:16}}>
            <div style={{fontSize:11,fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Preços por tipo de veículo</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
              {vehicleTypes.map(t=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:8}}>
                  <label style={{fontSize:12,color:"var(--text2)",width:90,flexShrink:0}}>{t}</label>
                  <input type="number" value={form.precos?.[t]||0} onChange={e=>setForm(p=>({...p,precos:{...p.precos,[t]:e.target.value}}))} style={{width:"100%"}}/>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setModal(null)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14}/>Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── AGENDAMENTOS ────────────────────────────────────────────────── */
function Agendamentos({agendamentos, setAgendamentos, clientes, veiculos, servicos, colaboradores, vehicleTypes, horarioAbertura, horarioFechamento, intervaloMinutos, isMobile}) {
  const hoje = td();
  const slots = gerarSlots(horarioAbertura, horarioFechamento, intervaloMinutos);
  const defaultHora = slots[0] || "09:00";
  const [view, setView] = useState("calendario"); // "calendario" | "lista"
  const [calYear, setCalYear] = useState(()=>new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(()=>new Date().getMonth());
  const [modal, setModal] = useState(false);
  const blank = {clienteId:"",veiculoId:"",servicoId:"",colaboradorId:"",data:hoje,hora:defaultHora,status:"Aguardando",obs:""};
  const [form, setForm] = useState(blank);
  const F = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const cliVeiculos = cid => veiculos.filter(v=>v.clienteId===+cid);

  const save = () => {
    if(!form.clienteId||!form.data) return;
    if(typeof modal === "object" && modal !== null && modal !== true) {
      setAgendamentos(p=>p.map(a=>a.id===modal.id?{...modal,...form,clienteId:+form.clienteId,veiculoId:+form.veiculoId||null,servicoId:+form.servicoId,colaboradorId:+form.colaboradorId||null}:a));
    } else {
      setAgendamentos(p=>[...p,{...form,id:Date.now(),clienteId:+form.clienteId,veiculoId:+form.veiculoId||null,servicoId:+form.servicoId,colaboradorId:+form.colaboradorId||null,convertidoOS:false}]);
    }
    setModal(false);
  };
  const del = id => { if(window.confirm("Remover?")) setAgendamentos(p=>p.filter(a=>a.id!==id)); };
  const toggleStatus = id => setAgendamentos(p=>p.map(a=>a.id===id?{...a,status:a.status==="Aguardando"?"Confirmado":"Aguardando"}:a));

  const openModal = (dateStr) => {
    setForm({...blank,data:dateStr||hoje});
    setModal(true);
  };

  const calEvents = agendamentos.map(a=>({...a,date:a.data}));
  const renderAgEvent = (a,i) => {
    const cli = clientes.find(c=>c.id===a.clienteId);
    const color = a.status==="Confirmado"?"#22c55e":a.convertidoOS?"#3b82f6":"#eab308";
    return (
      <div key={a.id} style={{background:color+"22",border:`1px solid ${color}44`,borderRadius:4,padding:"2px 5px",marginBottom:2,cursor:"pointer",overflow:"hidden"}} onClick={e=>{e.stopPropagation();setForm({clienteId:a.clienteId,veiculoId:a.veiculoId||"",servicoId:a.servicoId,colaboradorId:a.colaboradorId||"",data:a.data,hora:a.hora,status:a.status,obs:a.obs||""});setModal(a);}}>
        <div style={{fontSize:9,fontWeight:700,color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.hora} {cli?.nome?.split(" ")[0]}</div>
      </div>
    );
  };

  const navMonth = d => {
    if(d<0) { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }
    else { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }
  };

  const sortedAgs = [...agendamentos].sort((a,b)=>a.data.localeCompare(b.data)||a.hora.localeCompare(b.hora));

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
        <div style={{fontWeight:800,fontSize:isMobile?20:26}}>Agendamentos</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{display:"flex",background:"var(--surface)",borderRadius:9,border:"1px solid var(--border2)",overflow:"hidden"}}>
            {[["calendario",Calendar],["lista",List]].map(([v,Icon])=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"7px 12px",background:view===v?"var(--accent)":"transparent",color:view===v?"#fff":"var(--text2)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600}}>
                <Icon size={13}/>
              </button>
            ))}
          </div>
          <Btn onClick={()=>openModal(null)}><Plus size={14}/>Agendar</Btn>
        </div>
      </div>

      {view==="calendario" && (
        <Card>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <button onClick={()=>navMonth(-1)} style={{background:"none",border:"none",color:"var(--text2)",cursor:"pointer",padding:4,display:"flex"}}><ChevronLeft size={18}/></button>
            <div style={{fontWeight:700,fontSize:15}}>{MONTH_NAMES[calMonth]} {calYear}</div>
            <button onClick={()=>navMonth(1)} style={{background:"none",border:"none",color:"var(--text2)",cursor:"pointer",padding:4,display:"flex"}}><ChevronRight size={18}/></button>
          </div>
          <div style={{fontSize:11,color:"var(--text3)",marginBottom:8,textAlign:"center"}}>Clique em um dia para agendar</div>
          <MonthCalendar year={calYear} month={calMonth} events={calEvents} renderEvent={renderAgEvent} onDayClick={openModal}/>
        </Card>
      )}

      {view==="lista" && (
        <Card>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {sortedAgs.length===0 ? <Empty icon={CalendarDays} msg="Nenhum agendamento"/> : sortedAgs.map(a=>{
              const cli=clientes.find(c=>c.id===a.clienteId);
              const svc=servicos.find(s=>s.id===a.servicoId);
              const col=colaboradores.find(c=>c.id===a.colaboradorId);
              const color = a.status==="Confirmado"?"#22c55e":a.convertidoOS?"#3b82f6":"#eab308";
              return (
                <div key={a.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:"var(--surface)",borderRadius:10,gap:8,flexWrap:"wrap"}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{textAlign:"center",padding:"6px 10px",background:color+"22",borderRadius:8,minWidth:52}}>
                      <div style={{fontSize:13,fontWeight:800,color}}>{a.hora}</div>
                      <div style={{fontSize:9,color:"var(--text3)"}}>{fmtDate(a.data)}</div>
                    </div>
                    <div>
                      <div style={{fontWeight:600,fontSize:13}}>{cli?.nome||"—"}</div>
                      <div style={{fontSize:11,color:"var(--text2)"}}>{svc?.nome||"—"} {col?`· ${col.nome}`:""}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <Badge color={color}>{a.status}{a.convertidoOS?" ✓":""}</Badge>
                    <button onClick={()=>toggleStatus(a.id)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4}}><Check size={13}/></button>
                    <button onClick={()=>{setForm({clienteId:a.clienteId,veiculoId:a.veiculoId||"",servicoId:a.servicoId,colaboradorId:a.colaboradorId||"",data:a.data,hora:a.hora,status:a.status,obs:a.obs||""});setModal(a);}} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4}}><Edit2 size={13}/></button>
                    <button onClick={()=>del(a.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:4}}><Trash2 size={13}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {modal && (
        <Modal title={typeof modal==="object"&&modal!==true?"Editar Agendamento":"Novo Agendamento"} onClose={()=>setModal(false)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Select label="Cliente *" value={form.clienteId} onChange={e=>{F("clienteId")(e);setForm(p=>({...p,clienteId:e.target.value,veiculoId:""}));}} style={{gridColumn:"1/-1"}}>
              <option value="">Selecionar...</option>
              {clientes.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
            <Select label="Veículo" value={form.veiculoId} onChange={F("veiculoId")}>
              <option value="">Sem veículo</option>
              {cliVeiculos(form.clienteId).map(v=><option key={v.id} value={v.id}>{v.placa} {v.modelo}</option>)}
            </Select>
            <Select label="Serviço" value={form.servicoId} onChange={F("servicoId")}>
              <option value="">Selecionar...</option>
              {servicos.filter(s=>s.ativo).map(s=><option key={s.id} value={s.id}>{s.nome}</option>)}
            </Select>
            <Select label="Colaborador" value={form.colaboradorId} onChange={F("colaboradorId")}>
              <option value="">Qualquer</option>
              {colaboradores.filter(c=>c.ativo).map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
            <Input label="Data *" type="date" value={form.data} onChange={F("data")}/>
            <Select label="Horário" value={form.hora} onChange={F("hora")}>
              {slots.length===0 && <option value={form.hora}>{form.hora}</option>}
              {slots.map(s=><option key={s} value={s}>{s}</option>)}
            </Select>
            <Select label="Status" value={form.status} onChange={F("status")} style={{gridColumn:"1/-1"}}>
              <option>Aguardando</option>
              <option>Confirmado</option>
              <option>Cancelado</option>
            </Select>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14}/>Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── ORDENS DE SERVIÇO ───────────────────────────────────────────── */
function OrdensServico({os, setOs, clientes, setClientes, veiculos, servicos, colaboradores, agendamentos, setAgendamentos, boxes, horarioAbertura, horarioFechamento, intervaloMinutos, isMobile}) {
  const [view, setView] = useState("kanban"); // kanban | lista | calendario
  const [modal, setModal] = useState(null); // null | "add" | {os}
  const [detModal, setDetModal] = useState(null);
  const [boxAlert, setBoxAlert] = useState(null); // {boxId, osId}
  const [calYear, setCalYear] = useState(()=>new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(()=>new Date().getMonth());
  const slots = gerarSlots(horarioAbertura, horarioFechamento, intervaloMinutos);
  const defaultHora = slots[0] || "08:00";

  const blankForm = {clienteId:"",veiculoId:"",colaboradorId:"",boxId:"",agendamentoId:"",servicos:[],desconto:0,pagamento:"",obs:"",entrada:td(),horaInicio:defaultHora};
  const [form, setForm] = useState(blankForm);
  const [addSvc, setAddSvc] = useState({servicoId:"",preco:0});
  const F = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const todayAgs = agendamentos.filter(a=>a.data===td()&&!a.convertidoOS);

  const importAg = agId => {
    if(!agId) { setForm(p=>({...p,agendamentoId:"",clienteId:"",veiculoId:"",colaboradorId:"",servicos:[]})); return; }
    const ag = agendamentos.find(a=>a.id===+agId);
    if(!ag) return;
    const veiculo = veiculos.find(v=>v.id===ag.veiculoId);
    const tipo = veiculo?.tipo||"Carro";
    const svc = servicos.find(s=>s.id===ag.servicoId);
    const preco = svc?.precos?.[tipo]||0;
    setForm(p=>({...p,agendamentoId:agId,clienteId:ag.clienteId,veiculoId:ag.veiculoId||"",colaboradorId:ag.colaboradorId||"",servicos:[{servicoId:ag.servicoId,preco}]}));
  };

  const addServico = () => {
    if(!addSvc.servicoId) return;
    setForm(p=>({...p,servicos:[...p.servicos,{servicoId:+addSvc.servicoId,preco:+addSvc.preco||0}]}));
    setAddSvc({servicoId:"",preco:0});
  };
  const remServico = i => setForm(p=>({...p,servicos:p.servicos.filter((_,idx)=>idx!==i)}));

  const calcTotal = svcs => svcs.reduce((s,sv)=>s+(+sv.preco||0),0);

  const save = () => {
    if(!form.clienteId) return;
    const total = calcTotal(form.servicos);
    if(modal==="add"||typeof modal==="string") {
      const newOs = {...form,id:Date.now(),clienteId:+form.clienteId,veiculoId:+form.veiculoId||null,colaboradorId:+form.colaboradorId||null,boxId:+form.boxId||null,agendamentoId:+form.agendamentoId||null,entrada:form.entrada||td(),saida:null,status:"Aguardando",valorTotal:total,desconto:+form.desconto||0,pagamento:form.pagamento||null};
      setOs(p=>[...p,newOs]);
      if(form.agendamentoId) setAgendamentos(p=>p.map(a=>a.id===+form.agendamentoId?{...a,convertidoOS:true,status:"Confirmado"}:a));
    } else {
      setOs(p=>p.map(o=>o.id===modal.id?{...modal,...form,clienteId:+form.clienteId,veiculoId:+form.veiculoId||null,colaboradorId:+form.colaboradorId||null,boxId:+form.boxId||null,valorTotal:total,desconto:+form.desconto||0}:o));
    }
    setModal(null);
  };

  const STATUS_ORDER = ["Aguardando","Em Execução","Finalizado","Entregue","Cancelado"];

  const changeStatus = (id, newStatus) => {
    // Block "Em Execução" if the box is occupied by another active OS
    if(newStatus === "Em Execução") {
      const osObj = os.find(o=>o.id===id);
      if(osObj?.boxId) {
        const ocupante = os.find(o=>o.id!==id && o.boxId===osObj.boxId && o.status==="Em Execução");
        if(ocupante) {
          const cliOcup = clientes.find(c=>c.id===ocupante.clienteId);
          setBoxAlert({boxId:osObj.boxId, osId:ocupante.id, cliNome:cliOcup?.nome||"?"});
          return;
        }
      }
    }
    setOs(p=>p.map(o=>{
      if(o.id!==id) return o;
      const updated = {...o,status:newStatus};
      if(["Finalizado","Entregue"].includes(newStatus)) {
        updated.saida = td();
        updated.boxId = null;
        // Award loyalty points
        if(newStatus==="Finalizado") {
          let pts = 0;
          o.servicos.forEach(sv=>{
            const svc=servicos.find(s=>s.id===sv.servicoId);
            pts += (sv.preco||0)*(svc?.pontosPorReal||1);
          });
          setClientes(cl=>cl.map(c=>c.id===o.clienteId?{...c,pontos:(c.pontos||0)+pts,visitCount:(c.visitCount||0)+1,lastVisit:td()}:c));
        }
      }
      return updated;
    }));
  };

  const del = id => { if(window.confirm("Remover OS?")) setOs(p=>p.filter(o=>o.id!==id)); };

  const openAdd = (dateStr) => {
    setForm({...blankForm,entrada:dateStr||td()});
    setModal("add");
  };

  const openEdit = o => {
    setForm({clienteId:o.clienteId,veiculoId:o.veiculoId||"",colaboradorId:o.colaboradorId||"",boxId:o.boxId||"",agendamentoId:o.agendamentoId||"",servicos:[...o.servicos],desconto:o.desconto||0,pagamento:o.pagamento||"",obs:o.obs||"",entrada:o.entrada,horaInicio:o.horaInicio||defaultHora});
    setModal(o);
  };

  const navMonth = d => {
    if(d<0){if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1);}
    else{if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1);}
  };

  const calEvents = os.map(o=>({...o,date:o.entrada}));
  const renderOsEvent = (o,i) => {
    const cli=clientes.find(c=>c.id===o.clienteId);
    const color = STATUS_COLORS[o.status]||"#666";
    return (
      <div key={o.id} style={{background:color+"22",border:`1px solid ${color}44`,borderRadius:4,padding:"2px 5px",marginBottom:2,cursor:"pointer"}} onClick={e=>{e.stopPropagation();setDetModal(o);}}>
        <div style={{fontSize:9,fontWeight:700,color,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>#{o.id} {cli?.nome?.split(" ")[0]}</div>
      </div>
    );
  };

  const cliVeiculos = cid => veiculos.filter(v=>v.clienteId===+cid);
  const formTotal = calcTotal(form.servicos);

  const FormModal = () => (
    <Modal title={typeof modal==="object"&&modal!==null?"Editar OS #"+modal.id:"Nova Ordem de Serviço"} onClose={()=>setModal(null)} width={620}>
      {form.entrada && form.entrada!==td() && (
        <div style={{marginBottom:12,padding:"8px 12px",background:"rgba(34,197,94,.08)",border:"1px solid rgba(34,197,94,.3)",borderRadius:8,fontSize:12,color:"#22c55e"}}>
          📅 Data de entrada: <strong>{fmtDate(form.entrada)}</strong>
        </div>
      )}
      {todayAgs.length>0 && (
        <div style={{marginBottom:14,padding:"10px 12px",background:"var(--accent)0d",border:"1px solid var(--accent)33",borderRadius:10}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--accent)",marginBottom:6}}>📅 Agendamentos de hoje</div>
          <select value={form.agendamentoId} onChange={e=>importAg(e.target.value)} style={{width:"100%",fontSize:12}}>
            <option value="">Não vincular agendamento</option>
            {todayAgs.map(a=>{
              const cli=clientes.find(c=>c.id===a.clienteId);
              const svc=servicos.find(s=>s.id===a.servicoId);
              return <option key={a.id} value={a.id}>{a.hora} · {cli?.nome} · {svc?.nome}</option>;
            })}
          </select>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Select label="Cliente *" value={form.clienteId} onChange={e=>setForm(p=>({...p,clienteId:e.target.value,veiculoId:""}))} style={{gridColumn:"1/-1"}}>
          <option value="">Selecionar...</option>
          {clientes.map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
        </Select>
        <Select label="Veículo" value={form.veiculoId} onChange={F("veiculoId")}>
          <option value="">Sem veículo</option>
          {cliVeiculos(form.clienteId).map(v=><option key={v.id} value={v.id}>{v.placa} {v.modelo}</option>)}
        </Select>
        <Select label="Colaborador" value={form.colaboradorId} onChange={F("colaboradorId")}>
          <option value="">Não atribuído</option>
          {colaboradores.filter(c=>c.ativo).map(c=><option key={c.id} value={c.id}>{c.nome}</option>)}
        </Select>
        <Select label="Box" value={form.boxId} onChange={F("boxId")}>
          <option value="">Sem box</option>
          {Array.from({length:boxes},(_,i)=>i+1).map(n=><option key={n} value={n}>Box {n}</option>)}
        </Select>
        <Select label="Pagamento" value={form.pagamento} onChange={F("pagamento")}>
          <option value="">Pendente</option>
          {PAG_OPTS.map(p=><option key={p} value={p}>{p}</option>)}
        </Select>
        <Input label="Data de Entrada" type="date" value={form.entrada} onChange={F("entrada")}/>
        <Select label="Horário de Início" value={form.horaInicio} onChange={F("horaInicio")}>
          {slots.length===0 && <option value={form.horaInicio}>{form.horaInicio}</option>}
          {slots.map(s=><option key={s} value={s}>{s}</option>)}
        </Select>
        <Input label="Desconto (R$)" type="number" value={form.desconto} onChange={F("desconto")} style={{gridColumn:"1/-1"}}/>
      </div>
      <div style={{marginTop:14}}>
        <div style={{fontSize:11,fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>Serviços</div>
        {form.servicos.map((sv,i)=>{
          const svc=servicos.find(s=>s.id===sv.servicoId);
          return (
            <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",background:"var(--surface)",borderRadius:8,marginBottom:6}}>
              <span style={{fontSize:12}}>{svc?.nome||"Serviço #"+sv.servicoId}</span>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontWeight:700,fontSize:12}}>{fmtCurr(sv.preco)}</span>
                <button onClick={()=>remServico(i)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:2}}><X size={13}/></button>
              </div>
            </div>
          );
        })}
        <div style={{display:"flex",gap:8,marginTop:8}}>
          <select value={addSvc.servicoId} onChange={e=>{
            const svc=servicos.find(s=>s.id===+e.target.value);
            const veiculo=veiculos.find(v=>v.id===+form.veiculoId);
            const tipo=veiculo?.tipo||"Carro";
            setAddSvc({servicoId:e.target.value,preco:svc?.precos?.[tipo]||0});
          }} style={{flex:1,fontSize:12}}>
            <option value="">Adicionar serviço...</option>
            {servicos.filter(s=>s.ativo).map(s=><option key={s.id} value={s.id}>{s.nome}</option>)}
          </select>
          <input type="number" value={addSvc.preco} onChange={e=>setAddSvc(p=>({...p,preco:e.target.value}))} placeholder="Preço" style={{width:90,fontSize:12}}/>
          <Btn small onClick={addServico}><Plus size={12}/>Add</Btn>
        </div>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:10,paddingTop:10,borderTop:"1px solid var(--border)"}}>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:"var(--text3)"}}>Total serviços: {fmtCurr(formTotal)}</div>
            {+form.desconto>0 && <div style={{fontSize:11,color:"#ef4444"}}>Desconto: -{fmtCurr(form.desconto)}</div>}
            <div style={{fontWeight:800,fontSize:16}}>Total: {fmtCurr(formTotal-(+form.desconto||0))}</div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
        <Btn variant="ghost" onClick={()=>setModal(null)}>Cancelar</Btn>
        <Btn onClick={save}><Check size={14}/>Salvar</Btn>
      </div>
    </Modal>
  );

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
        <div style={{fontWeight:800,fontSize:isMobile?20:26}}>Ordens de Serviço</div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div style={{display:"flex",background:"var(--surface)",borderRadius:9,border:"1px solid var(--border2)",overflow:"hidden"}}>
            {[["kanban","Kanban",Columns],["lista","Lista",List],["calendario","Cal.",Calendar]].map(([v,l,Icon])=>(
              <button key={v} onClick={()=>setView(v)} style={{padding:"7px 11px",background:view===v?"var(--accent)":"transparent",color:view===v?"#fff":"var(--text2)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600}}>
                <Icon size={13}/>{!isMobile&&l}
              </button>
            ))}
          </div>
          <Btn onClick={()=>openAdd(null)}><Plus size={14}/>Nova OS</Btn>
        </div>
      </div>

      {view==="kanban" && (
        <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
          {STATUS_ORDER.filter(s=>s!=="Cancelado").map(status=>{
            const statusOs = os.filter(o=>o.status===status);
            return (
              <div key={status} style={{minWidth:220,background:"var(--surface)",borderRadius:12,border:"1px solid var(--border)",flexShrink:0,overflow:"hidden"}}>
                <div style={{padding:"10px 14px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:8,height:8,borderRadius:2,background:STATUS_COLORS[status]}}/>
                    <span style={{fontWeight:700,fontSize:12}}>{status}</span>
                  </div>
                  <span style={{background:"var(--border2)",borderRadius:20,padding:"1px 8px",fontSize:11}}>{statusOs.length}</span>
                </div>
                <div style={{padding:"8px",display:"flex",flexDirection:"column",gap:8,maxHeight:480,overflowY:"auto"}}>
                  {statusOs.length===0 ? (
                    <div style={{textAlign:"center",padding:"20px 8px",color:"var(--text3)",fontSize:11}}>Vazio</div>
                  ) : statusOs.map(o=>{
                    const cli=clientes.find(c=>c.id===o.clienteId);
                    const vei=veiculos.find(v=>v.id===o.veiculoId);
                    const col=colaboradores.find(c=>c.id===o.colaboradorId);
                    return (
                      <div key={o.id} style={{background:"var(--card)",border:"1px solid var(--border2)",borderRadius:10,padding:"10px 12px",cursor:"pointer"}} onClick={()=>setDetModal(o)}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                          <span style={{fontWeight:700,fontSize:12,color:"var(--accent)"}}>OS#{o.id}</span>
                          {o.boxId && <Badge color="var(--accent)">Box {o.boxId}</Badge>}
                        </div>
                        <div style={{fontWeight:600,fontSize:13}}>{cli?.nome||"—"}</div>
                        {vei && <div style={{fontSize:10,color:"var(--text3)"}}>{vei.placa} · {vei.modelo}</div>}
                        {col && <div style={{fontSize:10,color:"var(--text3)"}}>👤 {col.nome}</div>}
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:8,alignItems:"center"}}>
                          <span style={{fontWeight:700,fontSize:13}}>{fmtCurr(o.valorTotal-o.desconto)}</span>
                          <span style={{fontSize:10,color:"var(--text3)"}}>{fmtDate(o.entrada)}</span>
                        </div>
                        <div style={{display:"flex",gap:4,marginTop:8}}>
                          {STATUS_ORDER.filter(s=>s!==status).map(ns=>(
                            <button key={ns} onClick={e=>{e.stopPropagation();changeStatus(o.id,ns);}} style={{background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:6,padding:"2px 6px",fontSize:9,color:"var(--text2)",cursor:"pointer",whiteSpace:"nowrap"}}>{ns.split(" ")[0]}</button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view==="lista" && (
        <Card style={{padding:0,overflow:"hidden"}}>
          <table>
            <thead>
              <tr>
                <th>OS</th>
                <th>Cliente</th>
                {!isMobile && <th>Entrada</th>}
                <th>Total</th>
                <th>Status</th>
                <th style={{width:100}}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {os.length===0 ? <tr><td colSpan={6}><Empty icon={ClipboardList} msg="Nenhuma OS"/></td></tr> : os.map(o=>{
                const cli=clientes.find(c=>c.id===o.clienteId);
                return (
                  <tr key={o.id} onMouseEnter={e=>e.currentTarget.style.background="var(--surface)"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                    <td><span style={{fontWeight:700,color:"var(--accent)"}}>#{o.id}</span></td>
                    <td style={{fontWeight:500}}>{cli?.nome||"—"}</td>
                    {!isMobile && <td style={{fontSize:12,color:"var(--text2)"}}>{fmtDate(o.entrada)}</td>}
                    <td style={{fontWeight:700}}>{fmtCurr(o.valorTotal-o.desconto)}</td>
                    <td><Badge color={STATUS_COLORS[o.status]}>{o.status}</Badge></td>
                    <td>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>setDetModal(o)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4}}><Eye size={13}/></button>
                        <button onClick={()=>openEdit(o)} style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4}}><Edit2 size={13}/></button>
                        <button onClick={()=>del(o.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:4}}><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}

      {view==="calendario" && (
        <Card>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <button onClick={()=>navMonth(-1)} style={{background:"none",border:"none",color:"var(--text2)",cursor:"pointer",padding:4,display:"flex"}}><ChevronLeft size={18}/></button>
            <div style={{fontWeight:700,fontSize:15}}>{MONTH_NAMES[calMonth]} {calYear}</div>
            <button onClick={()=>navMonth(1)} style={{background:"none",border:"none",color:"var(--text2)",cursor:"pointer",padding:4,display:"flex"}}><ChevronRight size={18}/></button>
          </div>
          <div style={{fontSize:11,color:"var(--text3)",marginBottom:8,textAlign:"center"}}>Clique em um dia para criar nova OS</div>
          <MonthCalendar year={calYear} month={calMonth} events={calEvents} renderEvent={renderOsEvent} onDayClick={openAdd}/>
        </Card>
      )}

      {modal && <FormModal/>}

      {boxAlert && (
        <Modal title="⚠️ Box Ocupado" onClose={()=>setBoxAlert(null)} width={400}>
          <div style={{textAlign:"center",padding:"8px 0 20px"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(239,68,68,.12)",color:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26}}>🚫</div>
            <div style={{fontWeight:700,fontSize:16,marginBottom:8}}>Box {boxAlert.boxId} está ocupado</div>
            <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6,marginBottom:4}}>
              A OS <strong>#{boxAlert.osId}</strong> ({boxAlert.cliNome}) já está em execução neste box.
            </div>
            <div style={{fontSize:12,color:"var(--text3)"}}>Aguarde o box ser liberado ou selecione outro box para esta OS.</div>
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <Btn variant="secondary" onClick={()=>setBoxAlert(null)}>Entendido</Btn>
          </div>
        </Modal>
      )}

      {detModal && (
        <Modal title={`OS #${detModal.id}`} onClose={()=>setDetModal(null)} width={500}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[
              ["Cliente",clientes.find(c=>c.id===detModal.clienteId)?.nome||"—"],
              ["Status",detModal.status],
              ["Entrada",fmtDate(detModal.entrada)],
              ["Saída",fmtDate(detModal.saida)],
              ["Box",detModal.boxId?"Box "+detModal.boxId:"—"],
              ["Pagamento",detModal.pagamento||"Pendente"],
            ].map(([l,v])=>(
              <div key={l} style={{padding:"8px 12px",background:"var(--surface)",borderRadius:8}}>
                <div style={{fontSize:10,color:"var(--text3)"}}>{l}</div>
                <div style={{fontSize:13,fontWeight:500}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Serviços</div>
            {detModal.servicos.map((sv,i)=>{
              const svc=servicos.find(s=>s.id===sv.servicoId);
              return (
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:12}}>{svc?.nome||"—"}</span>
                  <span style={{fontWeight:700,fontSize:12}}>{fmtCurr(sv.preco)}</span>
                </div>
              );
            })}
            <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",marginTop:4}}>
              <span style={{fontWeight:700}}>Total</span>
              <span style={{fontWeight:800,fontSize:15}}>{fmtCurr(detModal.valorTotal-detModal.desconto)}</span>
            </div>
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
            {STATUS_ORDER.filter(s=>s!==detModal.status).map(s=>(
              <Btn key={s} small variant="secondary" onClick={()=>{changeStatus(detModal.id,s);setDetModal(p=>({...p,status:s}));}}>→ {s}</Btn>
            ))}
          </div>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setDetModal(null)}>Fechar</Btn>
            <Btn variant="secondary" onClick={()=>{openEdit(detModal);setDetModal(null);}}><Edit2 size={13}/>Editar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── FINANCEIRO ──────────────────────────────────────────────────── */
function Financeiro({financeiro, setFinanceiro, isMobile}) {
  const [modal, setModal] = useState(false);
  const blank = {tipo:"Entrada",descricao:"",valor:0,data:td(),categoria:"",obs:""};
  const [form, setForm] = useState(blank);
  const F = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const save = () => {
    if(!form.descricao||!form.valor) return;
    setFinanceiro(p=>[...p,{...form,id:Date.now(),valor:+form.valor,osId:null}]);
    setModal(false);
  };
  const del = id => { if(window.confirm("Remover?")) setFinanceiro(p=>p.filter(f=>f.id!==id)); };

  const entradas = financeiro.filter(f=>f.tipo==="Entrada").reduce((s,f)=>s+f.valor,0);
  const saidas = financeiro.filter(f=>f.tipo==="Saida").reduce((s,f)=>s+f.valor,0);
  const sorted = [...financeiro].sort((a,b)=>b.data.localeCompare(a.data));

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontWeight:800,fontSize:isMobile?20:26}}>Financeiro</div>
        <Btn onClick={()=>{setForm(blank);setModal(true)}}><Plus size={14}/>Lançamento</Btn>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        <StatCard icon={TrendingUp} label="Entradas" value={fmtCurr(entradas)} color="#22c55e"/>
        <StatCard icon={TrendingDown} label="Saídas" value={fmtCurr(saidas)} color="#ef4444"/>
        <StatCard icon={DollarSign} label="Saldo" value={fmtCurr(entradas-saidas)} color="var(--accent)"/>
      </div>
      <Card style={{padding:0,overflow:"hidden"}}>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Data</th>
              {!isMobile && <th>Categoria</th>}
              <th>Valor</th>
              <th style={{width:50}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length===0 ? <tr><td colSpan={5}><Empty icon={DollarSign} msg="Sem lançamentos"/></td></tr> : sorted.map(f=>(
              <tr key={f.id} onMouseEnter={e=>e.currentTarget.style.background="var(--surface)"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td>
                  <div style={{fontWeight:500}}>{f.descricao}</div>
                  <div style={{fontSize:10,color:"var(--text3)"}}>{f.tipo}</div>
                </td>
                <td style={{fontSize:12,color:"var(--text2)"}}>{fmtDate(f.data)}</td>
                {!isMobile && <td style={{fontSize:12,color:"var(--text2)"}}>{f.categoria||"—"}</td>}
                <td style={{fontWeight:700,color:f.tipo==="Entrada"?"#22c55e":"#ef4444"}}>{f.tipo==="Saida"&&"-"}{fmtCurr(f.valor)}</td>
                <td><button onClick={()=>del(f.id)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:4}}><Trash2 size={13}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {modal && (
        <Modal title="Novo Lançamento" onClose={()=>setModal(false)} width={400}>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Select label="Tipo" value={form.tipo} onChange={F("tipo")}>
              <option>Entrada</option>
              <option>Saida</option>
            </Select>
            <Input label="Descrição *" value={form.descricao} onChange={F("descricao")}/>
            <Input label="Valor (R$) *" type="number" value={form.valor} onChange={F("valor")}/>
            <Input label="Data" type="date" value={form.data} onChange={F("data")}/>
            <Input label="Categoria" value={form.categoria} onChange={F("categoria")}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,justifyContent:"flex-end"}}>
            <Btn variant="ghost" onClick={()=>setModal(false)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14}/>Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ── RELATÓRIOS ──────────────────────────────────────────────────── */
function Relatorios({os, clientes, servicos, financeiro, isMobile}) {
  const totalOs = os.length;
  const finalizados = os.filter(o=>["Finalizado","Entregue"].includes(o.status)).length;
  const receita = os.filter(o=>["Finalizado","Entregue"].includes(o.status)).reduce((s,o)=>s+(o.valorTotal-o.desconto),0);
  const ticketMedio = finalizados ? receita/finalizados : 0;

  const svcCount = {};
  os.forEach(o=>o.servicos.forEach(sv=>{svcCount[sv.servicoId]=(svcCount[sv.servicoId]||{count:0,receita:0});svcCount[sv.servicoId].count++;svcCount[sv.servicoId].receita+=sv.preco;}));
  const scData = servicos.map(s=>({name:s.nome.length>14?s.nome.slice(0,14)+"…":s.nome,count:svcCount[s.id]?.count||0,receita:svcCount[s.id]?.receita||0})).filter(s=>s.count>0).sort((a,b)=>b.count-a.count).slice(0,6);

  const topClientes = [...clientes].sort((a,b)=>b.visitCount-a.visitCount).slice(0,5);

  const COLORS = ["var(--accent)","#3b82f6","#22c55e","#a855f7","#ef4444","#eab308"];

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{fontWeight:800,fontSize:isMobile?20:26}}>Relatórios</div>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4,1fr)",gap:12}}>
        <StatCard icon={ClipboardList} label="Total OS" value={totalOs} color="var(--accent)"/>
        <StatCard icon={CheckCircle2} label="Finalizadas" value={finalizados} color="#22c55e"/>
        <StatCard icon={DollarSign} label="Receita Total" value={fmtCurr(receita)} color="#3b82f6"/>
        <StatCard icon={TrendingUp} label="Ticket Médio" value={fmtCurr(ticketMedio)} color="#a855f7"/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12}}>
        <Card>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Serviços Mais Realizados</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scData} layout="vertical">
              <XAxis type="number" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{fill:"var(--text2)",fontSize:10}} axisLine={false} tickLine={false} width={100}/>
              <Tooltip contentStyle={{background:"var(--card)",border:"1px solid var(--border2)",borderRadius:8,fontSize:12}}/>
              <Bar dataKey="count" name="OS" fill="var(--accent)" radius={[0,5,5,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Receita por Serviço</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scData} layout="vertical">
              <XAxis type="number" tick={{fill:"var(--text3)",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`R$${v/1000}k`}/>
              <YAxis type="category" dataKey="name" tick={{fill:"var(--text2)",fontSize:10}} axisLine={false} tickLine={false} width={100}/>
              <Tooltip contentStyle={{background:"var(--card)",border:"1px solid var(--border2)",borderRadius:8,fontSize:12}} formatter={v=>[fmtCurr(v)]}/>
              <Bar dataKey="receita" name="Receita" fill="#22c55e" radius={[0,5,5,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>⭐ Clientes Mais Frequentes</div>
        {topClientes.length===0 ? <Empty icon={Users} msg="Sem dados"/> : (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {topClientes.map((c,i)=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:"var(--surface)",borderRadius:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:28,height:28,borderRadius:"50%",background:"var(--accent)22",color:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12}}>{i+1}</div>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{c.nome}</div>
                    <div style={{fontSize:10,color:"var(--text3)"}}>Última visita: {fmtDate(c.lastVisit)}</div>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontWeight:700}}>{c.visitCount} visitas</div>
                  <div style={{fontSize:11,color:"#eab308"}}>⭐ {c.pontos} pts</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── CONFIGURAÇÕES ───────────────────────────────────────────────── */
function Configuracoes({themeId, setThemeId, logo, setLogo, logoShape, setLogoShape, boxes, setBoxes, vehicleTypes, setVehicleTypes, horarioAbertura, setHorarioAbertura, horarioFechamento, setHorarioFechamento, intervaloMinutos, setIntervaloMinutos, isMobile}) {
  const [newType, setNewType] = useState("");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef();

  const saveBoxes = () => {
    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };

  const addType = () => {
    const t = newType.trim();
    if(!t||vehicleTypes.includes(t)) return;
    setVehicleTypes(p=>[...p,t]);
    setNewType("");
  };

  const remType = t => {
    if(BASE_VEHICLE_TYPES.includes(t)) return;
    setVehicleTypes(p=>p.filter(v=>v!==t));
  };

  return (
    <div className="anim-in" style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{fontWeight:800,fontSize:isMobile?20:26}}>Configurações</div>

      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <Palette size={16} color="var(--accent)"/>
          <div style={{fontWeight:700,fontSize:14}}>Paleta de Cores</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8}}>
          {THEMES.map(t=>(
            <button key={t.id} onClick={()=>setThemeId(t.id)} style={{padding:"8px 12px",borderRadius:10,border:`2px solid ${themeId===t.id?t.accent:"var(--border2)"}`,background:themeId===t.id?t.accent+"15":"var(--surface)",cursor:"pointer",display:"flex",alignItems:"center",gap:7,transition:".15s",fontFamily:"'Sora',sans-serif"}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:t.accent,flexShrink:0}}/>
              <span style={{fontSize:11,fontWeight:600,color:"var(--text)"}}>{t.label}</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <Upload size={16} color="var(--accent)"/>
          <div style={{fontWeight:700,fontSize:14}}>Logo do Estabelecimento</div>
        </div>
        <div style={{display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap"}}>
          <div style={{display:"flex",flexDirection:"column",gap:10,flex:1,minWidth:200}}>
            <div style={{display:"flex",gap:8}}>
              {["quadrado","retangular"].map(s=>(
                <button key={s} onClick={()=>setLogoShape(s)} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${logoShape===s?"var(--accent)":"var(--border2)"}`,background:logoShape===s?"var(--accent)":"var(--surface)",color:logoShape===s?"#fff":"var(--text2)",cursor:"pointer",fontSize:12,fontFamily:"'Sora',sans-serif"}}>{s[0].toUpperCase()+s.slice(1)}</button>
              ))}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setLogo(ev.target.result);r.readAsDataURL(f);}}/>
            <div style={{display:"flex",gap:8}}>
              <Btn variant="secondary" small onClick={()=>fileRef.current.click()}><Upload size={12}/>Carregar</Btn>
              {logo && <Btn variant="danger" small onClick={()=>setLogo(null)}><X size={12}/>Remover</Btn>}
            </div>
          </div>
          {logo && (
            <div style={{width:logoShape==="retangular"?160:80,height:80,borderRadius:8,overflow:"hidden",border:"1px solid var(--border2)",flexShrink:0}}>
              <img src={logo} alt="logo" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <Hash size={16} color="var(--accent)"/>
          <div style={{fontWeight:700,fontSize:14}}>Número de Boxes</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <button onClick={()=>setBoxes(p=>Math.max(1,p-1))} style={{width:36,height:36,borderRadius:9,border:"1px solid var(--border2)",background:"var(--surface)",color:"var(--text)",fontSize:18,cursor:"pointer"}}>-</button>
          <div style={{fontSize:42,fontWeight:800,color:"var(--accent)",minWidth:60,textAlign:"center"}}>{boxes}</div>
          <button onClick={()=>setBoxes(p=>Math.min(20,p+1))} style={{width:36,height:36,borderRadius:9,border:"1px solid var(--border2)",background:"var(--surface)",color:"var(--text)",fontSize:18,cursor:"pointer"}}>+</button>
          <Btn small onClick={saveBoxes}>{saved?"✓ Salvo":"Aplicar"}</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(72px,1fr))",gap:6}}>
          {Array.from({length:boxes},(_,i)=>i+1).map(n=>(
            <div key={n} style={{textAlign:"center",padding:"8px 4px",background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:8,fontSize:12,fontWeight:700}}>Box {n}</div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <Tag size={16} color="var(--accent)"/>
          <div style={{fontWeight:700,fontSize:14}}>Tipos de Veículo</div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <input value={newType} onChange={e=>setNewType(e.target.value)} placeholder="Novo tipo..." onKeyDown={e=>e.key==="Enter"&&addType()} style={{flex:1}}/>
          <Btn small onClick={addType}><Plus size={12}/>Adicionar</Btn>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {vehicleTypes.map(t=>{
            const isBase = BASE_VEHICLE_TYPES.includes(t);
            return (
              <div key={t} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:"var(--surface)",border:"1px solid var(--border2)",borderRadius:20,fontSize:12}}>
                <span>{t}</span>
                {!isBase && <button onClick={()=>remType(t)} style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",padding:0,display:"flex",alignItems:"center"}}><X size={11}/></button>}
                {isBase && <span style={{fontSize:9,color:"var(--text3)"}}>base</span>}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <Clock size={16} color="var(--accent)"/>
          <div style={{fontWeight:700,fontSize:14}}>Horário de Funcionamento</div>
        </div>
        <div style={{fontSize:12,color:"var(--text3)",marginBottom:12}}>Define os horários disponíveis para agendamentos e OS.</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
          <div>
            <label style={{fontSize:11,fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:4}}>Abertura</label>
            <input type="time" value={horarioAbertura} onChange={e=>setHorarioAbertura(e.target.value)} style={{width:"100%"}}/>
          </div>
          <div>
            <label style={{fontSize:11,fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:4}}>Fechamento</label>
            <input type="time" value={horarioFechamento} onChange={e=>setHorarioFechamento(e.target.value)} style={{width:"100%"}}/>
          </div>
        </div>
        <div style={{padding:"10px 14px",background:"var(--surface)",borderRadius:8,fontSize:12,color:"var(--text2)"}}>
          Expediente: <strong>{horarioAbertura}</strong> às <strong>{horarioFechamento}</strong> · {gerarSlots(horarioAbertura,horarioFechamento,intervaloMinutos).length} horários disponíveis
        </div>
      </Card>

      <Card>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <Clock size={16} color="var(--accent)"/>
          <div style={{fontWeight:700,fontSize:14}}>Intervalo entre Serviços</div>
        </div>
        <div style={{fontSize:12,color:"var(--text3)",marginBottom:12}}>Granularidade dos horários no calendário e agendamentos.</div>
        <div style={{display:"flex",gap:10}}>
          {[[30,"30 minutos"],[60,"1 hora"]].map(([v,l])=>(
            <button key={v} onClick={()=>setIntervaloMinutos(v)} style={{flex:1,padding:"12px 8px",borderRadius:10,border:`2px solid ${intervaloMinutos===v?"var(--accent)":"var(--border2)"}`,background:intervaloMinutos===v?"var(--accent)18":"var(--surface)",cursor:"pointer",fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:13,color:intervaloMinutos===v?"var(--accent)":"var(--text2)",transition:".15s"}}>
              {intervaloMinutos===v?"✓ ":""}{l}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── APP ROOT ────────────────────────────────────────────────────── */
export default function App({ session, onLogout }) {
  const [themeId, setThemeId] = useState("laranja");
  const [logo, setLogo] = useState(null);
  const [logoShape, setLogoShape] = useState("quadrado");
  const [boxes, setBoxes] = useState(6);
  const [vehicleTypes, setVehicleTypes] = useState([...BASE_VEHICLE_TYPES]);
  const [horarioAbertura, setHorarioAbertura] = useState("08:00");
  const [horarioFechamento, setHorarioFechamento] = useState("18:00");
  const [intervaloMinutos, setIntervaloMinutos] = useState(60);
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);

  const [clientes, setClientes] = useState(INIT_CLIENTES);
  const [veiculos, setVeiculos] = useState(INIT_VEICULOS);
  const [servicos, setServicos] = useState(INIT_SERVICOS);
  const [colaboradores, setColaboradores] = useState(INIT_COLABORADORES);
  const [estoque, setEstoque] = useState(INIT_ESTOQUE);
  const [os, setOs] = useState(INIT_OS);
  const [agendamentos, setAgendamentos] = useState(INIT_AGENDAMENTOS);
  const [financeiro, setFinanceiro] = useState(INIT_FINANCEIRO);

  useEffect(()=>{
    const handler = () => setIsMobile(window.innerWidth < 700);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  },[]);

  const theme = THEMES.find(t=>t.id===themeId)||THEMES[0];

  const NAV = [
    {id:"dashboard",   icon:LayoutDashboard, label:"Dashboard"},
    {id:"clientes",    icon:Users,           label:"Clientes"},
    {id:"veiculos",    icon:Car,             label:"Veículos"},
    {id:"agendamentos",icon:CalendarDays,    label:"Agendamentos"},
    {id:"os",          icon:ClipboardList,   label:"Ordens de Serviço"},
    {id:"servicos",    icon:Wrench,          label:"Serviços"},
    {id:"colaboradores",icon:User,           label:"Colaboradores"},
    {id:"estoque",     icon:Package,         label:"Estoque"},
    {id:"financeiro",  icon:DollarSign,      label:"Financeiro"},
    {id:"relatorios",  icon:BarChart2,       label:"Relatórios"},
    {id:"config",      icon:Settings,        label:"Configurações"},
  ];

  const nav = id => { setActive(id); setSidebarOpen(false); };
  const today = td();
  const lowStock = estoque.filter(e=>e.quantidade<=e.minimo).length;
  const agHoje = agendamentos.filter(a=>a.data===today).length;

  const Sidebar = () => (
    <div style={{width:220,background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",height:"100%",flexShrink:0}}>
      <div style={{padding:"16px 14px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",gap:10}}>
        {logo ? (
          <img src={logo} alt="logo" style={{width:logoShape==="retangular"?120:36,height:36,objectFit:"contain",borderRadius:6}}/>
        ) : (
          <div style={{width:36,height:36,borderRadius:10,background:"var(--accent)22",color:"var(--accent)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,flexShrink:0}}>EA</div>
        )}
        {!logo && <div>
          <div style={{fontWeight:800,fontSize:13}}>EstéticaAuto</div>
          <div style={{fontSize:9,color:"var(--text3)"}}>ERP Sistema</div>
        </div>}
      </div>
      <nav style={{flex:1,overflowY:"auto",padding:"8px 0"}}>
        {NAV.map(({id,icon:Icon,label})=>(
          <button key={id} onClick={()=>nav(id)} style={{width:"100%",display:"flex",alignItems:"center",gap:9,padding:"9px 14px",background:active===id?"var(--accent)18":"transparent",color:active===id?"var(--accent)":"var(--text2)",border:"none",cursor:"pointer",fontSize:12,fontWeight:active===id?700:400,borderRight:active===id?"2px solid var(--accent)":"2px solid transparent",textAlign:"left",transition:".15s",fontFamily:"'Sora',sans-serif"}}>
            <Icon size={15}/>
            <span style={{flex:1}}>{label}</span>
            {id==="estoque"&&lowStock>0&&<span style={{background:"#ef4444",color:"#fff",borderRadius:20,padding:"1px 6px",fontSize:9,fontWeight:700}}>{lowStock}</span>}
            {id==="agendamentos"&&agHoje>0&&<span style={{background:"var(--accent)",color:"#fff",borderRadius:20,padding:"1px 6px",fontSize:9,fontWeight:700}}>{agHoje}</span>}
          </button>
        ))}
      </nav>
      <div style={{padding:"10px 14px",borderTop:"1px solid var(--border)",fontSize:10,color:"var(--text3)",textAlign:"center"}}>v3.0 · {fmtDate(today)}</div>
    </div>
  );

  const renderModule = () => {
    const props = {isMobile,clientes,veiculos,servicos,colaboradores,estoque,os,agendamentos,financeiro,vehicleTypes,boxes};
    const setters = {setClientes,setVeiculos,setServicos,setColaboradores,setEstoque,setOs,setAgendamentos,setFinanceiro};
    switch(active) {
      case "dashboard":    return <Dashboard os={os} clientes={clientes} agendamentos={agendamentos} estoque={estoque} financeiro={financeiro} isMobile={isMobile}/>;
      case "clientes":     return <Clientes clientes={clientes} setClientes={setClientes} isMobile={isMobile}/>;
      case "veiculos":     return <Veiculos veiculos={veiculos} setVeiculos={setVeiculos} clientes={clientes} vehicleTypes={vehicleTypes} isMobile={isMobile}/>;
      case "agendamentos": return <Agendamentos agendamentos={agendamentos} setAgendamentos={setAgendamentos} clientes={clientes} veiculos={veiculos} servicos={servicos} colaboradores={colaboradores} vehicleTypes={vehicleTypes} horarioAbertura={horarioAbertura} horarioFechamento={horarioFechamento} intervaloMinutos={intervaloMinutos} isMobile={isMobile}/>;
      case "os":           return <OrdensServico os={os} setOs={setOs} clientes={clientes} setClientes={setClientes} veiculos={veiculos} servicos={servicos} colaboradores={colaboradores} agendamentos={agendamentos} setAgendamentos={setAgendamentos} boxes={boxes} horarioAbertura={horarioAbertura} horarioFechamento={horarioFechamento} intervaloMinutos={intervaloMinutos} isMobile={isMobile}/>;
      case "servicos":     return <Servicos servicos={servicos} setServicos={setServicos} vehicleTypes={vehicleTypes} isMobile={isMobile}/>;
      case "colaboradores":return <Colaboradores colaboradores={colaboradores} setColaboradores={setColaboradores} isMobile={isMobile}/>;
      case "estoque":      return <Estoque estoque={estoque} setEstoque={setEstoque} isMobile={isMobile}/>;
      case "financeiro":   return <Financeiro financeiro={financeiro} setFinanceiro={setFinanceiro} isMobile={isMobile}/>;
      case "relatorios":   return <Relatorios os={os} clientes={clientes} servicos={servicos} financeiro={financeiro} isMobile={isMobile}/>;
      case "config":       return <Configuracoes themeId={themeId} setThemeId={setThemeId} logo={logo} setLogo={setLogo} logoShape={logoShape} setLogoShape={setLogoShape} boxes={boxes} setBoxes={setBoxes} vehicleTypes={vehicleTypes} setVehicleTypes={setVehicleTypes} horarioAbertura={horarioAbertura} setHorarioAbertura={setHorarioAbertura} horarioFechamento={horarioFechamento} setHorarioFechamento={setHorarioFechamento} intervaloMinutos={intervaloMinutos} setIntervaloMinutos={setIntervaloMinutos} isMobile={isMobile}/>;
      default: return null;
    }
  };

  const currentNav = NAV.find(n=>n.id===active);

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)"}}>
      <style>{makeCSS(theme)}</style>

      {/* TOPBAR */}
      <div style={{position:"fixed",top:0,left:isMobile?0:220,right:0,height:52,background:"var(--surface)",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",padding:"0 16px",gap:10,zIndex:100}}>
        {isMobile && (
          <button onClick={()=>setSidebarOpen(true)} style={{background:"none",border:"none",color:"var(--text2)",cursor:"pointer",padding:4,display:"flex",alignItems:"center"}}><Menu size={20}/></button>
        )}
        <div style={{fontWeight:700,fontSize:14,flex:1}}>
          {currentNav?.label||"Dashboard"}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{fontSize:10,color:"var(--text3)"}}>{fmtDate(today)}</div>
          {session?.user?.email && <div style={{fontSize:10,color:"var(--text3)",display:"flex",alignItems:"center",gap:4,padding:"3px 8px",background:"var(--surface)",borderRadius:20,border:"1px solid var(--border)"}}>{session.user.email.split("@")[0]}</div>}
          {Array.from({length:Math.min(boxes,5)},(_,i)=>{
            const inUse=os.filter(o=>o.boxId===i+1&&["Aguardando","Em Execução"].includes(o.status)).length>0;
            return <div key={i} style={{width:8,height:8,borderRadius:2,background:inUse?"var(--accent)":"var(--border2)"}} title={`Box ${i+1}: ${inUse?"Ocupado":"Livre"}`}/>;
          })}
          {onLogout && <button onClick={onLogout} title="Sair" style={{background:"none",border:"none",color:"var(--text3)",cursor:"pointer",padding:4,display:"flex",alignItems:"center",marginLeft:4}}><LogOut size={15}/></button>}
        </div>
      </div>

      {/* SIDEBAR MOBILE OVERLAY */}
      {isMobile && sidebarOpen && (
        <div style={{position:"fixed",inset:0,zIndex:200,display:"flex"}}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.6)"}} onClick={()=>setSidebarOpen(false)}/>
          <div style={{position:"relative",width:220,zIndex:1,height:"100%"}}>
            <Sidebar/>
          </div>
        </div>
      )}

      {/* SIDEBAR DESKTOP */}
      {!isMobile && (
        <div style={{position:"fixed",left:0,top:0,bottom:0,width:220,zIndex:50}}>
          <Sidebar/>
        </div>
      )}

      {/* MAIN */}
      <div style={{marginLeft:isMobile?0:220,paddingTop:68,padding:isMobile?"68px 12px 24px":"68px 24px 24px 244px",minHeight:"100vh"}}>
        {renderModule()}
      </div>
    </div>
  );
}
