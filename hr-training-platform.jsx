import { useState, useRef, useEffect } from "react";

const COLORS = {
  bg: "#0f1117", surface: "#1a1d27", surfaceAlt: "#21253a", border: "#2a2f45",
  accent: "#4f8ef7", accentSoft: "#1e3a6e", green: "#22c55e", greenSoft: "#14532d",
  amber: "#f59e0b", red: "#ef4444", text: "#e8eaf0", textMuted: "#7c85a2", textDim: "#4a5170",
};

const INITIAL_EMPLOYEES = [
  { id:1, name:"田中 花子", dept:"製造1課", progress:78, testScore:85, channel:"エージェント", cost:450000, risk:"低", joinDate:"2024-04-01", note:"" },
  { id:2, name:"鈴木 一郎", dept:"品質管理", progress:45, testScore:62, channel:"新卒", cost:180000, risk:"中", joinDate:"2024-04-01", note:"" },
  { id:3, name:"佐藤 美咲", dept:"製造2課", progress:92, testScore:95, channel:"リファラル", cost:120000, risk:"低", joinDate:"2024-04-01", note:"" },
  { id:4, name:"山田 健太", dept:"物流", progress:30, testScore:48, channel:"新卒", cost:180000, risk:"高", joinDate:"2024-04-01", note:"" },
  { id:5, name:"伊藤 さくら", dept:"製造1課", progress:65, testScore:73, channel:"エージェント", cost:380000, risk:"低", joinDate:"2024-04-01", note:"" },
];

const curriculum = [
  { id:1, title:"会社概要・理念", duration:"2時間", status:"完了", category:"基礎" },
  { id:2, title:"安全教育・設備操作", duration:"4時間", status:"完了", category:"安全" },
  { id:3, title:"製造プロセス基礎", duration:"6時間", status:"進行中", category:"技術" },
  { id:4, title:"品質管理の基本", duration:"3時間", status:"未着手", category:"技術" },
  { id:5, title:"報連相・ビジネスマナー", duration:"2時間", status:"未着手", category:"基礎" },
];

const INITIAL_QUESTIONS = [
  // NF-410II 習熟度テスト①（Formsより取込）
  { id:1, category:"安全", difficulty:"基礎", q:"「危険」の表示が示す内容は？", options:["死亡または重傷を生じることがある切迫した危険","潜在的な危険状態","物的損害のみの発生","軽傷を負う可能性"], ans:0 },
  { id:2, category:"安全", difficulty:"基礎", q:"作業時に着用してはいけないものは？", options:["滑り止めのついた履物","ネックレスなどの装身具","帽子","保護メガネ"], ans:1 },
  { id:3, category:"安全", difficulty:"基礎", q:"機械の掃除や点検をする際の必須事項は？", options:["運転したまま行う","電源プラグを電源から抜く","厚み調整を最大にする","手袋を外す"], ans:1 },
  { id:4, category:"安全", difficulty:"基礎", q:"肉載せ台の往復範囲に設けるべきものは？", options:["踏み台","防護柵","目印のテープ","荷物置き場"], ans:1 },
  { id:5, category:"安全", difficulty:"基礎", q:"注油に使用すべき油の種類は？", options:["一般的な工業用油","食品機械用潤滑油","食用サラダ油","ミシン油"], ans:1 },
  { id:6, category:"安全", difficulty:"基礎", q:"丸刃研磨時に必ず着用すべき保護具は？", options:["防塵マスク","保護メガネ","耳栓","エプロン"], ans:1 },
  { id:7, category:"安全", difficulty:"基礎", q:"洗浄に使用すべき洗剤は？", options:["強アルカリ洗剤","中性洗剤","塩素系漂白剤","シンナー"], ans:1 },
  { id:8, category:"安全", difficulty:"基礎", q:"複数での作業が禁止されているのはどの工程？", options:["肉の積み込み","丸刃および周辺の洗浄","梱包作業","製品の移動"], ans:1 },
  { id:9, category:"安全", difficulty:"応用", q:"スライス作業以外の時、厚調板はどの位置にする？", options:["丸刃より上の位置","丸刃より下の位置","どの位置でもよい","0mmの位置"], ans:0 },
  { id:10, category:"安全", difficulty:"基礎", q:"異常が発生した際に直ちに行うべき行動は？", options:["そのまま運転を続ける","非常停止ボタンを押す","コンセントを抜く","販売店に電話する"], ans:1 },
  { id:11, category:"品質", difficulty:"基礎", q:"不良品を発見した際の正しい対応は？", options:["そのまま次工程へ","自分で修理する","ラインを止め上司に報告","廃棄する"], ans:2 },
  { id:12, category:"5S", difficulty:"基礎", q:"5S活動の「整理」の意味は？", options:["必要なものと不要なものを分ける","決めた場所に置く","常にきれいに保つ","ルールを守る"], ans:0 },
  { id:13, category:"安全", difficulty:"応用", q:"ヒヤリハット活動の目的は何ですか？", options:["ペナルティを与えるため","軽微な事故を共有し重大事故を防ぐため","作業効率を上げるため","上司への報告練習のため"], ans:1 },
  { id:14, category:"品質", difficulty:"応用", q:"QCサークル活動とは何ですか？", options:["品質管理部門だけが行う活動","現場の作業者が自主的に品質改善を行うグループ活動","役員が行う経営改善活動","外部コンサルが主導する改革活動"], ans:1 },
];

