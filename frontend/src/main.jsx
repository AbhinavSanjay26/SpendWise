import React,{useEffect,useMemo,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion,AnimatePresence} from 'framer-motion';
import {LayoutDashboard,ReceiptIndianRupee,ChartPie,TrendingUp,RefreshCw,FlaskConical,Lightbulb,Settings,UserCircle,Search,Bell,ChevronRight,Plus,ArrowUpRight,AlertTriangle,CalendarDays,Wallet,ShoppingBag,Utensils,Car,Film,BrainCircuit,Menu,X,Sparkles} from 'lucide-react';
import {ResponsiveContainer,PieChart,Pie,Cell,Tooltip,LineChart,Line,XAxis,YAxis,CartesianGrid,BarChart,Bar} from 'recharts';
import {getExpenses,addExpense,getPatterns,getPrediction,getSubscriptions,whatIf} from './services/api';
import './index.css';

const COLORS=['#22d3ee','#60a5fa','#a78bfa','#34d399','#f59e0b','#fb7185','#f472b6','#818cf8','#2dd4bf'];
const nav=[['Dashboard',LayoutDashboard],['Expenses',ReceiptIndianRupee],['Spending Analysis',ChartPie],['Predictions',TrendingUp],['Subscriptions',RefreshCw],['What-If Simulator',FlaskConical],['Insights',Lightbulb]];
const money=n=>`₹${Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:2})}`;
function App(){
 const [page,setPage]=useState('Dashboard'),[collapsed,setCollapsed]=useState(false),[mobile,setMobile]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState(false),[expenses,setExpenses]=useState([]),[patterns,setPatterns]=useState(null),[prediction,setPrediction]=useState(null),[subs,setSubs]=useState([]),[refresh,setRefresh]=useState(0),[modal,setModal]=useState(false),[selected,setSelected]=useState(null);
 const load=async()=>{setLoading(true);setError(false);try{const [e,p,pr,s]=await Promise.all([getExpenses(),getPatterns(),getPrediction(),getSubscriptions()]);setExpenses(e);setPatterns(p);setPrediction(pr);setSubs(s.subscriptions||[])}catch(e){setError(true)}finally{setLoading(false)}};
 useEffect(()=>{load()},[refresh]);
 const go=p=>{setPage(p);setMobile(false)};
 return <div className="min-h-screen text-slate-100 grid-bg">{mobile&&<div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={()=>setMobile(false)}/>}<aside className={`${mobile?'translate-x-0':'-translate-x-full lg:translate-x-0'} fixed z-50 left-0 top-0 h-screen ${collapsed?'w-20':'w-72'} bg-[#081525]/95 border-r border-slate-700/30 transition-all duration-300 p-4 flex flex-col`}>
   <div className="flex items-center gap-3 px-2 py-3 mb-8"><div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-600 flex items-center justify-center text-[#06111f] font-black shadow-lg shadow-cyan-500/20">PEI</div>{!collapsed&&<div><div className="font-bold">Personal Expense</div><div className="text-xs text-slate-400">Intelligence System</div></div>}<button className="ml-auto lg:hidden" onClick={()=>setMobile(false)}><X/></button></div>
   <div className="space-y-2">{nav.map(([name,Icon])=><Nav key={name} name={name} Icon={Icon} active={page===name} collapsed={collapsed} onClick={()=>go(name)}/>)}</div>
   <div className="mt-auto space-y-2"><Nav name="Settings" Icon={Settings} collapsed={collapsed} active={page==='Settings'} onClick={()=>go('Settings')}/><Nav name="Profile" Icon={UserCircle} collapsed={collapsed} active={page==='Profile'} onClick={()=>go('Profile')}/><button onClick={()=>setCollapsed(!collapsed)} className="hidden lg:flex w-full items-center justify-center py-2 text-slate-500 hover:text-white">{collapsed?'→':'←'} </button></div>
 </aside>
 <main className={`${collapsed?'lg:ml-20':'lg:ml-72'} transition-all duration-300`}><header className="sticky top-0 z-30 h-20 bg-[#07111f]/75 backdrop-blur-xl border-b border-slate-700/20 px-5 lg:px-10 flex items-center gap-4"><button className="lg:hidden p-2 glass rounded-xl" onClick={()=>setMobile(true)}><Menu/></button><div className="flex-1"><div className="font-semibold">Good evening 👋</div><div className="text-xs text-slate-400">Here's your financial intelligence overview.</div></div><button className="hidden md:flex p-3 rounded-xl glass hover:scale-105 transition"><Search size={18}/></button><button className="p-3 rounded-xl glass hover:scale-105 transition"><Bell size={18}/></button><div className="hidden sm:flex items-center gap-2 px-3 py-2 glass rounded-xl text-sm"><CalendarDays size={16} className="text-cyan-300"/> Sep 2026</div><div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 flex items-center justify-center text-sm font-bold text-[#06111f]">AS</div></header>
 <div className="p-5 lg:p-10 max-w-[1600px] mx-auto">{error?<ErrorState retry={()=>setRefresh(x=>x+1)}/>:loading?<Loader/>:<AnimatePresence mode="wait"><motion.div key={page} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>{page==='Dashboard'?<Dashboard patterns={patterns} prediction={prediction} subs={subs} expenses={expenses} go={go}/>:page==='Expenses'?<Expenses expenses={expenses} open={()=>setModal(true)}/>:page==='Spending Analysis'?<Analysis patterns={patterns}/>:page==='Predictions'?<Predictions prediction={prediction} patterns={patterns}/>:page==='Subscriptions'?<Subscriptions subs={subs}/>:page==='What-If Simulator'?<WhatIf patterns={patterns}/>:page==='Insights'?<Insights patterns={patterns} expenses={expenses} subs={subs}/>:page==='Settings'?<SettingsPage/>:<ProfilePage patterns={patterns} expenses={expenses}/>}</motion.div></AnimatePresence>}</div></main>
 {modal&&<ExpenseModal close={()=>setModal(false)} onAdded={()=>{setModal(false);setRefresh(x=>x+1)}}/>}</div>
}
function Nav({name,Icon,active,collapsed,onClick}){return <button title={collapsed?name:''} onClick={onClick} className={`group w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${active?'bg-cyan-400/10 text-cyan-200 shadow-lg shadow-cyan-500/5':'text-slate-400 hover:text-white hover:bg-white/5 hover:translate-x-1'}`}><Icon size={19} className="group-hover:scale-110 transition"/>{!collapsed&&<span>{name}</span>}{active&&!collapsed&&<span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_#22d3ee]"/>}</button>}
const Card=({children,className=''})=><motion.div whileHover={{y:-4}} className={`glass rounded-2xl ${className}`}>{children}</motion.div>;
function Dashboard({patterns,prediction,subs,expenses,go}){const cats=Object.entries(patterns.category_spending||{}).map(([name,value],i)=>({name,value,percent:patterns.category_percentages?.[name]||0,color:COLORS[i%COLORS.length]}));const monthly=Object.entries(patterns.monthly_spending||{}).sort().map(([month,total])=>({month,total}));return <div className="space-y-6">
 <section className="relative overflow-hidden rounded-3xl p-7 lg:p-10 bg-gradient-to-br from-[#102a45] via-[#0b2037] to-[#091526] border border-cyan-300/10"><div className="absolute -right-20 -top-24 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"/><div className="relative max-w-3xl"><div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-300/10 text-cyan-200 text-xs border border-cyan-300/10"><Sparkles size={14}/> AI-powered financial intelligence</div><h1 className="text-4xl lg:text-6xl font-black tracking-tight mt-5">Your Money.<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">Smarter Decisions.</span></h1><p className="text-slate-400 mt-4 max-w-xl">Understand your spending, detect unusual behavior, predict the future and simulate decisions before they happen.</p><button onClick={()=>go('Insights')} className="mt-7 group px-5 py-3 rounded-xl bg-cyan-300 text-[#06111f] font-bold hover:scale-105 transition shadow-xl shadow-cyan-500/15">Explore Insights <ArrowUpRight className="inline ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition" size={17}/></button></div><div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-cyan-300/10 items-center justify-center"><div className="w-44 h-44 rounded-full border border-blue-400/20 animate-pulse flex items-center justify-center"><BrainCircuit size={72} className="text-cyan-300"/></div></div></section>
 <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{[['Total Spending',patterns.total_spending,Wallet,'Across analyzed transactions'],['Average Expense',patterns.average_expense,ReceiptIndianRupee,'Average transaction value'],['Transactions',patterns.total_transactions,ChartPie,'Expenses analyzed'],['Predicted Next Month',prediction.predicted_amount,TrendingUp,'Historical spending forecast']].map(([label,val,I,tip])=><Card key={label} className="p-5"><div className="flex items-start justify-between"><div className="w-10 h-10 rounded-xl bg-cyan-300/10 flex items-center justify-center text-cyan-300"><I size={19}/></div><span className="text-xs text-emerald-300 flex items-center gap-1"><ArrowUpRight size={13}/> intelligence</span></div><div className="mt-5 text-xs text-slate-400">{label}</div><div className="text-2xl font-bold mt-1">{label==='Transactions'?val:money(val)}</div><div className="text-[11px] text-slate-500 mt-2">{tip}</div></Card>)}</div>
 <div className="grid xl:grid-cols-5 gap-5"><Card className="xl:col-span-2 p-6"><SectionTitle title="Where Your Money Goes" sub="Category distribution"/><div className="h-72"><ResponsiveContainer><PieChart><Pie data={cats} dataKey="value" nameKey="name" innerRadius={75} outerRadius={105} paddingAngle={3} onClick={(d)=>go('Spending Analysis')}><>{cats.map((c,i)=><Cell key={i} fill={c.color}/>)}</></Pie><Tooltip contentStyle={{background:'#0b1727',border:'1px solid #26364b',borderRadius:12,color:'#fff'}} formatter={(v,n,p)=>[money(v),n]}/></PieChart></ResponsiveContainer></div><div className="space-y-2">{cats.slice(0,5).map(c=><div key={c.name} className="flex items-center gap-3 text-sm hover:bg-white/5 p-2 rounded-lg cursor-pointer"><span className="w-2.5 h-2.5 rounded-full" style={{background:c.color}}/><span className="flex-1">{c.name}</span><span>{money(c.value)}</span><span className="text-slate-500 w-14 text-right">{c.percent}%</span></div>)}</div></Card>
 <Card className="xl:col-span-3 p-6"><SectionTitle title="Spending Trend" sub="Monthly spending activity"/><div className="h-[410px]"><ResponsiveContainer><BarChart data={monthly} margin={{top:20,right:10,left:0,bottom:10}}><CartesianGrid strokeDasharray="3 3" stroke="#1e334b"/><XAxis dataKey="month" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{background:'#0b1727',border:'1px solid #26364b',borderRadius:12}} formatter={v=>money(v)}/><Bar dataKey="total" fill="#22d3ee" radius={[8,8,0,0]} animationDuration={1000}/></BarChart></ResponsiveContainer></div></Card></div>
 <div className="grid lg:grid-cols-3 gap-5"><Card className="p-6 lg:col-span-2"><SectionTitle title="AI Financial Insights" sub="Signals generated from your spending data"/><div className="grid md:grid-cols-2 gap-3 mt-5"><Insight icon="🍔" text={`${patterns.highest_spending_category} is your largest spending category.`}/><Insight icon="⚠️" text={`${patterns.highest_expense?.description} is your highest individual expense at ${money(patterns.highest_expense?.amount)}.`}/><Insight icon="📈" text={`${monthly.length?monthly[monthly.length-1].month:'Current month'} currently has ${money(monthly.length?monthly[monthly.length-1].total:0)} in spending.`}/><Insight icon="🎬" text={subs.length?`You have ${subs.length} recurring subscription${subs.length>1?'s':''}.`:'No recurring subscriptions detected yet.'}/></div></Card><Card className="p-6"><SectionTitle title="Intelligence Pipeline" sub="How PEI thinks"/><div className="mt-5 space-y-3">{['Track Expenses','ML Categorization','Spending Analysis','Anomaly Detection','Future Prediction','What-If Simulation'].map((x,i)=><div key={x} className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-cyan-300/10 text-cyan-300 flex items-center justify-center text-xs font-bold">0{i+1}</div><div className="text-sm">{x}</div>{i<5&&<ChevronRight size={14} className="ml-auto text-slate-600"/>}</div>)}</div></Card></div>
 <Card className="p-6"><div className="flex flex-col md:flex-row md:items-center justify-between gap-4"><div><SectionTitle title="What If I Spend...?" sub="Simulate a decision without changing your database"/><p className="text-sm text-slate-400 mt-3">Test a hypothetical expense and see its impact instantly.</p></div><button onClick={()=>go('What-If Simulator')} className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 text-[#06111f] font-bold hover:scale-105 transition">Open Simulator <ArrowUpRight className="inline ml-1" size={16}/></button></div></Card>
 </div>}
function SectionTitle({title,sub}){return <div><h2 className="text-lg font-bold">{title}</h2><p className="text-xs text-slate-500 mt-1">{sub}</p></div>}
function Insight({icon,text}){return <motion.div whileHover={{scale:1.02}} className="p-4 rounded-xl bg-white/[.03] border border-white/5 flex gap-3"><span className="text-xl">{icon}</span><p className="text-sm text-slate-300 leading-6">{text}</p></motion.div>}
function Expenses({expenses,open}){const [q,setQ]=useState(''),[cat,setCat]=useState('All');const cats=['All',...new Set(expenses.map(e=>e.category))];const rows=expenses.filter(e=>(cat==='All'||e.category===cat)&&`${e.description} ${e.category}`.toLowerCase().includes(q.toLowerCase()));return <div className="space-y-5"><div className="flex flex-col md:flex-row gap-3 md:items-center justify-between"><div><h1 className="text-3xl font-bold">Expenses</h1><p className="text-slate-500 text-sm mt-1">Your categorized transaction history.</p></div><button onClick={open} className="px-5 py-3 rounded-xl bg-cyan-300 text-[#06111f] font-bold hover:scale-105 transition"><Plus className="inline mr-1" size={17}/> Add Expense</button></div><Card className="overflow-hidden"><div className="p-4 flex gap-3 border-b border-white/5"><div className="flex-1 relative"><Search className="absolute left-3 top-3 text-slate-500" size={17}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search expenses..." className="w-full bg-white/[.04] border border-white/5 rounded-xl py-2.5 pl-10 pr-3 outline-none focus:border-cyan-400/40"/></div><select value={cat} onChange={e=>setCat(e.target.value)} className="bg-[#0b1727] border border-white/5 rounded-xl px-3 text-sm">{cats.map(c=><option key={c}>{c}</option>)}</select></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs text-slate-500 border-b border-white/5">{['Date','Description','Category','Amount','Payment Method','Status'].map(x=><th key={x} className="p-4 font-medium">{x}</th>)}</tr></thead><tbody>{rows.map(e=><tr key={e.id} className="border-b border-white/5 hover:bg-white/[.035] transition"><td className="p-4 text-slate-400">{e.date}</td><td className="p-4 font-medium">{e.description}</td><td className="p-4"><span className="px-2.5 py-1 rounded-full bg-cyan-300/10 text-cyan-200 text-xs">{e.category}</span></td><td className="p-4 font-semibold">{money(e.amount)}</td><td className="p-4 text-slate-400">{e.payment_method}</td><td className="p-4"><span className="text-emerald-300 text-xs">Categorized</span></td></tr>)}</tbody></table></div></Card></div>}
function Analysis({patterns}){return <div className="space-y-6"><Title title="Spending Analysis" sub="Understand where your money is going."/><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4"><Metric title="Total Spending" value={money(patterns.total_spending)}/><Metric title="Average Transaction" value={money(patterns.average_expense)}/><Metric title="Top Category" value={patterns.highest_spending_category}/><Metric title="Largest Expense" value={money(patterns.highest_expense?.amount)}/></div><Card className="p-6"><SectionTitle title="Category Breakdown" sub="Amount and share of total spending"/><div className="mt-5 space-y-4">{Object.entries(patterns.category_spending).map(([c,v],i)=><div key={c}><div className="flex justify-between text-sm mb-2"><span>{c}</span><span>{money(v)} · {patterns.category_percentages[c]}%</span></div><div className="h-2 rounded-full bg-slate-800 overflow-hidden"><motion.div initial={{width:0}} animate={{width:`${patterns.category_percentages[c]}%`}} className="h-full rounded-full" style={{background:COLORS[i%COLORS.length]}}/></div></div>)}</div></Card></div>}
function Predictions({prediction,patterns}){const hist=Object.entries(patterns.monthly_spending||{}).sort().map(([month,total])=>({month,total}));if(prediction?.predicted_amount)hist.push({month:'Forecast',total:prediction.predicted_amount});return <div className="space-y-6"><Title title="Future Prediction" sub="Historical spending used to estimate your next month."/><Card className="p-7 bg-gradient-to-br from-[#0e2840] to-[#0b1727]"><div className="text-sm text-slate-400">Predicted next-month spending</div><div className="text-5xl font-black mt-2 text-cyan-300">{money(prediction?.predicted_amount)}</div><p className="text-slate-400 mt-3">Based on {prediction?.months_analyzed||0} months of historical data.</p><div className="h-80 mt-6"><ResponsiveContainer><LineChart data={hist}><CartesianGrid stroke="#1e334b" strokeDasharray="3 3"/><XAxis dataKey="month" stroke="#64748b"/><YAxis stroke="#64748b"/><Tooltip contentStyle={{background:'#0b1727',border:'1px solid #26364b',borderRadius:12}} formatter={v=>money(v)}/><Line type="monotone" dataKey="total" stroke="#22d3ee" strokeWidth={3} dot={{r:5}}/></LineChart></ResponsiveContainer></div></Card><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{Object.entries(prediction?.category_predictions||{}).map(([c,v])=><Metric key={c} title={c} value={money(v)}/>)}</div></div>}
function Subscriptions({subs}){const total=subs.reduce((a,s)=>a+Number(s.average_amount||0),0);return <div className="space-y-6"><Title title="Recurring Subscriptions" sub="Recurring expenses detected from transaction patterns."/><div className="grid sm:grid-cols-2 gap-4"><Metric title="Monthly Subscription Cost" value={money(total)}/><Metric title="Detected Subscriptions" value={subs.length}/></div><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{subs.map((s,i)=><Card key={s.description} className="p-6"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-purple-400/10 text-purple-300 flex items-center justify-center"><RefreshCw/></div><div><div className="font-bold capitalize">{s.description}</div><div className="text-xs text-slate-500">{s.frequency}</div></div></div><div className="text-3xl font-black mt-6">{money(s.average_amount)}<span className="text-sm text-slate-500"> / month</span></div><div className="mt-4 flex justify-between text-xs text-slate-400"><span>Confidence</span><span className="text-emerald-300">{s.confidence}%</span></div></Card>)}</div>{!subs.length&&<Empty text="No recurring subscriptions detected yet."/>}</div>}
function WhatIf({patterns}){const [amount,setAmount]=useState(3000),[cat,setCat]=useState('Shopping'),[result,setResult]=useState(null),[busy,setBusy]=useState(false);const cats=Object.keys(patterns.category_spending||{});const run=async()=>{setBusy(true);try{setResult(await whatIf(amount,cat))}finally{setBusy(false)}};return <div className="space-y-6"><Title title="What-If Simulator" sub="Explore the impact of a hypothetical expense without changing your database."/><Card className="p-7 lg:p-10"><div className="grid lg:grid-cols-2 gap-10"><div><div className="text-sm text-slate-400">What if I spend...</div><div className="flex items-center gap-2 mt-3"><span className="text-4xl font-black">₹</span><input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="bg-transparent text-5xl font-black w-full outline-none"/></div><input type="range" min="100" max="20000" step="100" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-full mt-7 accent-cyan-300"/><label className="block text-sm text-slate-400 mt-8 mb-2">Category</label><select value={cat} onChange={e=>setCat(e.target.value)} className="w-full bg-[#0b1727] border border-white/10 rounded-xl p-3">{cats.map(c=><option key={c}>{c}</option>)}</select><button onClick={run} disabled={busy} className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-500 text-[#06111f] font-bold hover:scale-[1.02] transition">{busy?'Simulating...':'Simulate Impact'} <ArrowUpRight className="inline" size={17}/></button></div><div className="rounded-2xl bg-black/20 p-6 border border-white/5">{result?<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}><div className="text-xs text-slate-500">PROJECTED SPENDING</div><div className="text-4xl font-black text-cyan-300 mt-2">{money(result.projected_total_spending)}</div><div className="grid grid-cols-2 gap-3 mt-7"><Metric title="Current" value={money(result.current_total_spending)}/><Metric title="Projected" value={money(result.projected_total_spending)}/><Metric title={`Current ${result.category}`} value={money(result.current_category_spending)}/><Metric title={`Projected ${result.category}`} value={money(result.projected_category_spending)}/></div><div className="mt-5 p-4 rounded-xl bg-cyan-300/5 border border-cyan-300/10 text-sm text-slate-300">{result.message} Your {result.category} share would change from <b>{result.current_category_percentage}%</b> to <b>{result.projected_category_percentage}%</b>.</div></motion.div>:<div className="h-full min-h-72 flex flex-col items-center justify-center text-center"><FlaskConical size={48} className="text-cyan-300/50"/><h3 className="font-bold mt-4">Ready to simulate</h3><p className="text-sm text-slate-500 mt-2">Choose an amount and category to see the financial impact.</p></div>}</div></div></Card></div>}
function Insights({patterns,expenses,subs}){return <div className="space-y-6"><Title title="AI Financial Insights" sub="Signals derived from your current expense data."/><div className="grid md:grid-cols-2 gap-4"><Insight icon="🍔" text={`${patterns.highest_spending_category} accounts for ${patterns.category_percentages?.[patterns.highest_spending_category]}% of your analyzed spending.`}/><Insight icon="⚠️" text={`Your largest recorded expense is ${money(patterns.highest_expense?.amount)} for ${patterns.highest_expense?.description}.`}/><Insight icon="🧠" text={`The system has analyzed ${patterns.total_transactions} transactions across ${Object.keys(patterns.category_spending||{}).length} categories.`}/><Insight icon="🔄" text={subs.length?`${subs.length} recurring subscription${subs.length>1?'s':''} detected.`:'No recurring subscriptions have been detected.'}/></div><Card className="p-7"><SectionTitle title="Track → Understand → Detect → Predict → Simulate" sub="The intelligence pipeline behind your application"/><div className="grid md:grid-cols-3 lg:grid-cols-6 gap-3 mt-7">{['Track','Understand','Detect','Predict','Simulate'].map((x,i)=><motion.div whileHover={{scale:1.04}} key={x} className="p-5 rounded-xl bg-white/[.03] border border-white/5 text-center"><div className="text-cyan-300 font-black text-xl">0{i+1}</div><div className="mt-3 font-semibold">{x}</div></motion.div>)}</div></Card></div>}
function Metric({title,value}){return <div className="p-4 rounded-xl bg-white/[.035] border border-white/5"><div className="text-xs text-slate-500">{title}</div><div className="font-bold mt-1 break-words">{value}</div></div>}
function Title({title,sub}){return <div><h1 className="text-3xl lg:text-4xl font-black">{title}</h1><p className="text-slate-500 mt-2">{sub}</p></div>}
function Loader(){return <div className="space-y-5 animate-pulse"><div className="h-64 rounded-3xl bg-white/5"/><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i=><div className="h-32 rounded-2xl bg-white/5" key={i}/>)}</div><div className="h-96 rounded-2xl bg-white/5"/></div>}
function ErrorState({retry}){return <div className="min-h-[70vh] flex items-center justify-center"><div className="text-center"><div className="w-16 h-16 rounded-2xl bg-orange-400/10 text-orange-300 flex items-center justify-center mx-auto"><AlertTriangle/></div><h2 className="text-2xl font-bold mt-5">Unable to connect to intelligence engine</h2><p className="text-slate-500 mt-2">Make sure your FastAPI backend is running on port 8000.</p><button onClick={retry} className="mt-5 px-5 py-3 rounded-xl bg-cyan-300 text-[#06111f] font-bold">Retry</button></div></div>}
function Empty({text}){return <Card className="p-10 text-center text-slate-500">{text}</Card>}
function ExpenseModal({close,onAdded}){const [form,setForm]=useState({amount:'',description:'',date:new Date().toISOString().slice(0,10),payment_method:'UPI'}),[res,setRes]=useState(null),[busy,setBusy]=useState(false);const submit=async e=>{e.preventDefault();setBusy(true);try{setRes(await addExpense({...form,amount:Number(form.amount)}));setTimeout(onAdded,1000)}catch(err){setRes({error:'Unable to add expense'})}finally{setBusy(false)}};return <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"><motion.div initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} className="glass rounded-2xl w-full max-w-lg p-6"><div className="flex justify-between"><div><h2 className="text-xl font-bold">Add Expense</h2><p className="text-xs text-slate-500 mt-1">ML will categorize it automatically.</p></div><button onClick={close}><X/></button></div>{res?.error?<div className="mt-5 text-orange-300">{res.error}</div>:res?<div className="mt-6 p-5 rounded-xl bg-cyan-300/5 border border-cyan-300/10"><div className="text-cyan-300 font-bold">Expense Added ✓</div><div className="mt-3">Category: <b>{res.category}</b></div><div className="text-sm text-slate-400 mt-1">Confidence: {res.category_confidence}%</div><div className="text-sm text-slate-400 mt-1">Unusual: {res.unusual_spending?.is_unusual?'Yes':'No'}</div></div>:<form onSubmit={submit} className="mt-6 space-y-4">{[['amount','Amount'],['description','Description'],['date','Date']].map(([k,l])=><div key={k}><label className="text-xs text-slate-400">{l}</label><input required type={k==='amount'?'number':k==='date'?'date':'text'} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="mt-1 w-full bg-white/[.04] border border-white/10 rounded-xl p-3 outline-none focus:border-cyan-300/40"/></div>)}<div><label className="text-xs text-slate-400">Payment Method</label><select value={form.payment_method} onChange={e=>setForm({...form,payment_method:e.target.value})} className="mt-1 w-full bg-[#0b1727] border border-white/10 rounded-xl p-3"><option>UPI</option><option>Card</option><option>Cash</option><option>Bank Transfer</option></select></div><button disabled={busy} className="w-full py-3 rounded-xl bg-cyan-300 text-[#06111f] font-bold">{busy?'Analyzing...':'Add Expense'}</button></form>}</motion.div></div>}

function SettingsPage(){
 const [notifications,setNotifications]=useState(true);
 const [aiInsights,setAiInsights]=useState(true);

 return <div className="space-y-6">
  <Title title="Settings" sub="Manage your Personal Expense Intelligence System preferences."/>

  <Card className="p-6 lg:p-8">
   <div className="flex items-center gap-4 mb-7">
    <div className="w-12 h-12 rounded-xl bg-cyan-300/10 text-cyan-300 flex items-center justify-center">
     <Settings size={22}/>
    </div>
    <div>
     <h2 className="font-bold text-lg">Application Settings</h2>
     <p className="text-sm text-slate-500">Customize how your dashboard behaves.</p>
    </div>
   </div>

   <div className="space-y-4">
    <SettingToggle
     title="Notifications"
     description="Receive alerts about unusual spending."
     enabled={notifications}
     onToggle={()=>setNotifications(v=>!v)}
    />

    <SettingToggle
     title="AI Financial Insights"
     description="Show intelligent spending insights on the dashboard."
     enabled={aiInsights}
     onToggle={()=>setAiInsights(v=>!v)}
    />

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-white/[.035] border border-white/5">
     <div>
      <div className="font-semibold">Currency</div>
      <div className="text-sm text-slate-500 mt-1">Currency used throughout the application.</div>
     </div>
     <div className="px-4 py-2 rounded-lg bg-[#0b1727] border border-white/10 text-cyan-300 font-semibold w-fit">₹ INR</div>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-white/[.035] border border-white/5">
     <div>
      <div className="font-semibold">Backend Connection</div>
      <div className="text-sm text-slate-500 mt-1">FastAPI intelligence engine</div>
     </div>
     <div className="flex items-center gap-2 text-emerald-300 text-sm">
      <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399]"/>
      Connected
     </div>
    </div>
   </div>
  </Card>

  <Card className="p-6">
   <h2 className="font-bold text-lg">About the Application</h2>
   <p className="text-sm text-slate-400 mt-2">Personal Expense Intelligence System</p>
   <p className="text-sm text-slate-500 mt-1">Track → Understand → Detect → Predict → Simulate</p>
   <div className="mt-4 text-xs text-slate-600">Powered by Machine Learning + Statistical Analysis</div>
  </Card>
 </div>;
}

function SettingToggle({title,description,enabled,onToggle}){
 return <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[.035] border border-white/5">
  <div>
   <div className="font-semibold">{title}</div>
   <div className="text-sm text-slate-500 mt-1">{description}</div>
  </div>
  <button
   type="button"
   aria-label={`${title}: ${enabled?'on':'off'}`}
   onClick={onToggle}
   className={`shrink-0 w-12 h-6 rounded-full transition-colors ${enabled?'bg-cyan-300':'bg-slate-700'}`}
  >
   <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${enabled?'translate-x-6':'translate-x-0.5'}`}/>
  </button>
 </div>;
}

function ProfilePage({patterns,expenses}){
 return <div className="space-y-6">
  <Title title="Profile" sub="Your personal expense intelligence profile."/>

  <Card className="p-7 lg:p-10">
   <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-300 to-blue-600 flex items-center justify-center text-3xl font-black text-[#06111f] shadow-xl shadow-cyan-500/20">
     AS
    </div>
    <div className="text-center sm:text-left">
     <h2 className="text-2xl font-black">Abhinav Sanjay</h2>
     <p className="text-slate-400 mt-1">Computer Science Engineering Student</p>
     <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
      <span className="px-3 py-1.5 rounded-lg bg-cyan-300/10 text-cyan-300 text-xs">Personal Finance User</span>
      <span className="px-3 py-1.5 rounded-lg bg-blue-400/10 text-blue-300 text-xs">AI Expense Tracking</span>
     </div>
    </div>
   </div>
  </Card>

  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
   <Metric title="Transactions Tracked" value={patterns?.total_transactions ?? expenses.length}/>
   <Metric title="Total Spending" value={money(patterns?.total_spending)}/>
   <Metric title="Average Expense" value={money(patterns?.average_expense)}/>
   <Metric title="Top Category" value={patterns?.highest_spending_category || 'N/A'}/>
  </div>

  <Card className="p-6 lg:p-8">
   <h2 className="text-lg font-bold">Profile Information</h2>
   <div className="grid md:grid-cols-2 gap-4 mt-6">
    <ProfileField label="Name" value="Abhinav Sanjay"/>
    <ProfileField label="Role" value="Computer Science Student"/>
    <ProfileField label="Currency" value="Indian Rupee (₹)"/>
    <ProfileField label="Intelligence Engine" value="FastAPI + ML" valueClass="text-emerald-300"/>
   </div>
  </Card>

  <Card className="p-6">
   <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-cyan-300/10 text-cyan-300 flex items-center justify-center">
     <BrainCircuit size={20}/>
    </div>
    <div>
     <div className="font-semibold">Financial Intelligence Active</div>
     <div className="text-sm text-slate-500">Your expense data is being analyzed for patterns, predictions and unusual spending.</div>
    </div>
   </div>
  </Card>
 </div>;
}

function ProfileField({label,value,valueClass=''}){
 return <div className="p-4 rounded-xl bg-white/[.035] border border-white/5">
  <div className="text-xs text-slate-500">{label}</div>
  <div className={`font-semibold mt-1 ${valueClass}`}>{value}</div>
 </div>;
}

createRoot(document.getElementById('root')).render(<App/>);