function Badge({ children }) {
  const map = {
    低:{bg:"#14532d",text:"#4ade80"}, 中:{bg:"#451a03",text:"#fbbf24"}, 高:{bg:"#450a0a",text:"#f87171"},
    完了:{bg:"#14532d",text:"#4ade80"}, 進行中:{bg:"#1e3a6e",text:"#60a5fa"}, 未着手:{bg:"#1a1d27",text:"#7c85a2"},
    安全:{bg:"#450a0a",text:"#f87171"}, 品質:{bg:"#1e3a6e",text:"#60a5fa"}, "5S":{bg:"#14532d",text:"#4ade80"},
    基礎:{bg:"#21253a",text:"#7c85a2"}, 応用:{bg:"#451a03",text:"#fbbf24"}, 発展:{bg:"#1a0830",text:"#a78bfa"},
    製造:{bg:"#1e2a1e",text:"#86efac"}, ビジネスマナー:{bg:"#1a1a30",text:"#93c5fd"},
  };
  const s = map[children] || { bg:COLORS.surfaceAlt, text:COLORS.textMuted };
  return <span style={{background:s.bg,color:s.text,fontSize:11,padding:"2px 8px",borderRadius:99,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;
}

function Stat({ label, value, sub, color }) {
  return (
    <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:"18px 20px"}}>
      <div style={{fontSize:12,color:COLORS.textMuted,marginBottom:6}}>{label}</div>
      <div style={{fontSize:26,fontWeight:800,color:color||COLORS.text,fontFamily:"'DM Mono',monospace"}}>{value}</div>
      {sub && <div style={{fontSize:11,color:COLORS.textDim,marginTop:4}}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <div style={{background:COLORS.border,borderRadius:99,height:6,width:"100%",overflow:"hidden"}}>
      <div style={{width:`${pct}%`,height:"100%",background:color||COLORS.accent,borderRadius:99,transition:"width 0.6s ease"}} />
    </div>
  );
}

function Btn({ onClick, disabled, children, variant="primary", small }) {
  const styles = {
    primary:{background:COLORS.accent,color:"#fff",border:"none"},
    secondary:{background:COLORS.surfaceAlt,color:COLORS.text,border:`1px solid ${COLORS.border}`},
    danger:{background:"#450a0a",color:COLORS.red,border:`1px solid ${COLORS.red}`},
    ghost:{background:"transparent",color:COLORS.textMuted,border:`1px solid ${COLORS.border}`},
  };
  return <button onClick={onClick} disabled={disabled} style={{...styles[variant],borderRadius:8,padding:small?"6px 12px":"10px 18px",fontWeight:700,fontSize:small?11:13,cursor:disabled?"default":"pointer",opacity:disabled?0.5:1,fontFamily:"'Noto Sans JP',sans-serif"}}>{children}</button>;
}

function HomeView({ setTab }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div style={{background:`linear-gradient(135deg,${COLORS.accentSoft},#1a1d27)`,border:`1px solid ${COLORS.border}`,borderRadius:16,padding:28}}>
        <div style={{fontSize:12,color:COLORS.accent,fontWeight:700,letterSpacing:2,marginBottom:8}}>田中 花子 さん</div>
        <div style={{fontSize:22,fontWeight:800,color:COLORS.text,marginBottom:4}}>おはようございます 👋</div>
        <div style={{fontSize:13,color:COLORS.textMuted}}>今日の研修を始めましょう。残り3ステップで第1週が完了します。</div>
        <button onClick={()=>setTab("学習")} style={{marginTop:16,background:COLORS.accent,color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontWeight:700,fontSize:13,cursor:"pointer"}}>学習を続ける →</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Stat label="研修進捗" value="78%" color={COLORS.accent} />
        <Stat label="テスト平均" value="85点" color={COLORS.green} />
        <Stat label="完了カリキュラム" value="2 / 5" />
        <Stat label="AI質問数" value="12回" sub="今週" />
      </div>
      <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:20}}>
        <div style={{fontSize:13,fontWeight:700,color:COLORS.text,marginBottom:14}}>📚 次に学ぶコンテンツ</div>
        {curriculum.filter(c=>c.status!=="完了").slice(0,2).map(c=>(
          <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${COLORS.border}`}}>
            <div style={{flex:1}}>
              <div style={{fontSize:13,color:COLORS.text,fontWeight:600}}>{c.title}</div>
              <div style={{fontSize:11,color:COLORS.textMuted,marginTop:2}}>{c.duration} · {c.category}</div>
            </div>
            <Badge>{c.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function LearningView() {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>カリキュラム一覧</div>
      {curriculum.map((c,i)=>(
        <div key={c.id} onClick={()=>setSelected(selected===c.id?null:c.id)}
          style={{background:COLORS.surface,border:`1px solid ${selected===c.id?COLORS.accent:COLORS.border}`,borderRadius:12,padding:18,cursor:"pointer",transition:"border 0.2s"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:32,height:32,borderRadius:8,background:c.status==="完了"?COLORS.greenSoft:COLORS.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:c.status==="完了"?COLORS.green:COLORS.accent,fontWeight:800}}>{i+1}</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:COLORS.text}}>{c.title}</div>
              <div style={{fontSize:11,color:COLORS.textMuted,marginTop:2}}>{c.duration} · {c.category}</div>
            </div>
            <Badge>{c.status}</Badge>
          </div>
          {selected===c.id&&(
            <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${COLORS.border}`}}>
              <div style={{fontSize:12,color:COLORS.textMuted,marginBottom:10}}>このモジュールでは製造現場の基本知識を習得します。動画・テキスト・確認テストで構成されています。</div>
              <div style={{display:"flex",gap:8}}>
                <button style={{flex:1,background:COLORS.accent,color:"#fff",border:"none",borderRadius:8,padding:"9px 0",fontWeight:700,fontSize:12,cursor:"pointer"}}>{c.status==="完了"?"復習する":c.status==="進行中"?"続きから":"開始する"}</button>
                <button style={{background:COLORS.surfaceAlt,color:COLORS.textMuted,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"9px 14px",fontSize:12,cursor:"pointer"}}>AIに質問</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ChatView() {
  const [messages,setMessages]=useState([{role:"assistant",text:"こんにちは！製造・品質管理・安全規則など、研修に関することは何でも聞いてください。"}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"})},[messages]);

  async function send() {
    if(!input.trim()||loading) return;
    const userMsg=input.trim(); setInput("");
    setMessages(prev=>[...prev,{role:"user",text:userMsg}]); setLoading(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"あなたは製造・メーカー系企業の新入社員教育AIアシスタントです。安全管理、製造プロセス、品質管理、ビジネスマナーなどについて、わかりやすく丁寧に日本語で回答してください。回答は簡潔にまとめ、必要に応じて箇条書きを使ってください。",messages:messages.filter(m=>m.role!=="system").map(m=>({role:m.role,content:m.text})).concat([{role:"user",content:userMsg}])})});
      const data=await res.json();
      setMessages(prev=>[...prev,{role:"assistant",text:data.content?.map(b=>b.text||"").join("")||"エラーが発生しました。"}]);
    } catch { setMessages(prev=>[...prev,{role:"assistant",text:"通信エラーが発生しました。"}]); }
    setLoading(false);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 180px)"}}>
      <div style={{fontSize:16,fontWeight:800,color:COLORS.text,marginBottom:14}}>🤖 AI研修アシスタント</div>
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,paddingBottom:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"82%",background:m.role==="user"?COLORS.accent:COLORS.surface,color:COLORS.text,borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"12px 16px",fontSize:13,lineHeight:1.6,border:m.role==="assistant"?`1px solid ${COLORS.border}`:"none",whiteSpace:"pre-wrap"}}>{m.text}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex"}}><div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:"16px 16px 16px 4px",padding:"12px 16px"}}><div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:COLORS.textMuted,animation:`bounce 1s ${i*0.15}s infinite`}}/>)}</div></div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{display:"flex",gap:8,paddingTop:12,borderTop:`1px solid ${COLORS.border}`}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()} placeholder="研修について質問する..." style={{flex:1,background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"12px 14px",color:COLORS.text,fontSize:13,outline:"none"}}/>
        <button onClick={send} disabled={loading||!input.trim()} style={{background:loading||!input.trim()?COLORS.surfaceAlt:COLORS.accent,color:loading||!input.trim()?COLORS.textDim:"#fff",border:"none",borderRadius:10,padding:"0 18px",fontWeight:700,fontSize:13,cursor:loading||!input.trim()?"default":"pointer"}}>送信</button>
      </div>
    </div>
  );
}

function TestView({ questions }) {
  const [filterCat,setFilterCat]=useState("すべて");
  const [started,setStarted]=useState(false);
  const [current,setCurrent]=useState(0);
  const [selected,setSelected]=useState(null);
  const [results,setResults]=useState([]);
  const [done,setDone]=useState(false);

  const cats=["すべて",...Array.from(new Set(questions.map(q=>q.category)))];
  const filtered=filterCat==="すべて"?questions:questions.filter(q=>q.category===filterCat);

  function start(){setCurrent(0);setSelected(null);setResults([]);setDone(false);setStarted(true);}
  function reset(){setStarted(false);setDone(false);setResults([]);}

  function answer(idx){
    if(selected!==null) return; setSelected(idx);
    setTimeout(()=>{
      const nr=[...results,idx===filtered[current].ans];
      setResults(nr);
      if(current+1>=filtered.length){setDone(true);}
      else{setCurrent(c=>c+1);setSelected(null);}
    },900);
  }

  if(!started) return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>理解度テスト</div>
      <div style={{fontSize:13,color:COLORS.textMuted}}>カテゴリを選択してテストを開始</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setFilterCat(c)} style={{background:filterCat===c?COLORS.accent:COLORS.surfaceAlt,color:filterCat===c?"#fff":COLORS.textMuted,border:`1px solid ${filterCat===c?COLORS.accent:COLORS.border}`,borderRadius:99,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{c}</button>
        ))}
      </div>
      <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:20}}>
        <div style={{fontSize:13,color:COLORS.textMuted,marginBottom:12}}><span style={{color:COLORS.text,fontWeight:800,fontSize:18}}>{filtered.length}</span> 問 · {filterCat==="すべて"?"全カテゴリ":filterCat}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {filtered.slice(0,3).map(q=>(
            <div key={q.id} style={{display:"flex",alignItems:"center",gap:6}}>
              <Badge>{q.category}</Badge><Badge>{q.difficulty}</Badge>
              <div style={{fontSize:12,color:COLORS.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{q.q}</div>
            </div>
          ))}
          {filtered.length>3&&<div style={{fontSize:12,color:COLORS.textDim}}>...他 {filtered.length-3} 問</div>}
        </div>
        <button onClick={start} style={{width:"100%",background:COLORS.accent,color:"#fff",border:"none",borderRadius:10,padding:"13px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>テストを開始する</button>
      </div>
    </div>
  );

  if(done){
    const score=results.filter(Boolean).length;
    const pct=Math.round((score/filtered.length)*100);
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20,paddingTop:32}}>
        <div style={{fontSize:48}}>{pct===100?"🎉":pct>=70?"😊":"📚"}</div>
        <div style={{fontSize:22,fontWeight:800,color:COLORS.text}}>{score} / {filtered.length} 正解</div>
        <div style={{fontSize:32,fontWeight:800,color:pct>=70?COLORS.green:COLORS.amber}}>{pct}点</div>
        <div style={{width:"100%",maxWidth:300}}><ProgressBar pct={pct} color={pct>=70?COLORS.green:COLORS.amber}/></div>
        <div style={{fontSize:13,color:COLORS.textMuted}}>{pct===100?"満点！素晴らしい理解度です":pct>=70?"合格です！引き続き学習を":"もう少し復習が必要です"}</div>
        <div style={{display:"flex",gap:10,marginTop:8}}><Btn onClick={start}>もう一度挑戦</Btn><Btn onClick={reset} variant="ghost">問題選択に戻る</Btn></div>
      </div>
    );
  }

  const q=filtered[current];
  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>理解度テスト</div>
        <div style={{fontSize:12,color:COLORS.textMuted}}>{current+1} / {filtered.length}</div>
      </div>
      <ProgressBar pct={(current/filtered.length)*100}/>
      <div style={{display:"flex",gap:6}}><Badge>{q.category}</Badge><Badge>{q.difficulty}</Badge></div>
      <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:14,padding:22}}>
        <div style={{fontSize:14,fontWeight:700,color:COLORS.text,lineHeight:1.6,marginBottom:20}}>{q.q}</div>
        {q.options.map((opt,i)=>{
          let bg=COLORS.surfaceAlt,border=COLORS.border,color=COLORS.text;
          if(selected!==null){if(i===q.ans){bg=COLORS.greenSoft;border=COLORS.green;color=COLORS.green;}else if(i===selected){bg="#450a0a";border=COLORS.red;color=COLORS.red;}}
          return <div key={i} onClick={()=>answer(i)} style={{background:bg,border:`1px solid ${border}`,borderRadius:10,padding:"12px 16px",marginBottom:8,cursor:selected!==null?"default":"pointer",color,fontSize:13,fontWeight:500,transition:"all 0.25s"}}>{opt}</div>;
        })}
      </div>
    </div>
  );
}

function TestManager({ questions, setQuestions, formScores, setFormScores }) {
  const [view,setView]=useState("list");
  const [editTarget,setEditTarget]=useState(null);
  const [form,setForm]=useState({category:"安全",difficulty:"基礎",q:"",options:["","","",""],ans:0});
  const [csvText,setCsvText]=useState("");
  const [csvError,setCsvError]=useState("");
  const [aiTopic,setAiTopic]=useState("");
  const [aiCount,setAiCount]=useState(3);
  const [aiLoading,setAiLoading]=useState(false);
  const [aiResult,setAiResult]=useState("");
  // Forms states
  const [formsQText,setFormsQText]=useState("");
  const [formsQError,setFormsQError]=useState("");
  const [formsQPreview,setFormsQPreview]=useState([]);
  const [formsRText,setFormsRText]=useState("");
  const [formsRError,setFormsRError]=useState("");
  const [formsRPreview,setFormsRPreview]=useState([]);
  const [formsTab,setFormsTab]=useState("questions");
  // PDF states
  const [pdfLoading,setPdfLoading]=useState(false);
  const [pdfResult,setPdfResult]=useState("");
  const [pdfPreview,setPdfPreview]=useState([]);
  const [pdfError,setPdfError]=useState(""); // questions | results

  const CATS=["安全","品質","5S","製造","ビジネスマナー","その他"];
  const inp={background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"10px 12px",color:COLORS.text,fontSize:13,outline:"none",width:"100%",fontFamily:"'Noto Sans JP',sans-serif"};
  const lbl={fontSize:11,color:COLORS.textMuted,marginBottom:4,display:"block",fontWeight:700};

  function openAdd(){setForm({category:"安全",difficulty:"基礎",q:"",options:["","","",""],ans:0});setEditTarget(null);setView("add");}
  function openEdit(q){setForm({category:q.category,difficulty:q.difficulty,q:q.q,options:[...q.options],ans:q.ans});setEditTarget(q.id);setView("add");}
  function deleteQ(id){if(window.confirm("この問題を削除しますか？"))setQuestions(prev=>prev.filter(q=>q.id!==id));}
  function saveForm(){
    if(!form.q.trim()||form.options.some(o=>!o.trim())){alert("問題文と全選択肢を入力してください");return;}
    if(editTarget){setQuestions(prev=>prev.map(q=>q.id===editTarget?{...q,...form}:q));}
    else{const newId=Math.max(0,...questions.map(q=>q.id))+1;setQuestions(prev=>[...prev,{id:newId,...form}]);}
    setView("list");
  }

  function parseCSV(){
    setCsvError("");
    try{
      const lines=csvText.trim().split("\n").filter(l=>l.trim());
      const newQs=[];
      for(let i=0;i<lines.length;i++){
        const cols=lines[i].split(",").map(c=>c.trim().replace(/^"|"$/g,""));
        if(cols.length<8) throw new Error(`行${i+1}: 列数が足りません（8列必要）`);
        const ans=parseInt(cols[7]);
        if(isNaN(ans)||ans<0||ans>3) throw new Error(`行${i+1}: 正解番号は0〜3で入力してください`);
        newQs.push({id:Math.max(0,...questions.map(q=>q.id),...newQs.map(q=>q.id))+1+i,category:cols[0],difficulty:cols[1],q:cols[2],options:[cols[3],cols[4],cols[5],cols[6]],ans});
      }
      setQuestions(prev=>[...prev,...newQs]);setCsvText("");setView("list");
    } catch(e){setCsvError(e.message);}
  }

  async function parsePDF(file){
    setPdfLoading(true);setPdfError("");setPdfResult("");setPdfPreview([]);
    try{
      const base64=await new Promise((res,rej)=>{
        const r=new FileReader();
        r.onload=()=>res(r.result.split(",")[1]);
        r.onerror=()=>rej(new Error("読み込み失敗"));
        r.readAsDataURL(file);
      });
      const resp=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:"あなたはMicrosoft Formsのクイズ結果PDFから問題・選択肢・正解を抽出するAIです。PDFを解析し、必ずJSON配列のみを返してください。説明文・Markdownは不要です。形式:[{\"category\":\"安全\",\"difficulty\":\"基礎\",\"q\":\"問題文\",\"options\":[\"選択肢1\",\"選択肢2\",\"選択肢3\",\"選択肢4\"],\"ans\":0}]。正解はPDF内のチェックマーク(✓)または最多回答から判断してください。",
          messages:[{
            role:"user",
            content:[
              {type:"document",source:{type:"base64",media_type:"application/pdf",data:base64}},
              {type:"text",text:"このFormsクイズ結果PDFから全問題を抽出しJSON配列で返してください。"}
            ]
          }]
        })
      });
      const data=await resp.json();
      const text=data.content?.map(b=>b.text||"").join("")||"[]";
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      if(!Array.isArray(parsed)||parsed.length===0) throw new Error("問題を検出できませんでした");
      setPdfPreview(parsed);
      setPdfResult(`✅ ${parsed.length}問を検出しました`);
    } catch(e){setPdfError("⚠️ "+e.message);}
    setPdfLoading(false);
  }

  function importPdfQuestions(){
    const maxId=Math.max(0,...questions.map(q=>q.id));
    setQuestions(prev=>[...prev,...pdfPreview.map((q,i)=>({id:maxId+i+1,...q}))]);
    setPdfPreview([]);setPdfResult("");setView("list");
  }

  function parseFormsQuestions(){
    setFormsQError("");setFormsQPreview([]);
    try{
      const lines=formsQText.trim().split("\n").filter(l=>l.trim());
      if(lines.length<2) throw new Error("2行以上必要です（1行目はヘッダー）");
      const parsed=[];
      for(let i=1;i<lines.length;i++){
        const cols=lines[i].split("\t").map(c=>c.trim().replace(/^"|"$/g,""));
        if(cols.length<3) {
          // try comma split as fallback
          const ccols=lines[i].split(",").map(c=>c.trim().replace(/^"|"$/g,""));
          if(ccols.length<3) throw new Error(`行${i+1}: 列数が足りません`);
          const opts=ccols.slice(1,ccols.length-1).filter(o=>o);
          const ansText=ccols[ccols.length-1];
          const ansIdx=opts.findIndex(o=>o===ansText);
          if(ansIdx===-1) throw new Error(`行${i+1}: 正解が選択肢に見つかりません`);
          parsed.push({q:ccols[0],options:opts,ans:ansIdx,category:"未分類",difficulty:"基礎"});
          continue;
        }
        const opts=cols.slice(1,cols.length-1).filter(o=>o);
        const ansText=cols[cols.length-1];
        const ansIdx=opts.findIndex(o=>o===ansText);
        if(ansIdx===-1) throw new Error(`行${i+1}: 正解「${ansText}」が選択肢に見つかりません`);
        parsed.push({q:cols[0],options:opts,ans:ansIdx,category:"未分類",difficulty:"基礎"});
      }
      setFormsQPreview(parsed);
    } catch(e){setFormsQError(e.message);}
  }

  function importFormsQuestions(){
    const maxId=Math.max(0,...questions.map(q=>q.id));
    setQuestions(prev=>[...prev,...formsQPreview.map((q,i)=>({id:maxId+i+1,...q}))]);
    setFormsQText("");setFormsQPreview([]);setView("list");
  }

  function parseFormsResults(){
    setFormsRError("");setFormsRPreview([]);
    try{
      const lines=formsRText.trim().split("\n").filter(l=>l.trim());
      if(lines.length<2) throw new Error("2行以上必要です（1行目はヘッダー）");
      const headers=lines[0].split("\t").map(h=>h.trim().toLowerCase());
      const nameIdx=headers.findIndex(h=>h.includes("名前")||h.includes("name")||h.includes("氏名"));
      const scoreIdx=headers.findIndex(h=>h.includes("点")||h.includes("score")||h.includes("ポイント")||h.includes("合計"));
      if(nameIdx===-1) throw new Error("「名前」列が見つかりません。ヘッダー行に「名前」または「Name」を含めてください");
      if(scoreIdx===-1) throw new Error("「点数」または「Score」列が見つかりません");
      const results=[];
      for(let i=1;i<lines.length;i++){
        const cols=lines[i].split("\t").map(c=>c.trim().replace(/^"|"$/g,""));
        const name=cols[nameIdx]||`回答者${i}`;
        const score=parseFloat(cols[scoreIdx])||0;
        results.push({name,score,time:new Date().toLocaleDateString("ja-JP")});
      }
      setFormsRPreview(results);
    } catch(e){setFormsRError(e.message);}
  }

  function importFormsResults(){
    setFormScores(prev=>[...prev,...formsRPreview]);
    setFormsRText("");setFormsRPreview([]);setView("list");
  }

  async function generateAI(){
    if(!aiTopic.trim()) return;
    setAiLoading(true);setAiResult("");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"あなたは製造・メーカー系企業の研修テスト作成AIです。指定されたトピックについて4択問題をJSON配列形式のみで返してください。説明文やMarkdownは不要です。形式:[{\"category\":\"カテゴリ名\",\"difficulty\":\"基礎\",\"q\":\"問題文\",\"options\":[\"選択肢1\",\"選択肢2\",\"選択肢3\",\"選択肢4\"],\"ans\":正解のインデックス}]",messages:[{role:"user",content:`製造業新入社員向けの4択問題を${aiCount}問作成：「${aiTopic}」`}]})});
      const data=await res.json();
      const text=data.content?.map(b=>b.text||"").join("")||"[]";
      const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());
      const maxId=Math.max(0,...questions.map(q=>q.id));
      setQuestions(prev=>[...prev,...parsed.map((q,i)=>({id:maxId+i+1,...q}))]);
      setAiResult(`✅ ${parsed.length}問を追加しました！`);
      setTimeout(()=>setView("list"),1200);
    } catch{setAiResult("⚠️ 生成に失敗しました。再度お試しください。");}
    setAiLoading(false);
  }

  if(view==="list") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>✏️ テスト問題管理</div>
        <div style={{fontSize:12,color:COLORS.textMuted}}>{questions.length}問</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        <button onClick={openAdd} style={{background:COLORS.accentSoft,color:COLORS.accent,border:`1px solid ${COLORS.accent}`,borderRadius:10,padding:"10px 0",fontWeight:700,fontSize:12,cursor:"pointer"}}>＋ 手動追加</button>
        <button onClick={()=>setView("csv")} style={{background:COLORS.surfaceAlt,color:COLORS.text,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:"10px 0",fontWeight:700,fontSize:12,cursor:"pointer"}}>📊 CSV取込</button>
        <button onClick={()=>setView("ai")} style={{background:"#1a1030",color:"#a78bfa",border:"1px solid #a78bfa",borderRadius:10,padding:"10px 0",fontWeight:700,fontSize:12,cursor:"pointer"}}>🤖 AI生成</button>
      </div>
      <button onClick={()=>setView("forms")} style={{width:"100%",background:"#0f1e3a",color:"#0ea5e9",border:"1px solid #0ea5e9",borderRadius:10,padding:"11px 0",fontWeight:700,fontSize:13,cursor:"pointer",marginBottom:8}}>📋 Microsoft Forms から取込む</button>
      <button onClick={()=>setView("pdf")} style={{width:"100%",background:"#1a0f2e",color:"#a78bfa",border:"1px solid #a78bfa",borderRadius:10,padding:"11px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}>📄 FormsのPDFから取込む</button>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {questions.map(q=>(
          <div key={q.id} style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:16}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,marginBottom:6}}><Badge>{q.category}</Badge><Badge>{q.difficulty}</Badge></div>
                <div style={{fontSize:13,color:COLORS.text,fontWeight:600,lineHeight:1.5}}>{q.q}</div>
                <div style={{fontSize:11,color:COLORS.textMuted,marginTop:6}}>✅ 正解: {q.options[q.ans]}</div>
              </div>
              <div style={{display:"flex",gap:6,flexShrink:0}}>
                <Btn onClick={()=>openEdit(q)} variant="ghost" small>編集</Btn>
                <Btn onClick={()=>deleteQ(q.id)} variant="danger" small>削除</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if(view==="add") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setView("list")} style={{background:"transparent",border:"none",color:COLORS.textMuted,fontSize:20,cursor:"pointer"}}>←</button>
        <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>{editTarget?"問題を編集":"問題を追加"}</div>
      </div>
      <div><label style={lbl}>カテゴリ</label><select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} style={inp}>{CATS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
      <div><label style={lbl}>難易度</label><select value={form.difficulty} onChange={e=>setForm(f=>({...f,difficulty:e.target.value}))} style={inp}>{["基礎","応用","発展"].map(d=><option key={d} value={d}>{d}</option>)}</select></div>
      <div><label style={lbl}>問題文</label><textarea value={form.q} onChange={e=>setForm(f=>({...f,q:e.target.value}))} rows={3} placeholder="問題文を入力してください" style={{...inp,resize:"vertical"}}/></div>
      <div>
        <label style={lbl}>選択肢（正解の丸をクリックして選択）</label>
        {form.options.map((opt,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
            <div onClick={()=>setForm(f=>({...f,ans:i}))} style={{width:28,height:28,borderRadius:"50%",background:form.ans===i?COLORS.green:COLORS.surfaceAlt,border:`2px solid ${form.ans===i?COLORS.green:COLORS.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:form.ans===i?"#fff":COLORS.textMuted,cursor:"pointer",flexShrink:0,fontWeight:800}}>
              {form.ans===i?"✓":i+1}
            </div>
            <input value={opt} onChange={e=>{const o=[...form.options];o[i]=e.target.value;setForm(f=>({...f,options:o}));}} placeholder={`選択肢 ${i+1}`} style={inp}/>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:10}}><Btn onClick={saveForm}>{editTarget?"更新する":"追加する"}</Btn><Btn onClick={()=>setView("list")} variant="ghost">キャンセル</Btn></div>
    </div>
  );

  if(view==="csv") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setView("list")} style={{background:"transparent",border:"none",color:COLORS.textMuted,fontSize:20,cursor:"pointer"}}>←</button>
        <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>CSV取込</div>
      </div>
      <div style={{background:COLORS.surfaceAlt,borderRadius:10,padding:14,fontSize:12,color:COLORS.textMuted,lineHeight:1.9}}>
        <div style={{fontWeight:700,color:COLORS.text,marginBottom:6}}>📋 CSV形式（1行1問、カンマ区切り）</div>
        カテゴリ, 難易度, 問題文, 選択肢1, 選択肢2, 選択肢3, 選択肢4, 正解番号(0〜3)<br/>
        <span style={{color:COLORS.textDim,fontFamily:"monospace"}}>安全,基礎,KY活動とは？,危険予知活動,緊急訓練,機械点検,書類確認,0</span>
      </div>
      <textarea value={csvText} onChange={e=>setCsvText(e.target.value)} rows={8} placeholder="ここにCSVを貼り付けてください..." style={{background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"12px",color:COLORS.text,fontSize:12,outline:"none",width:"100%",fontFamily:"monospace",resize:"vertical"}}/>
      {csvError&&<div style={{background:"#450a0a",border:`1px solid ${COLORS.red}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:COLORS.red}}>{csvError}</div>}
      <div style={{display:"flex",gap:10}}><Btn onClick={parseCSV} disabled={!csvText.trim()}>取込む</Btn><Btn onClick={()=>setView("list")} variant="ghost">キャンセル</Btn></div>
    </div>
  );

  if(view==="pdf") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setView("list")} style={{background:"transparent",border:"none",color:COLORS.textMuted,fontSize:20,cursor:"pointer"}}>←</button>
        <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>📄 FormsのPDFから取込む</div>
      </div>
      <div style={{background:"#1a0f2e",border:"1px solid #a78bfa",borderRadius:12,padding:14,fontSize:12,color:"#c4b5fd",lineHeight:1.8}}>
        <div style={{fontWeight:700,color:"#a78bfa",marginBottom:4}}>対応PDFについて</div>
        <div>Microsoft Forms の「応答の概要」画面を印刷またはPDF保存したファイルに対応しています。AIが問題・選択肢・正解を自動で読み取ります。</div>
      </div>
      <div
        onClick={()=>document.getElementById("pdf-upload").click()}
        style={{background:COLORS.surface,border:`2px dashed #a78bfa`,borderRadius:12,padding:"32px 20px",textAlign:"center",cursor:"pointer"}}>
        <div style={{fontSize:32,marginBottom:8}}>📄</div>
        <div style={{fontSize:14,fontWeight:700,color:COLORS.text,marginBottom:4}}>PDFファイルを選択</div>
        <div style={{fontSize:12,color:COLORS.textMuted}}>クリックしてアップロード</div>
        <input id="pdf-upload" type="file" accept="application/pdf" style={{display:"none"}}
          onChange={e=>{const f=e.target.files[0];if(f)parsePDF(f);e.target.value="";}}/>
      </div>
      {pdfLoading&&(
        <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:10,padding:20,textAlign:"center"}}>
          <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:10}}>
            {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#a78bfa",animation:`bounce 1s ${i*0.15}s infinite`}}/>)}
          </div>
          <div style={{fontSize:13,color:COLORS.textMuted}}>AIがPDFを解析中...</div>
        </div>
      )}
      {pdfError&&<div style={{background:"#450a0a",border:`1px solid ${COLORS.red}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:COLORS.red}}>{pdfError}</div>}
      {pdfPreview.length>0&&(
        <div style={{background:COLORS.surface,border:`1px solid ${COLORS.green}`,borderRadius:10,padding:16}}>
          <div style={{fontSize:12,fontWeight:700,color:COLORS.green,marginBottom:10}}>{pdfResult}</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
            {pdfPreview.map((q,i)=>(
              <div key={i} style={{borderBottom:`1px solid ${COLORS.border}`,paddingBottom:8}}>
                <div style={{display:"flex",gap:6,marginBottom:4}}><Badge>{q.category}</Badge><Badge>{q.difficulty}</Badge></div>
                <div style={{fontSize:12,color:COLORS.text,fontWeight:600}}>{i+1}. {q.q}</div>
                <div style={{fontSize:11,color:COLORS.textMuted,marginTop:3}}>✅ 正解: {q.options?.[q.ans]}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={importPdfQuestions}>このまま取込む</Btn>
            <Btn onClick={()=>{setPdfPreview([]);setPdfResult("");}} variant="ghost">キャンセル</Btn>
          </div>
        </div>
      )}
      <Btn onClick={()=>setView("list")} variant="ghost">← 戻る</Btn>
    </div>
  );

  if(view==="forms") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setView("list")} style={{background:"transparent",border:"none",color:COLORS.textMuted,fontSize:20,cursor:"pointer"}}>←</button>
        <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>📋 Microsoft Forms 取込</div>
      </div>
      <div style={{background:"#1a0f2e",border:"1px solid #a78bfa",borderRadius:10,padding:12,fontSize:12,color:"#c4b5fd",lineHeight:1.7,marginBottom:4}}>
        <span style={{fontWeight:700,color:"#a78bfa"}}>💡 PDFも対応！</span> FormsのPDF（応答の概要）をClaudeに添付すると、問題を自動で取込めます。
      </div>
      <div style={{background:"#0f1e3a",border:"1px solid #0ea5e9",borderRadius:12,padding:14,fontSize:12,color:"#7dd3fc",lineHeight:1.8}}>
        <div style={{fontWeight:700,color:"#38bdf8",marginBottom:4}}>Formsからのエクスポート手順</div>
        <div>① Formsを開く → 「回答」タブ</div>
        <div>② 「Excelで開く」をクリック</div>
        <div>③ Excelで必要な行をコピー → 下のテキストボックスに貼付け</div>
      </div>
      <div style={{display:"flex",gap:0,background:COLORS.surfaceAlt,borderRadius:10,overflow:"hidden",border:`1px solid ${COLORS.border}`}}>
        <button onClick={()=>setFormsTab("questions")} style={{flex:1,background:formsTab==="questions"?"#0f1e3a":"transparent",color:formsTab==="questions"?"#38bdf8":COLORS.textMuted,border:"none",padding:"10px 0",fontWeight:700,fontSize:12,cursor:"pointer"}}>問題の取込</button>
        <button onClick={()=>setFormsTab("results")} style={{flex:1,background:formsTab==="results"?"#0f1e3a":"transparent",color:formsTab==="results"?"#38bdf8":COLORS.textMuted,border:"none",padding:"10px 0",fontWeight:700,fontSize:12,cursor:"pointer"}}>回答結果の取込</button>
      </div>
      {formsTab==="questions"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:COLORS.surfaceAlt,borderRadius:10,padding:12,fontSize:11,color:COLORS.textMuted,lineHeight:1.8}}>
            <div style={{fontWeight:700,color:COLORS.text,marginBottom:4}}>📌 貼付け形式（タブ区切り or カンマ区切り）</div>
            <div style={{fontFamily:"monospace",color:COLORS.textDim}}>ヘッダー行: 質問文[TAB]選択肢1[TAB]...選択肢4[TAB]正解</div>
            <div style={{fontFamily:"monospace",color:COLORS.textDim}}>データ行:  KY活動とは？[TAB]危険予知活動[TAB]緊急訓練[TAB]点検[TAB]書類[TAB]危険予知活動</div>
          </div>
          <textarea value={formsQText} onChange={e=>setFormsQText(e.target.value)} rows={7} placeholder="FormsのExcelデータをここに貼り付けてください..." style={{background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"12px",color:COLORS.text,fontSize:12,outline:"none",width:"100%",fontFamily:"monospace",resize:"vertical"}}/>
          {formsQError&&<div style={{background:"#450a0a",border:`1px solid ${COLORS.red}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:COLORS.red}}>⚠️ {formsQError}</div>}
          <Btn onClick={parseFormsQuestions} disabled={!formsQText.trim()}>プレビューを確認する</Btn>
          {formsQPreview.length>0&&(
            <div style={{background:COLORS.surface,border:`1px solid ${COLORS.green}`,borderRadius:10,padding:14}}>
              <div style={{fontSize:12,fontWeight:700,color:COLORS.green,marginBottom:10}}>✅ {formsQPreview.length}問を検出しました</div>
              {formsQPreview.map((q,i)=>(
                <div key={i} style={{borderBottom:`1px solid ${COLORS.border}`,paddingBottom:8,marginBottom:8}}>
                  <div style={{fontSize:12,color:COLORS.text,fontWeight:600}}>{i+1}. {q.q}</div>
                  <div style={{fontSize:11,color:COLORS.textMuted,marginTop:4}}>正解: {q.options[q.ans]}</div>
                </div>
              ))}
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <Btn onClick={importFormsQuestions}>このまま取込む</Btn>
                <Btn onClick={()=>setFormsQPreview([])} variant="ghost">キャンセル</Btn>
              </div>
            </div>
          )}
        </div>
      )}
      {formsTab==="results"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:COLORS.surfaceAlt,borderRadius:10,padding:12,fontSize:11,color:COLORS.textMuted,lineHeight:1.8}}>
            <div style={{fontWeight:700,color:COLORS.text,marginBottom:4}}>📌 貼付け形式（Excelエクスポートそのまま可）</div>
            <div style={{fontFamily:"monospace",color:COLORS.textDim}}>ヘッダー行に「名前」「点数」列が含まれていること</div>
            <div style={{fontFamily:"monospace",color:COLORS.textDim}}>例: 名前[TAB]メール[TAB]点数[TAB]...</div>
          </div>
          <textarea value={formsRText} onChange={e=>setFormsRText(e.target.value)} rows={7} placeholder="Formsの回答データをここに貼り付けてください..." style={{background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"12px",color:COLORS.text,fontSize:12,outline:"none",width:"100%",fontFamily:"monospace",resize:"vertical"}}/>
          {formsRError&&<div style={{background:"#450a0a",border:`1px solid ${COLORS.red}`,borderRadius:8,padding:"10px 14px",fontSize:12,color:COLORS.red}}>⚠️ {formsRError}</div>}
          <Btn onClick={parseFormsResults} disabled={!formsRText.trim()}>プレビューを確認する</Btn>
          {formsRPreview.length>0&&(
            <div style={{background:COLORS.surface,border:`1px solid ${COLORS.green}`,borderRadius:10,padding:14}}>
              <div style={{fontSize:12,fontWeight:700,color:COLORS.green,marginBottom:10}}>✅ {formsRPreview.length}件の回答結果を検出</div>
              {formsRPreview.map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:`1px solid ${COLORS.border}`}}>
                  <div style={{fontSize:12,color:COLORS.text}}>{r.name}</div>
                  <div style={{fontSize:13,fontWeight:800,color:COLORS.accent,fontFamily:"'DM Mono',monospace"}}>{r.score}点</div>
                </div>
              ))}
              <div style={{display:"flex",gap:8,marginTop:10}}>
                <Btn onClick={importFormsResults}>このまま取込む</Btn>
                <Btn onClick={()=>setFormsRPreview([])} variant="ghost">キャンセル</Btn>
              </div>
            </div>
          )}
        </div>
      )}
      <Btn onClick={()=>setView("list")} variant="ghost">← 戻る</Btn>
    </div>
  );

  if(view==="ai") return (
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setView("list")} style={{background:"transparent",border:"none",color:COLORS.textMuted,fontSize:20,cursor:"pointer"}}>←</button>
        <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>🤖 AI問題生成</div>
      </div>
      <div style={{background:"#1a1030",border:"1px solid #a78bfa",borderRadius:12,padding:16,fontSize:12,color:"#c4b5fd",lineHeight:1.7}}>
        AIがトピックをもとに4択問題を自動生成します。生成後に編集・削除も可能です。
      </div>
      <div><label style={lbl}>生成するトピック</label><input value={aiTopic} onChange={e=>setAiTopic(e.target.value)} placeholder="例: 5S活動、ヒヤリハット、品質管理の基本..." style={inp}/></div>
      <div>
        <label style={lbl}>生成する問題数</label>
        <div style={{display:"flex",gap:8}}>
          {[2,3,5,10].map(n=>(
            <button key={n} onClick={()=>setAiCount(n)} style={{flex:1,background:aiCount===n?"#1a1030":COLORS.surfaceAlt,color:aiCount===n?"#a78bfa":COLORS.textMuted,border:`1px solid ${aiCount===n?"#a78bfa":COLORS.border}`,borderRadius:8,padding:"8px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}>{n}問</button>
          ))}
        </div>
      </div>
      <button onClick={generateAI} disabled={aiLoading||!aiTopic.trim()} style={{background:aiLoading||!aiTopic.trim()?COLORS.surfaceAlt:"linear-gradient(135deg,#7c3aed,#4f8ef7)",color:aiLoading||!aiTopic.trim()?COLORS.textDim:"#fff",border:"none",borderRadius:10,padding:"13px 0",fontWeight:800,fontSize:14,cursor:aiLoading||!aiTopic.trim()?"default":"pointer"}}>
        {aiLoading?`生成中...`:`AIで${aiCount}問生成する`}
      </button>
      {aiResult&&<div style={{background:COLORS.surfaceAlt,borderRadius:10,padding:14,fontSize:13,color:COLORS.text,textAlign:"center",fontWeight:700}}>{aiResult}</div>}
      <Btn onClick={()=>setView("list")} variant="ghost">キャンセル</Btn>
    </div>
  );
}

function AdminView({ employees, setEmployees }) {
  const [view,setView]=useState("list"); // list | add | edit
  const [editTarget,setEditTarget]=useState(null);
  const BLANK={name:"",dept:"",channel:"新卒",cost:0,progress:0,testScore:0,risk:"低",joinDate:"",note:""};
  const [form,setForm]=useState(BLANK);
  const inp={background:COLORS.bg,border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"9px 12px",color:COLORS.text,fontSize:13,outline:"none",width:"100%",fontFamily:"'Noto Sans JP',sans-serif"};
  const lbl={fontSize:11,color:COLORS.textMuted,marginBottom:4,display:"block",fontWeight:700};

  const avgProgress=employees.length?Math.round(employees.reduce((a,e)=>a+e.progress,0)/employees.length):0;
  const highRisk=employees.filter(e=>e.risk==="高").length;

  function openAdd(){setForm(BLANK);setEditTarget(null);setView("add");}
  function openEdit(emp){setForm({...emp});setEditTarget(emp.id);setView("add");}
  function deleteEmp(id){if(window.confirm("この社員データを削除しますか？"))setEmployees(prev=>prev.filter(e=>e.id!==id));}
  function save(){
    if(!form.name.trim()){alert("氏名を入力してください");return;}
    if(editTarget){setEmployees(prev=>prev.map(e=>e.id===editTarget?{...e,...form,cost:Number(form.cost),progress:Number(form.progress),testScore:Number(form.testScore)}:e));}
    else{const newId=Math.max(0,...employees.map(e=>e.id))+1;setEmployees(prev=>[...prev,{id:newId,...form,cost:Number(form.cost),progress:Number(form.progress),testScore:Number(form.testScore)}]);}
    setView("list");
  }

  if(view==="add") return (
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setView("list")} style={{background:"transparent",border:"none",color:COLORS.textMuted,fontSize:20,cursor:"pointer"}}>←</button>
        <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>{editTarget?"社員情報を編集":"社員を追加"}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={lbl}>氏名</label><input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="田中 花子" style={inp}/></div>
        <div><label style={lbl}>部署</label><input value={form.dept} onChange={e=>setForm(f=>({...f,dept:e.target.value}))} placeholder="製造1課" style={inp}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={lbl}>採用チャネル</label>
          <select value={form.channel} onChange={e=>setForm(f=>({...f,channel:e.target.value}))} style={inp}>
            {["新卒","エージェント","リファラル","中途","その他"].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div><label style={lbl}>採用コスト（円）</label><input type="number" value={form.cost} onChange={e=>setForm(f=>({...f,cost:e.target.value}))} placeholder="180000" style={inp}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={lbl}>研修進捗（%）</label><input type="number" min="0" max="100" value={form.progress} onChange={e=>setForm(f=>({...f,progress:e.target.value}))} style={inp}/></div>
        <div><label style={lbl}>テスト平均点</label><input type="number" min="0" max="100" value={form.testScore} onChange={e=>setForm(f=>({...f,testScore:e.target.value}))} style={inp}/></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div><label style={lbl}>離職リスク</label>
          <select value={form.risk} onChange={e=>setForm(f=>({...f,risk:e.target.value}))} style={inp}>
            {["低","中","高"].map(r=><option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div><label style={lbl}>入社日</label><input type="date" value={form.joinDate} onChange={e=>setForm(f=>({...f,joinDate:e.target.value}))} style={inp}/></div>
      </div>
      <div><label style={lbl}>備考・メモ</label><textarea value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} rows={2} placeholder="特記事項など" style={{...inp,resize:"vertical"}}/></div>
      <div style={{display:"flex",gap:10}}><Btn onClick={save}>{editTarget?"更新する":"追加する"}</Btn><Btn onClick={()=>setView("list")} variant="ghost">キャンセル</Btn></div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>管理者ダッシュボード</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <Stat label="在籍新入社員" value={`${employees.length}名`}/>
        <Stat label="平均進捗" value={`${avgProgress}%`} color={COLORS.accent}/>
        <Stat label="要フォロー" value={`${highRisk}名`} color={highRisk>0?COLORS.red:COLORS.green}/>
        <Stat label="研修完了予定" value="6月末"/>
      </div>
      <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{fontSize:13,fontWeight:700,color:COLORS.text}}>社員別進捗</div>
          <Btn onClick={openAdd} small>＋ 社員追加</Btn>
        </div>
        {employees.map(emp=>(
          <div key={emp.id} style={{padding:"14px 18px",borderBottom:`1px solid ${COLORS.border}`,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:COLORS.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:COLORS.accent,flexShrink:0}}>{emp.name[0]}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><div style={{fontSize:13,fontWeight:700,color:COLORS.text}}>{emp.name}</div><Badge>{emp.risk}</Badge></div>
              <ProgressBar pct={emp.progress} color={emp.risk==="高"?COLORS.red:emp.risk==="中"?COLORS.amber:COLORS.green}/>
              <div style={{fontSize:10,color:COLORS.textDim,marginTop:3}}>{emp.dept} · {emp.channel} · ¥{(emp.cost/10000).toFixed(0)}万</div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <Btn onClick={()=>openEdit(emp)} variant="ghost" small>編集</Btn>
              <Btn onClick={()=>deleteEmp(emp.id)} variant="danger" small>削除</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalysisView({ employees }) {
  const [uploaded,setUploaded]=useState(false);
  const [analyzing,setAnalyzing]=useState(false);
  const [insight,setInsight]=useState("");

  async function runAI(){
    setAnalyzing(true);setInsight("");
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"あなたは製造業の人材分析の専門家AIです。提供されたデータから重回帰分析的な観点で洞察を提供してください。日本語で簡潔にまとめてください。",messages:[{role:"user",content:`以下の新入社員データを分析し、(1)早期戦力化に最も影響する要因、(2)離職リスクの高い社員への提言、(3)採用チャネル別のROI評価を提供してください。\n\n${JSON.stringify(employees)}`}]})});
      const data=await res.json();
      setInsight(data.content?.map(b=>b.text||"").join("")||"分析に失敗しました。");
    } catch{setInsight("通信エラーが発生しました。");}
    setAnalyzing(false);
  }

  return (
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{fontSize:16,fontWeight:800,color:COLORS.text}}>人材分析エンジン</div>
      <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:18}}>
        <div style={{fontSize:13,fontWeight:700,color:COLORS.text,marginBottom:14}}>💰 採用コスト概要</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {["新卒","エージェント","リファラル"].map(ch=>{
            const emps=employees.filter(e=>e.channel===ch);
            const avg=emps.length?Math.round(emps.reduce((a,e)=>a+e.cost,0)/emps.length):0;
            const avgP=emps.length?Math.round(emps.reduce((a,e)=>a+e.progress,0)/emps.length):0;
            return <div key={ch} style={{background:COLORS.surfaceAlt,borderRadius:10,padding:12,textAlign:"center"}}><div style={{fontSize:11,color:COLORS.textMuted,marginBottom:4}}>{ch}</div><div style={{fontSize:15,fontWeight:800,color:COLORS.text,fontFamily:"'DM Mono',monospace"}}>¥{(avg/10000).toFixed(0)}万</div><div style={{fontSize:10,color:COLORS.accent,marginTop:2}}>進捗 {avgP}%</div></div>;
          })}
        </div>
      </div>
      <div style={{background:COLORS.surface,border:`2px dashed ${uploaded?COLORS.green:COLORS.border}`,borderRadius:12,padding:20,textAlign:"center"}}>
        <div style={{fontSize:20,marginBottom:8}}>{uploaded?"✅":"📂"}</div>
        <div style={{fontSize:13,fontWeight:700,color:COLORS.text,marginBottom:4}}>{uploaded?"360°調査・適職性診断データ取込済":"外部データを取り込む"}</div>
        <div style={{fontSize:11,color:COLORS.textMuted,marginBottom:14}}>CSV / Excel形式対応（360°調査・適職性診断・エンゲージメント）</div>
        <button onClick={()=>setUploaded(true)} style={{background:uploaded?COLORS.greenSoft:COLORS.accentSoft,color:uploaded?COLORS.green:COLORS.accent,border:`1px solid ${uploaded?COLORS.green:COLORS.accent}`,borderRadius:8,padding:"8px 20px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{uploaded?"再取込":"ファイルを選択（デモ）"}</button>
      </div>
      <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:20}}>
        <div style={{fontSize:13,fontWeight:700,color:COLORS.text,marginBottom:6}}>🔬 AI重回帰分析・インサイト</div>
        <div style={{fontSize:11,color:COLORS.textMuted,marginBottom:14}}>採用コスト・研修進捗・テスト結果・外部診断データを統合分析します</div>
        <button onClick={runAI} disabled={analyzing} style={{width:"100%",background:analyzing?COLORS.surfaceAlt:`linear-gradient(135deg,${COLORS.accent},#6366f1)`,color:analyzing?COLORS.textMuted:"#fff",border:"none",borderRadius:10,padding:"12px 0",fontWeight:800,fontSize:13,cursor:analyzing?"default":"pointer",marginBottom:insight?16:0}}>
          {analyzing?"分析中...":"AIで分析を実行する"}
        </button>
        {insight&&<div style={{background:COLORS.surfaceAlt,borderRadius:10,padding:16,fontSize:12,color:COLORS.text,lineHeight:1.8,whiteSpace:"pre-wrap"}}>{insight}</div>}
      </div>
      <div style={{background:COLORS.surface,border:`1px solid ${COLORS.border}`,borderRadius:12,padding:18}}>
        <div style={{fontSize:13,fontWeight:700,color:COLORS.text,marginBottom:14}}>📊 社員別 採用コスト vs 進捗率</div>
        {employees.map(emp=>(
          <div key={emp.id} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:11,color:COLORS.textMuted}}>{emp.name}</div><div style={{fontSize:11,color:COLORS.textMuted,fontFamily:"'DM Mono',monospace"}}>¥{(emp.cost/10000).toFixed(0)}万 / {emp.progress}%</div></div>
            <ProgressBar pct={emp.progress} color={emp.risk==="高"?COLORS.red:emp.risk==="中"?COLORS.amber:COLORS.green}/>
          </div>
        ))}
      </div>
    </div>
  );
}


// ─── パスワード設定（ここを変更してください）────────────────
const PASSWORDS = {
  admin: "admin1234",    // 管理者パスワード
  employee: "staff1234", // 社員パスワード
};

function LoginScreen({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleLogin() {
    if (!password.trim()) { setError("パスワードを入力してください"); return; }
    if (selectedRole === "admin" && password === PASSWORDS.admin) {
      onLogin("admin");
    } else if (selectedRole === "employee" && password === PASSWORDS.employee) {
      onLogin("employee");
    } else {
      setError("パスワードが正しくありません");
      setPassword("");
    }
  }

  const inp = {background:"#1a1d27",border:`1px solid ${error?"#ef4444":"#2a2f45"}`,borderRadius:10,padding:"12px 14px",color:"#e8eaf0",fontSize:14,outline:"none",width:"100%",fontFamily:"'Noto Sans JP',sans-serif"};

  return (
    <div style={{width:"100%",maxWidth:400}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:40,marginBottom:12}}>🏭</div>
        <div style={{fontSize:22,fontWeight:800,color:"#e8eaf0",marginBottom:6}}>HR Training Platform</div>
        <div style={{fontSize:13,color:"#7c85a2"}}>製造・メーカー系 新入社員教育システム</div>
      </div>

      {!selectedRole ? (
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{fontSize:13,color:"#7c85a2",textAlign:"center",marginBottom:4}}>ログイン区分を選択してください</div>
          <button onClick={()=>setSelectedRole("employee")}
            style={{background:"#4f8ef7",color:"#fff",border:"none",borderRadius:12,padding:"16px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
            👤 新入社員
          </button>
          <button onClick={()=>setSelectedRole("admin")}
            style={{background:"#1a1d27",color:"#e8eaf0",border:"1px solid #2a2f45",borderRadius:12,padding:"16px 0",fontWeight:700,fontSize:15,cursor:"pointer"}}>
            🔧 管理者
          </button>
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <button onClick={()=>{setSelectedRole(null);setPassword("");setError("");}}
              style={{background:"transparent",border:"none",color:"#7c85a2",fontSize:18,cursor:"pointer",padding:0}}>←</button>
            <div style={{fontSize:14,fontWeight:700,color:"#e8eaf0"}}>
              {selectedRole==="admin"?"🔧 管理者ログイン":"👤 新入社員ログイン"}
            </div>
          </div>
          <div style={{background:"#1e3a6e",border:"1px solid #4f8ef7",borderRadius:10,padding:"10px 14px",fontSize:12,color:"#93c5fd"}}>
            {selectedRole==="admin"
              ? "管理者パスワードを入力してください"
              : "社員パスワードを入力してください"}
          </div>
          <div style={{position:"relative"}}>
            <input
              type={showPass?"text":"password"}
              value={password}
              onChange={e=>{setPassword(e.target.value);setError("");}}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              placeholder="パスワードを入力"
              style={inp}
              autoFocus
            />
            <button onClick={()=>setShowPass(s=>!s)}
              style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",color:"#7c85a2",cursor:"pointer",fontSize:16}}>
              {showPass?"🙈":"👁"}
            </button>
          </div>
          {error&&(
            <div style={{background:"#450a0a",border:"1px solid #ef4444",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#f87171"}}>
              ⚠️ {error}
            </div>
          )}
          <button onClick={handleLogin}
            style={{background:"#4f8ef7",color:"#fff",border:"none",borderRadius:12,padding:"14px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
            ログイン
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab,setTab]=useState("ホーム");
  const [role,setRole]=useState(null);
  const [questions,setQuestions]=useState(INITIAL_QUESTIONS);
  const [formScores,setFormScores]=useState([]);
  const [employees,setEmployees]=useState(INITIAL_EMPLOYEES);

  if(!role) return (
    <div style={{minHeight:"100vh",background:COLORS.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Noto Sans JP',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+JP:wght@400;600;700;800&display=swap');@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
      <LoginScreen onLogin={(r)=>{setRole(r);setTab(r==="admin"?"管理":"ホーム");}}/>
    </div>
  );

  const empTabs=["ホーム","学習","AIチャット","テスト"];
  const admTabs=["管理","テスト管理","人材分析","AIチャット"];
  const tabs=role==="employee"?empTabs:admTabs;
  const icons={"ホーム":"🏠","学習":"📚","AIチャット":"🤖","テスト":"📝","管理":"📊","テスト管理":"✏️","人材分析":"🔬"};

  const renderView=()=>{
    switch(tab){
      case"ホーム":return <HomeView setTab={setTab}/>;
      case"学習":return <LearningView/>;
      case"AIチャット":return <ChatView/>;
      case"テスト":return <TestView questions={questions}/>;
      case"管理":return <AdminView employees={employees} setEmployees={setEmployees}/>;
      case"テスト管理":return <TestManager questions={questions} setQuestions={setQuestions} formScores={formScores} setFormScores={setFormScores}/>;
      case"人材分析":return <AnalysisView employees={employees}/>;
      default:return null;
    }
  };

  return (
    <div style={{minHeight:"100vh",background:COLORS.bg,fontFamily:"'Noto Sans JP',sans-serif",color:COLORS.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Noto+Sans+JP:wght@400;600;700;800&display=swap');@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#2a2f45;border-radius:99px}input::placeholder,textarea::placeholder{color:#4a5170}select option{background:#1a1d27}`}</style>
      <div style={{background:COLORS.surface,borderBottom:`1px solid ${COLORS.border}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{fontSize:18}}>🏭</div><div style={{fontSize:14,fontWeight:800,color:COLORS.text}}>HR Training</div></div>
        <button onClick={()=>setRole(null)} style={{background:"transparent",border:`1px solid ${COLORS.border}`,borderRadius:8,padding:"5px 12px",color:COLORS.textMuted,fontSize:11,cursor:"pointer"}}>ログアウト</button>
      </div>
      <div style={{padding:"20px 16px 100px",maxWidth:600,margin:"0 auto"}}>{renderView()}</div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:COLORS.surface,borderTop:`1px solid ${COLORS.border}`,display:"flex",padding:"8px 0 4px"}}>
        {tabs.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{flex:1,background:"transparent",border:"none",color:tab===t?COLORS.accent:COLORS.textDim,fontSize:9,fontWeight:tab===t?800:500,cursor:"pointer",padding:"6px 2px",fontFamily:"'Noto Sans JP',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{fontSize:18}}>{icons[t]||"📌"}</div>{t}
          </button>
        ))}
      </div>
    </div>
  );
}
