
/*
  Fortune Fate V12 Spicy Detail Report Engine
  - 주제별 답변 분리 유지
  - "왜 이런 결론인지" 사주 근거 강화
  - 한국인이 좋아하는 냉정/소름/자극 문장 강화
  - 위험한 단정(사망/질병/투자수익/합격확정 등)은 제외
*/
(function(){
  const MENU=[
    ["life","내 인생 전체 흐름","평생 흐름·전환점·반복 패턴","self"],
    ["year","2026년 운세","2026년 기회·리스크·월별 흐름","self"],
    ["money","재물·돈의 그릇","돈이 들어오는 방식과 새는 습관","self"],
    ["career","직업·사업 운","직장·사업·이직·창업 방향","self"],
    ["love","연애·결혼 운","연애 스타일·결혼 기준·맞는 사람","self"],
    ["match","궁합 분석","두 사람의 끌림과 갈등 포인트","partner"],
    ["friend","친구 궁합","친구로 잘 맞는지·서운함 포인트·거리감","partner"],
    ["family","가족 관계","가족 안에서의 역할과 갈등 해결","family"],
    ["luck","개운법","색상·습관·오늘 할 행동","self"],
    ["risk","조심해야 할 것","돈·관계·건강에서 주의할 점","self"],
    ["total","전체 종합 분석","돈·일·연애·가족을 한 번에","self"]
  ];

  const ELEM={
    목:{label:"성장·시작·배움·계획", trait:"새로운 것을 배우고 키우는 힘", money:"교육·기획·성장형 일·소개를 통한 확장", work:"기획, 교육, 콘텐츠, 브랜딩, 신규 프로젝트", love:"함께 성장하는 관계", risk:"계획만 많아지고 실행이 늦어질 수 있음", luck:"초록색, 산책, 식물, 새 노트, 아침 루틴", toxic:"생각은 많은데 시작이 늦어 타이밍을 놓칠 수 있습니다.", soreum:"머리로는 이미 답을 알고 있는데, 스스로 확신을 미루는 패턴이 있습니다."},
    화:{label:"표현·인기·홍보·열정", trait:"사람들 앞에서 드러나고 표현하는 힘", money:"홍보·영업·발표·노출을 통한 수입", work:"마케팅, 영업, 발표, 디자인, 영상, 행사", love:"표현과 확신이 있는 관계", risk:"감정이 과열되거나 말이 앞설 수 있음", luck:"핑크 포인트, 조명, 발표, 짧은 운동, 밝은 표정", toxic:"좋을 때는 확 타오르지만, 마음이 식으면 표정과 말투에서 바로 티가 납니다.", soreum:"인정받고 싶은 마음이 강해질수록 아닌 척해도 상대 반응을 계속 확인하게 됩니다."},
    토:{label:"현실·책임·돈 관리·안정", trait:"현실을 붙잡고 책임지는 힘", money:"관리·장기 고객·반복 거래·안정형 수입", work:"운영, 관리, 회계, 매장, 조직 유지", love:"안정감과 책임감이 있는 관계", risk:"혼자 너무 많이 떠안거나 답답함을 참을 수 있음", luck:"베이지, 가계부, 집안 정리, 고정 루틴", toxic:"착한 사람 역할을 오래 하면 어느 순간 내가 제일 손해 본 느낌이 듭니다.", soreum:"겉으로는 괜찮다고 하지만 속으로는 이미 계산이 끝나 있는 경우가 많습니다."},
    금:{label:"정리·기준·판단·결과", trait:"기준을 세우고 결과를 만드는 힘", money:"계약·전문성·품질·정산이 명확한 수입", work:"검수, 행정, 분석, 품질관리, 전문직", love:"애매함보다 명확한 관계", risk:"차갑게 보이거나 완벽주의가 강해질 수 있음", luck:"화이트·실버, 체크리스트, 물건 비우기, 계약서 확인", toxic:"아닌 건 아닌 겁니다. 애매한 사람과 일에 시간을 쓰면 운이 샙니다.", soreum:"상대를 좋아해도 마음속 기준에서 탈락하면 어느 순간 차갑게 정리합니다."},
    수:{label:"생각·감정·회복·지혜", trait:"흐름을 읽고 깊게 생각하는 힘", money:"정보·상담·온라인·유통·연결형 수입", work:"전략, 데이터, 상담, 글쓰기, 온라인 운영", love:"편안한 대화와 깊은 감정 교류", risk:"걱정이 많아지고 결정을 미룰 수 있음", luck:"블랙, 물 마시기, 수면 회복, 기록, 조용한 공간", toxic:"생각이 너무 많아지면 기회가 와도 스스로 문을 닫을 수 있습니다.", soreum:"혼자 조용히 있는 시간이 길어질수록 마음속 결론은 이미 깊게 내려져 있습니다."}
  };

  const STEM={
    갑:["큰 나무처럼 곧게 밀고 가는 타입","목표를 잡으면 쉽게 포기하지 않습니다","다만 고집이 세 보일 수 있어 유연함이 필요합니다"],
    을:["풀과 꽃처럼 부드럽게 파고드는 타입","분위기와 사람을 잘 읽습니다","다만 눈치를 많이 보거나 마음을 숨길 수 있습니다"],
    병:["태양처럼 밝게 드러나는 타입","표현력과 존재감이 좋습니다","다만 감정이 얼굴에 잘 드러날 수 있습니다"],
    정:["촛불처럼 섬세하게 집중하는 타입","한 사람, 한 일에 깊게 몰입합니다","다만 예민함과 서운함이 쌓일 수 있습니다"],
    무:["산처럼 중심을 잡는 타입","버티는 힘과 책임감이 강합니다","다만 변화가 느리거나 혼자 짐을 질 수 있습니다"],
    기:["밭처럼 현실을 가꾸는 타입","생활 감각과 관리 능력이 좋습니다","다만 작은 걱정이 많아질 수 있습니다"],
    경:["쇠처럼 결단력 있는 타입","정리하고 결정하는 힘이 강합니다","다만 말이 직선적으로 느껴질 수 있습니다"],
    신:["보석처럼 섬세한 기준을 가진 타입","디테일과 감각이 좋습니다","다만 마음에 안 들면 쉽게 차가워질 수 있습니다"],
    임:["큰 물처럼 흐름을 읽는 타입","생각의 폭이 넓고 정보 감각이 좋습니다","다만 방향을 못 잡으면 산만해질 수 있습니다"],
    계:["비처럼 조용히 스며드는 타입","직감과 관찰력이 좋고 조용히 강합니다","다만 고민을 혼자 오래 품을 수 있습니다"]
  };

  const MONTH={
    자:"생각과 감정이 깊어지는 구조라 밤에 고민이 많아질 수 있습니다.",
    축:"버티는 힘이 강하지만 답답함을 오래 참지 않는 것이 중요합니다.",
    인:"새로운 시작과 배움의 기운이 있어 이동, 확장, 공부에 유리합니다.",
    묘:"관계 감각과 분위기 파악이 좋아 사람을 통한 기회가 생깁니다.",
    진:"변화 전 준비의 기운이 있어 현실 점검과 방향 정리가 중요합니다.",
    사:"표현과 활동성이 살아나지만 과열과 말실수를 조심해야 합니다.",
    오:"사람들 앞에 드러나는 힘이 강해 홍보와 인기운이 살아납니다.",
    미:"가족, 책임, 돈 관리가 중요한 주제로 올라오기 쉽습니다.",
    신:"결과를 만들고 정리하는 힘이 강해 일의 성과를 내기 좋습니다.",
    유:"기준과 감각이 예민해져 선택과 정리에 강해집니다.",
    술:"마무리, 계약, 책임 문제가 중요해지는 흐름입니다.",
    해:"생각과 감정이 깊어져 공부, 기획, 회복에 좋습니다."
  };

  const SPICY=[
    "좋게 말하면 가능성이 많고, 냉정하게 말하면 정리가 안 되면 다 놓칠 수 있습니다.",
    "운이 안 좋은 게 아니라, 기준 없이 끌려다니면 운이 새는 구조입니다.",
    "이 사주는 사람을 잘못 고르면 돈보다 멘탈이 먼저 털립니다.",
    "지금 필요한 건 위로가 아니라 정리입니다.",
    "애매한 사람, 애매한 일, 애매한 돈이 제일 위험합니다.",
    "계속 맞춰주면 착한 사람이 아니라 만만한 사람이 될 수 있습니다.",
    "지금 흐름에서 제일 위험한 건 ‘나중에 하자’입니다. 나중에 하면 판이 식습니다.",
    "마음 약해서 넘긴 문제가 결국 같은 자리에서 다시 터질 수 있습니다."
  ];

  const POOLS={
    moneyLeak:["기분 전환용 소비가 반복되면 돈이 새기 쉽습니다.","사람 때문에 쓰는 돈과 필요한 돈을 구분해야 합니다.","작은 구독, 배달, 즉흥 구매가 모이면 큰 지출이 됩니다.","새로운 일을 시작할 때 준비 비용이 커질 수 있습니다."],
    moneyGrow:["고정비를 줄이고 매주 지출을 확인하면 바로 효과가 납니다.","수입이 들어오면 생활비, 저축, 비상금으로 바로 나누세요.","반복 수입을 하나라도 만들면 돈 흐름이 안정됩니다.","계약, 정산, 가격표를 명확히 하면 돈운이 좋아집니다."],
    career:["스스로 판단하고 움직이는 일에서 강점이 나옵니다.","사람과 정보를 연결할 때 성과가 납니다.","경험을 정리해 보여줄 때 일이 풀립니다.","혼자 열심히 하는 것보다 시스템을 만드는 것이 중요합니다."],
    love:["말보다 반복되는 행동을 봐야 합니다.","생활 습관이 맞는 사람이 오래 갑니다.","연락과 태도가 일정한 사람이 안정적입니다.","설렘보다 신뢰가 오래 갑니다."],
    family:["가족 문제는 기대 차이에서 시작되는 경우가 많습니다.","내 역할과 가족의 역할을 나눠야 피로가 줄어듭니다.","돈 문제와 감정 문제를 분리해야 합니다.","짧고 정확하게 부탁하는 것이 좋습니다."],
    risk:["급한 결정이 가장 큰 리스크입니다.","지친 상태에서 돈과 관계를 결정하면 손해가 생깁니다.","모두에게 잘하려고 하면 결국 지칩니다.","계약과 약속은 글로 남기는 것이 안전합니다."]
  };

  function hasPartner(p){return !!(p.partner.name&&p.partner.birth)}
  function hasFamily(p){return p.families&&p.families.length>0}
  function esc(s){return String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]))}
  function hash(str){let h=2166136261;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function pick(arr,seed,off=0){return arr[(seed+off)%arr.length]}
  function highLow(a){const e=Object.entries(a.counts).sort((x,y)=>y[1]-x[1]);return{high:e[0][0],second:e[1][0],low:e[e.length-1][0],low2:e[e.length-2][0]}}
  function seedOf(p,id,a){return hash([p.me.birth,p.me.time,p.me.gender,p.me.concern,p.partner.birth,p.partner.time,(p.families||[]).map(f=>f.birth).join("|"),id,a.dayStem,a.month,a.strength.level].join("::"))}
  function card(emoji,title,body){return{html:`<div class="result-card"><h3 class="result-card-title"><span class="emoji">${emoji}</span><span>${esc(title)}</span></h3><p>${esc(body).replace(/\n/g,"<br>")}</p></div>`,text:`\n[${title}]\n${body}`}}
  function easy(body){return{html:`<div class="easy-box"><div class="easy-title">💗 [쉬운설명]</div><div class="easy-text">${esc(body).replace(/\n/g,"<br>")}</div></div>`,text:`\n[쉬운설명]\n${body}`}}
  function combine(parts){return{html:parts.map(p=>p.html).join(""),text:parts.map(p=>p.text).join("\n")}}

  const STEM_ELEM={갑:"목",을:"목",병:"화",정:"화",무:"토",기:"토",경:"금",신:"금",임:"수",계:"수"};
  const STEM_YINYANG={갑:"양",병:"양",무:"양",경:"양",임:"양",을:"음",정:"음",기:"음",신:"음",계:"음"};
  const BRANCH_ELEM={자:"수",축:"토",인:"목",묘:"목",진:"토",사:"화",오:"화",미:"토",신:"금",유:"금",술:"토",해:"수"};
  const PRODUCES_LOCAL={목:"화",화:"토",토:"금",금:"수",수:"목"};
  const CONTROLS_LOCAL={목:"토",토:"수",수:"화",화:"금",금:"목"};
  const PRODUCED_BY_LOCAL={화:"목",토:"화",금:"토",수:"금",목:"수"};
  const CONTROLLED_BY_LOCAL={토:"목",수:"토",화:"수",금:"화",목:"금"};
  const TEN_DESC={
    비견:"자기주도·독립심·고집", 겁재:"경쟁·승부욕·사람과 돈의 출입",
    식신:"꾸준한 표현·생산성·먹고사는 기술", 상관:"튀는 표현·반항심·브랜딩·말의 힘",
    정재:"고정수입·현실적 돈관리·성실한 축적", 편재:"큰돈 감각·사업성·영업·기회 포착",
    정관:"조직·명예·책임·공식 자리", 편관:"압박 속 성과·위기 돌파·강한 책임",
    정인:"보호·문서·공부·안정된 도움", 편인:"직감·기획·비정형 재능·혼자 파고듦"
  };
  function tenGod(dayStem,targetStem){
    const de=STEM_ELEM[dayStem], te=STEM_ELEM[targetStem];
    const same=STEM_YINYANG[dayStem]===STEM_YINYANG[targetStem];
    if(de===te)return same?"비견":"겁재";
    if(PRODUCES_LOCAL[de]===te)return same?"식신":"상관";
    if(CONTROLS_LOCAL[de]===te)return same?"편재":"정재";
    if(CONTROLLED_BY_LOCAL[de]===te)return same?"편관":"정관";
    if(PRODUCED_BY_LOCAL[de]===te)return same?"편인":"정인";
    return "기타";
  }
  function tenGodProfile(a){
    const day=a.pillars[2].stem;
    const gods=a.pillars.map(p=>tenGod(day,p.stem));
    const counts={};
    gods.forEach(g=>counts[g]=(counts[g]||0)+1);
    const top=Object.entries(counts).sort((x,y)=>y[1]-x[1])[0]?.[0]||"비견";
    return {day,gods,counts,top};
  }
  function tenGodCardText(a){
    const tg=tenGodProfile(a);
    const lines=a.pillars.map((p,i)=>`${["년","월","일","시"][i]}간 ${p.stem}: ${tg.gods[i]}(${TEN_DESC[tg.gods[i]]||"개성"})`).join("\n");
    return `십신은 “내 일간이 다른 글자를 어떻게 보는가”입니다.\n${lines}\n가장 강하게 반복되는 키워드는 ${tg.top}입니다. ${TEN_DESC[tg.top]||""}\n냉정하게 보면, 십신은 성격이 아니라 행동 패턴입니다. 같은 문제가 반복된다면 이 키워드가 현실에서 과하게 작동하는 경우가 많습니다.`;
  }
  function moneyGodText(a){
    const c=tenGodProfile(a).counts;
    const jung=c.정재||0, pyun=c.편재||0;
    if(jung&&pyun)return "정재와 편재가 함께 보입니다. 고정수입을 지키면서도 기회성 수입을 만들 수 있는 구조입니다. 다만 안정과 확장 둘 다 잡으려다 지출도 같이 커질 수 있습니다.";
    if(jung)return "정재가 두드러집니다. 월급, 고정 거래, 정산이 명확한 돈에 강합니다. 한 방보다 꾸준히 쌓는 돈이 맞습니다.";
    if(pyun)return "편재가 두드러집니다. 영업, 사업, 소개, 기회 포착에 강합니다. 돈의 스케일은 커질 수 있지만 들어온 만큼 나가기도 쉽습니다.";
    return "재성이 겉으로 강하게 드러나지는 않습니다. 이 경우 돈은 운으로 잡기보다 기술, 기록, 반복 구조로 만들어야 합니다.";
  }
  function careerGodText(a){
    const c=tenGodProfile(a).counts;
    const food=(c.식신||0)+(c.상관||0), official=(c.정관||0)+(c.편관||0);
    if(food&&official)return "식상과 관성이 함께 보입니다. 표현력과 책임 구조가 같이 있어, 기획하고 보여주되 결과 책임까지 져야 성과가 납니다.";
    if(food)return "식상이 강합니다. 말, 글, 콘텐츠, 기획, 생산성, 홍보로 먹고사는 힘이 있습니다. 단, 말이 앞서면 신뢰가 깨집니다.";
    if(official)return "관성이 강합니다. 조직, 규칙, 책임, 직함, 공식적인 자리에서 운이 살아납니다. 단, 압박을 너무 혼자 떠안으면 지칩니다.";
    return "식상·관성이 강하게 드러나지 않습니다. 이 경우 직업운은 특정 명함보다 내가 가진 기술을 어떻게 구조화하느냐가 중요합니다.";
  }
  function spousePalaceText(a){
    const b=a.pillars[2].branch, e=BRANCH_ELEM[b]||a.pillars[2].be, info=ELEM[e];
    const mood={
      자:"속마음과 감정 교류가 중요합니다. 말은 적어도 마음 확인을 자주 해야 안정됩니다.",
      축:"생활 안정과 책임감이 중요합니다. 오래 가려면 돈과 현실 기준이 맞아야 합니다.",
      인:"서로 성장하고 움직이는 관계가 좋습니다. 답답하게 묶는 관계는 오래 버티기 어렵습니다.",
      묘:"다정함과 분위기가 중요합니다. 말투가 차가워지면 마음이 쉽게 닫힐 수 있습니다.",
      진:"현실 문제와 미래 계획을 함께 잡아야 합니다. 애매한 약속은 불안으로 쌓입니다.",
      사:"표현과 열정이 강합니다. 좋을 때는 빠르지만 감정 과열을 조심해야 합니다.",
      오:"확신과 표현이 중요합니다. 자존심 싸움이 생기면 관계가 빨리 뜨거워지고 빨리 지칩니다.",
      미:"가족, 책임, 생활 리듬이 중요합니다. 혼자 희생하는 구조가 되면 서운함이 깊어집니다.",
      신:"기준과 현실 판단이 강합니다. 상대가 무책임하면 마음에서 빠르게 정리될 수 있습니다.",
      유:"깔끔한 태도와 약속이 중요합니다. 애매한 말, 늦은 답장, 흐린 태도에 예민할 수 있습니다.",
      술:"신뢰와 책임이 중요합니다. 오래된 서운함이 쌓이면 한 번에 정리하려 할 수 있습니다.",
      해:"정서적 안정과 깊은 대화가 중요합니다. 혼자 생각이 많아지면 오해가 커질 수 있습니다."
    };
    return `배우자궁은 일지 ${b}(${e})로 봅니다.\n${mood[b]||info.love}\n이 구조에서는 ${info.love}가 중요하고, 흔들리면 ${info.risk}\n냉정하게 말하면, 좋아하는 마음보다 “같이 살 때 덜 피곤한가”가 더 중요합니다.`;
  }
  function sinsalText(a){
    const bs=a.pillars.map(p=>p.branch);
    const items=[];
    if(bs.some(b=>["인","신","사","해"].includes(b)))items.push(["역마 기운","이동·변화·활동성이 강합니다. 가만히 있으면 답답하고 움직일 때 운이 열립니다."]);
    if(bs.some(b=>["자","오","묘","유"].includes(b)))items.push(["도화 기운","사람 눈에 띄는 힘이 있습니다. 매력으로 기회가 오지만, 구설과 애매한 관계도 조심해야 합니다."]);
    if(bs.some(b=>["진","술","축","미"].includes(b)))items.push(["화개 기운","혼자 파고드는 힘, 예술성, 깊은 생각이 있습니다. 대신 고립감이 생길 수 있습니다."]);
    if(["인","오","술"].includes(a.pillars[2].branch))items.push(["장성 느낌","밀고 나가는 힘이 있어 책임지는 자리에서 강해질 수 있습니다."]);
    if(["해","묘","미"].includes(a.pillars[2].branch))items.push(["문창 느낌","말·글·기획·학습 감각이 살아나기 쉽습니다."]);
    if(!items.length)items.push(["균형형 신살","튀는 신살보다 기본 구조가 중요합니다. 운을 키우려면 루틴과 선택 기준이 먼저입니다."]);
    return items.slice(0,4).map(x=>`• ${x[0]}: ${x[1]}`).join("\n")+"\n※ 신살·길성은 참고용 보조 해석입니다. 원국 전체 구조와 함께 봐야 합니다.";
  }
  function tenYearFlow(a,seed){
    const hl=highLow(a);
    const seq=[hl.low,hl.second,hl.high,a.yongsin[0]||hl.low,a.yongsin[1]||hl.second];
    const start=20+(seed%5);
    return [0,1,2,3,4].map((i)=>{
      const age1=start+i*10, age2=age1+9, e=seq[i%seq.length], info=ELEM[e];
      const tone=["기초를 다지는 시기","일과 관계가 넓어지는 시기","성과와 책임이 커지는 시기","정리와 재선택의 시기","다음 판을 준비하는 시기"][i];
      return `${age1}~${age2}세: ${tone}. ${e}(${info.label}) 흐름이 강해져 ${info.trait}이 중요합니다. 조심할 점은 ${info.risk}`;
    }).join("\n");
  }
  function year2026Text(a){
    return `2026년은 병오년입니다. 병화와 오화의 불기운이 강해지는 해로, 숨겨둔 것을 밖으로 보여주는 흐름이 강합니다.\n내 원국에서 화가 강하면 과열·말실수·감정 소모를 조심해야 하고, 화가 부족하면 홍보·표현·노출의 기회가 될 수 있습니다.\n즉 2026년은 “가만히 있으면 답답하고, 움직이면 기회가 보이지만, 급하면 사고가 나는 해”에 가깝습니다.`;
  }
  function relationTypeStrategy(type, rr, seed){
    const friend=[
      `친구 궁합은 “재미”보다 “만나고 난 뒤 마음이 편한가”가 핵심입니다. ${rr.strategy} 돈거래, 부탁, 약속 변경은 선을 정해야 오래 갑니다.`,
      `이 친구는 가까울수록 장점도 보이지만 서운함도 빨리 쌓일 수 있습니다. 자주 보는 것보다 편한 거리를 유지하는 게 오래 갑니다.`,
      `친구 사이에서 제일 위험한 건 큰 싸움이 아니라 작은 무시감입니다. 농담, 지각, 돈 계산에서 반복되면 마음이 식습니다.`
    ];
    const biz=[
      `동업 궁합은 친함보다 역할·돈·책임 분리가 핵심입니다. ${rr.strategy} 수익 배분, 비용 부담, 결정권을 글로 정하지 않으면 관계가 깨질 수 있습니다.`,
      `비즈니스 관계라면 정이 아니라 문서가 먼저입니다. 누가 결정하고 누가 책임지는지 정하지 않으면 나중에 감정싸움이 됩니다.`,
      `동업은 서로 좋아서 하는 게 아니라 서로의 빈틈을 메워야 오래 갑니다. 돈 이야기를 불편해하면 시작부터 위험합니다.`
    ];
    const marriage=[
      `결혼 궁합은 설렘보다 생활 규칙입니다. ${rr.strategy} 생활비, 가족, 집안일, 휴일 사용 방식을 미리 정해야 합니다.`,
      `장기 관계로 보면 사랑보다 생활 체력이 중요합니다. 아침·밤 생활 리듬, 돈 쓰는 기준, 가족 개입 정도가 맞아야 합니다.`,
      `결혼까지 생각한다면 “좋아해?”보다 “같이 살면 덜 피곤해?”가 더 중요합니다. 대화가 안 되는 문제는 결혼 후 더 커집니다.`
    ];
    const dating=[
      `연인 궁합은 좋아하는 마음보다 반복 갈등 포인트를 아는 것이 핵심입니다. ${rr.strategy}`,
      `이 관계는 끌림만으로 판단하면 안 됩니다. 연락·돈·미래계획에서 같은 문제가 반복되는지 봐야 합니다.`,
      `좋을 때는 빠르게 가까워질 수 있지만, 싸울 때 회복 방식이 안 맞으면 오래 갈수록 지칩니다.`
    ];
    if(type==="친구")return pick(friend,seed);
    if(type==="동업/비즈니스")return pick(biz,seed);
    if(type==="배우자"||type==="결혼 고민")return pick(marriage,seed);
    if(type==="썸"||type==="재회 고민"||type==="연인")return pick(dating,seed);
    return pick(dating,seed);
  }
  function variableMatchCards(type, rr, seed){
    const marriageTitles={
      "연인":"오래 만날 때 진짜 문제",
      "썸":"사귀기 전 꼭 볼 것",
      "재회 고민":"다시 만나기 전 확인할 것",
      "배우자":"결혼 생활에서 터질 수 있는 문제",
      "결혼 고민":"결혼 전 체크포인트",
      "친구":"친구로 오래 가려면",
      "동업/비즈니스":"동업 전에 반드시 정할 것"
    };
    const title=marriageTitles[type]||"장기 관계에서 볼 것";
    const bodies=[
      `생활비, 집안일, 양가 가족, 휴일 사용 방식은 미리 이야기해야 합니다. 연애 때 넘긴 문제가 장기 관계에서는 커질 수 있습니다.`,
      `이 관계는 감정이 좋을 때보다 피곤할 때의 태도를 봐야 합니다. 지쳤을 때 말투가 거칠어지는지, 회피하는지, 책임지는지가 핵심입니다.`,
      `좋을 때의 케미보다 싸운 뒤 회복 속도가 중요합니다. 사과 방식, 연락 재개 방식, 돈 문제 대화 방식이 안 맞으면 같은 문제로 반복됩니다.`,
      `장기적으로는 “누가 더 좋아하냐”보다 “누가 더 안정적으로 행동하냐”가 중요합니다. 말보다 반복 행동이 답입니다.`,
      `이 관계에서 무서운 건 큰 사건보다 작은 서운함의 누적입니다. 그냥 넘긴 불편함이 나중에 관계의 결론이 될 수 있습니다.`
    ];
    const strategyBodies=[
      `${rr.strategy}\n감정 확인보다 생활 규칙을 정하세요. 연락, 돈, 가족, 미래 계획을 구체적으로 맞춰야 합니다.`,
      `${rr.strategy}\n싸우지 않는 관계가 좋은 관계가 아니라, 싸운 뒤 같은 문제를 줄이는 관계가 오래 갑니다.`,
      `${rr.strategy}\n상대가 바뀌길 기다리기보다 내가 어디까지 받아줄 수 있는지 선을 정해야 합니다.`,
      `${rr.strategy}\n좋아하는 마음으로 덮을 수 있는 문제와 절대 덮으면 안 되는 문제를 구분해야 합니다.`,
      `${rr.strategy}\n관계의 핵심은 감정이 아니라 운영입니다. 연락, 돈, 시간, 가족 이 네 가지를 맞춰야 합니다.`
    ];
    const easyBodies=[
      `이 궁합은 “왜 끌리는지”보다 “왜 싸우는지”를 아는 게 중요합니다. 싸움 포인트를 미리 정리하면 오래 갈 가능성이 좋아집니다.`,
      `이 관계는 마음이 없는 게 문제가 아니라 방식이 다른 게 문제입니다. 서로의 방식을 인정하면 좋아지고, 고치려 들면 지칩니다.`,
      `좋아하는 감정만으로는 부족합니다. 반복되는 서운함이 무엇인지 알아야 오래 갑니다.`,
      `처음의 끌림보다 나중의 안정감이 더 중요합니다. 만나고 난 뒤 마음이 편한지가 핵심입니다.`,
      `이 궁합은 잘 쓰면 서로를 키우지만, 방치하면 같은 문제로 계속 부딪힐 수 있습니다.`
    ];
    return {
      title,
      body:pick(bodies,seed,1),
      strategy:pick(strategyBodies,seed,2),
      easy:pick(easyBodies,seed,3)
    };
  }


  function sajuExplain(name,a){
    if(!a||!a.ok)return `${name}의 사주 정보가 부족합니다.`;
    const hl=highLow(a), hi=ELEM[hl.high], lo=ELEM[hl.low], st=STEM[a.dayStem]||["자기 흐름이 있는 타입","상황을 보며 움직입니다","기준이 필요합니다"];
    return `${name}의 사주는 ${a.pillars.map(x=>x.text).join(" · ")}입니다.
일간은 ${a.dayStem}(${a.dayElement})입니다. 쉽게 말해 ${st[0]}입니다. ${st[1]} 반대로 ${st[2]}
가장 강한 기운은 ${hl.high}(${hi.label})입니다. 그래서 ${hi.trait}이 잘 살아납니다.
가장 부족한 기운은 ${hl.low}(${lo.label})입니다. 이 부분이 흔들리면 ${lo.risk}
냉정하게 보면, ${hi.soreum} 그리고 ${lo.toxic}
구조는 ${a.strength.level}으로 보며, 보완 포인트는 ${a.yongsin.join(", ")}입니다.`;
  }

  function relationReason(myA, otherA, myName, otherName){
    if(!myA.ok||!otherA.ok)return {line:"상대 사주 정보가 부족해 궁합 근거를 충분히 볼 수 없습니다.", good:"상대 생년월일과 시간을 넣으면 더 구체적으로 볼 수 있습니다.", bad:"정보가 부족한 상태에서는 단정하지 않는 것이 안전합니다.", why:"상대 정보가 없으면 오행 관계를 비교할 수 없습니다.", strategy:"상대 정보를 추가해 다시 확인하세요."};
    const me=myA.dayElement, you=otherA.dayElement;
    const myHL=highLow(myA), youHL=highLow(otherA);
    if(SAJU.PRODUCES[me]===you){
      return {line:`${myName}의 ${me} 기운이 ${otherName}의 ${you} 기운을 살려주는 구조입니다.`, good:`${myName}이 ${otherName}을 챙기고 밀어주는 궁합입니다. 상대가 고마움을 표현하면 관계가 빠르게 좋아집니다.`, bad:`문제는 ${myName}만 계속 맞춰주는 느낌이 생길 수 있다는 점입니다. 한쪽만 주는 관계가 되면 서운함이 쌓입니다.`, why:`내 일간(${me})이 상대 일간(${you})을 생해주는 관계라 “내가 더 쓰는 관계”가 되기 쉽습니다.`, strategy:"도움과 배려를 당연하게 만들지 말고, 서로 고마움을 말로 확인해야 합니다."};
    }
    if(SAJU.PRODUCES[you]===me){
      return {line:`${otherName}의 ${you} 기운이 ${myName}의 ${me} 기운을 살려주는 구조입니다.`, good:`상대가 나에게 힘을 주는 궁합입니다. 내가 지칠 때 상대가 방향을 잡아주는 느낌이 생길 수 있습니다.`, bad:`다만 받기만 하면 균형이 깨집니다. 상대가 챙겨주는 것을 당연하게 여기면 관계가 식을 수 있습니다.`, why:`상대 일간(${you})이 내 일간(${me})을 생해주는 관계라 내가 기대거나 도움받는 흐름이 생깁니다.`, strategy:"상대에게 받는 만큼 인정과 표현을 돌려줘야 오래 갑니다."};
    }
    if(SAJU.CONTROLS[me]===you || SAJU.CONTROLS[you]===me){
      return {line:`두 사주는 오행상 서로 누르거나 자극하는 관계가 있습니다.`, good:"끌림은 강할 수 있습니다. 서로 다르기 때문에 처음에는 묘하게 신경 쓰이고 강하게 끌릴 수 있습니다.", bad:"하지만 주도권 싸움, 말투 싸움, 연락 문제, 돈 쓰는 방식에서 부딪히기 쉽습니다. 좋을 때는 뜨겁지만 싸우면 피곤한 궁합입니다.", why:`내 일간은 ${me}, 상대 일간은 ${you}입니다. 둘 사이에 극하는 흐름이 있어 서로를 바꾸려는 압박이 생길 수 있습니다.`, strategy:"감정으로 밀어붙이면 깨지고, 규칙을 정하면 살아납니다. 연락, 돈, 가족 이야기를 미리 해야 합니다."};
    }
    if(me===you){
      return {line:`두 사람의 일간 오행이 ${me}로 같습니다.`, good:"생각이 비슷하고 통하는 지점이 많습니다. 친구 같은 편안함이 생기기 쉽습니다.", bad:"비슷하기 때문에 둘 다 같은 지점에서 고집을 부릴 수 있습니다. 한 번 싸우면 둘 다 쉽게 안 물러설 수 있습니다.", why:`같은 오행은 공감은 빠르지만 충돌도 비슷한 방식으로 납니다. 서로 같은 버튼을 누르는 관계가 될 수 있습니다.`, strategy:"누가 맞냐를 따지기보다 역할을 나누는 방식이 좋습니다."};
    }
    return {line:`두 사주는 같은 방향은 아니지만 보완 가능성이 있는 구조입니다.`, good:"서로 다른 점을 잘 쓰면 역할 분담이 됩니다. 내가 약한 부분을 상대가 보고, 상대가 약한 부분을 내가 볼 수 있습니다.", bad:"다름을 고치려 들면 계속 싸웁니다. 서로의 방식을 인정하지 않으면 피로가 커집니다.", why:`내 강한 기운은 ${myHL.high}, 상대 강한 기운은 ${youHL.high}입니다. 강점이 다르기 때문에 역할 분담이 되지만, 기준이 없으면 서로 답답해집니다.`, strategy:"상대가 나와 다르다는 점을 문제로 보지 말고 역할로 나누는 것이 좋습니다."};
  }

  function hero(p,a,id,s,title){
    const hl=highLow(a), st=STEM[a.dayStem]||["자기 흐름이 있는 타입","상황을 보며 움직입니다","기준이 필요합니다"];
    const menuLine={
      life:`평생 흐름의 핵심은 ${ELEM[hl.high].label}을 장점으로 쓰고 ${ELEM[hl.low].label}을 보완하는 것입니다.`,
      year:`2026년은 기회가 늘지만, 애매한 사람과 일까지 같이 들어올 수 있는 해입니다.`,
      money:`재물운의 핵심은 버는 힘보다 돈이 새는 구멍을 막는 것입니다.`,
      career:`직업운의 핵심은 내가 잘하는 일을 남이 알아볼 수 있게 증거로 남기는 것입니다.`,
      love:`연애·결혼운의 핵심은 설렘보다 생활 기준과 행동 패턴을 보는 것입니다.`,
      match:`궁합의 핵심은 왜 끌리는지보다 왜 반복해서 부딪히는지를 먼저 보는 것입니다.`,
      friend:`친구 궁합의 핵심은 같이 있으면 편한지, 아니면 은근히 기가 빨리는지를 보는 것입니다.`,
      family:`가족운의 핵심은 사랑과 책임을 구분하는 것입니다.`,
      luck:`개운법의 핵심은 부족한 ${hl.low} 기운을 생활 습관으로 채우는 것입니다.`,
      risk:`리스크 관리의 핵심은 급한 결정과 감정적 지출을 줄이는 것입니다.`,
      total:`종합 흐름의 핵심은 돈·일·연애·가족을 한 번에 넓히지 않고 순서대로 정리하는 것입니다.`
    };
    return {
      html:`<div class="result-hero"><span class="result-kicker">${esc(title)} 핵심 요약</span><div class="result-topline">1. 결론: ${esc(menuLine[id]||menuLine.life)}<br>2. 기본 성향: ${esc(st[0])}. ${esc(st[1])}<br>3. 소름 포인트: ${esc(pick(SPICY,s))}</div><div class="result-meta">사주 8글자: ${esc(a.pillars.map(x=>x.text).join(" · "))}<br>기준 양력일: ${esc(a.solarDate||"-")}<br>일간: ${esc(a.dayStem)}(${esc(a.dayElement)}) / 구조: ${esc(a.strength.level)} / 보완 포인트: ${esc(a.yongsin.join(", "))}<br>계산 방식: ${esc(a.source)}${a.warnings&&a.warnings.length?`<br>참고: ${esc(a.warnings.join(" "))}`:""}</div></div>`,
      text:`[${title} 핵심 요약]\n1. 결론: ${menuLine[id]||menuLine.life}\n2. 기본 성향: ${st[0]}. ${st[1]}\n3. 소름 포인트: ${pick(SPICY,s)}`
    };
  }

  function report(id,p){
    const a=SAJU.analyze(p.me,p.manseMemo);
    if(!a.ok)return{title:"분석 불가",html:"생년월일을 입력해 주세요.",text:"생년월일을 입력해 주세요.",analysis:a};
    const title=(MENU.find(m=>m[0]===id)||MENU[0])[1];
    const s=seedOf(p,id,a), hl=highLow(a), hi=ELEM[hl.high], lo=ELEM[hl.low], n=p.me.name||"고객";
    const parts=[hero(p,a,id,s,title)];

    if(!["match","friend","family"].includes(id)){
      parts.push(card("🔍","내 사주 근거",sajuExplain(n,a)));
    }

    if(id==="life"){
      parts.push(card("🧬","십신으로 보는 인생 패턴",tenGodCardText(a)));
      parts.push(card("🌟","신살·길성 포인트",sinsalText(a)));
      parts.push(card("🔟","10년 흐름",tenYearFlow(a,s)));
      parts.push(card("🧭","평생 흐름",`${n}님의 전체 흐름은 ${hi.trait}을 잘 쓰는 방향으로 열립니다. ${MONTH[a.pillars[1].branch]||""}\n문제가 생길 때는 대체로 ${lo.risk}에서 시작됩니다.`));
      parts.push(card("🔥","소름 포인트",`${hi.soreum}\n${lo.toxic}\n겉으로는 괜찮아 보여도 안에서는 이미 계산과 판단이 많이 진행되는 구조입니다.`));
      parts.push(card("⚔️","왜 자꾸 같은 문제가 반복되는가",`사람을 챙기는 마음과 내 기준이 충돌할 때 반복 문제가 생깁니다. 좋게 넘어간 일이 나중에는 서운함으로 돌아올 수 있습니다.`));
      parts.push(card("📝","실천 전략",`이번 달에는 돈, 일, 사람 중 하나만 정리하세요. 특히 ${lo.luck}을 생활에 넣으면 균형이 좋아집니다.`));
      parts.push(easy(`${n}님은 운이 없는 게 아니라, 정리가 안 되면 좋은 운도 흩어지는 타입입니다. 지금은 사람·돈·일의 기준을 세우는 게 먼저입니다.`));
    } else if(id==="year"){
      parts.push(card("🗓️","2026년 세운 포인트",year2026Text(a)));
      parts.push(card("🗓️","2026년 전체 운",`2026년은 움직임과 제안이 늘 수 있는 흐름입니다. 다만 좋은 제안과 애매한 제안이 같이 들어올 수 있습니다.`));
      parts.push(card("💰","2026년 돈·일",`돈은 ${pick(POOLS.moneyGrow,s)}\n일은 ${hi.work} 쪽 흐름이 살아납니다. 보여주는 자료, 제안서, 결과물이 중요합니다.`));
      parts.push(card("❤️","2026년 연애·관계",`${pick(POOLS.love,s)}\n새 인연은 들어올 수 있지만, 애매한 관계는 빨리 정리하는 편이 좋습니다.`));
      parts.push(card("🔥","2026년 냉정한 경고",`${pick(SPICY,s,3)}\n2026년에 제일 조심할 것은 기회처럼 보이는 부담입니다. 말은 좋아도 내 시간과 돈을 잡아먹는 제안은 잘라내야 합니다.`));
      parts.push(easy(`2026년은 기회가 늘어나는 해입니다. 하지만 아무거나 잡으면 피곤해집니다. 좋은 사람, 좋은 일, 좋은 돈만 남기는 게 핵심입니다.`));
    } else if(id==="money"){
      parts.push(card("💰","정재·편재 구조",moneyGodText(a)));
      parts.push(card("💸","돈이 들어오는 방식",`${n}님은 ${hi.money} 방식으로 돈 흐름이 생기기 쉽습니다.\n한 번에 크게 잡는 돈보다 반복되는 수입 구조를 만드는 것이 중요합니다.`));
      parts.push(card("🧾","돈이 새는 습관",`${pick(POOLS.moneyLeak,s)}\n부족한 ${hl.low} 기운이 흔들리면 지출 판단이 흐려질 수 있습니다.`));
      parts.push(card("🔥","돈에 대한 냉정한 말",`돈복이 있어도 관리가 안 되면 남는 돈은 없습니다. 이 사주는 돈을 못 버는 게 문제가 아니라, 들어온 돈이 새는 구멍을 막는 게 먼저입니다.\n${pick(SPICY,s,2)}`));
      parts.push(card("🏦","돈을 키우는 방법",`${pick(POOLS.moneyGrow,s)}\n가격표, 정산일, 계약 조건을 명확히 하면 돈이 남기 시작합니다.`));
      parts.push(easy(`돈운은 있습니다. 하지만 “버는 운”보다 “남기는 습관”이 더 중요합니다. 이번 주에는 새는 돈부터 막으세요.`));
    } else if(id==="career"){
      parts.push(card("💼","관성·식상 구조",careerGodText(a)));
      parts.push(card("🧬","십신으로 보는 일머리",tenGodCardText(a)));
      parts.push(card("💼","일의 성향",`${n}님은 ${hi.work} 쪽에서 강점이 살아납니다.\n${pick(POOLS.career,s)}`));
      parts.push(card("🚀","직장형 vs 사업형",`${a.strength.level} 구조상 완전히 수동적인 일만 하면 답답할 수 있습니다. 내 판단과 책임이 있는 역할이 맞습니다.\n사업·부업은 크게 시작하기보다 작게 검증하는 방식이 안전합니다.`));
      parts.push(card("🔥","일에 대한 냉정한 말",`지금 제일 위험한 건 바쁘기만 하고 남는 게 없는 구조입니다. 성과가 문서, 포트폴리오, 매출, 계약으로 남지 않으면 운이 새는 일입니다.`));
      parts.push(card("🛠️","성공 방식",`성공하려면 결과물이 보여야 합니다. 말로만 잘하는 것이 아니라 문서, 이미지, 제안서, 포트폴리오처럼 남겨야 합니다.`));
      parts.push(easy(`직업운은 “내가 판단하고 결과를 만드는 일”에서 좋아집니다. 창업이나 부업은 작게 테스트하고 키우세요.`));
    } else if(id==="love"){
      parts.push(card("💍","배우자궁 해석",spousePalaceText(a)));
      parts.push(card("❤️","연애 스타일",`${n}님은 ${hi.love}를 중요하게 봅니다.\n${pick(POOLS.love,s)}`));
      parts.push(card("💍","결혼 기준",`결혼은 설렘보다 생활 방식이 맞아야 안정됩니다. 돈 관리, 가족 관계, 시간 사용이 맞지 않으면 좋아해도 피곤해집니다.`));
      parts.push(card("🔥","연애에 대한 냉정한 말",`설레게 하는 사람과 오래 갈 사람은 다를 수 있습니다. 이 사주는 애매한 사람에게 시간을 쓰면 마음이 먼저 닳습니다.\n${pick(SPICY,s,4)}`));
      parts.push(card("⚔️","왜 안 맞을 수 있는가",`문제는 안 맞춘다고 생기는 게 아니라 계속 맞춰주는 느낌이 생길 수 있다는 점입니다. 한쪽만 주는 관계가 되면 서운함이 쌓입니다.`));
      parts.push(easy(`연애는 설렘만 보면 안 됩니다. 오래 갈 사람은 연락, 돈, 생활 습관이 안정적인 사람입니다.`));
    } else if(id==="match"){
      const myA=a;
      const partnerName=p.partner.name||"상대";
      const partnerA=SAJU.analyze({birth:p.partner.birth,time:p.partner.time,calendar:"양력"},"");
      const rr=relationReason(myA,partnerA,n,partnerName);
      const relType=p.partner.type||"연인";
      const vc=variableMatchCards(relType,rr,s);
      parts.push(card("🔍","내 사주 근거",sajuExplain(n,myA)));
      parts.push(card("🔍","상대 사주 근거",partnerA.ok?sajuExplain(partnerName,partnerA):"상대 생년월일과 태어난 시간을 입력하면 상대 사주 근거가 표시됩니다."));
      parts.push(card("💞","왜 끌리는가",`${rr.line}\n${rr.good}\n${rr.why}`));
      parts.push(card("⚔️","왜 안 맞을 수 있는가",`${rr.bad}\n${pick(["좋아하는 마음만으로 이 부분을 덮으면 나중에 같은 문제로 반복해서 부딪힐 수 있습니다.","처음에는 매력으로 보이던 부분이 시간이 지나면 피로 포인트가 될 수 있습니다.","큰 사건보다 작은 말투, 돈 계산, 연락 방식에서 서운함이 쌓일 수 있습니다.","이 관계는 감정보다 운영 방식이 안 맞을 때 더 크게 흔들립니다.","상대가 나쁘다기보다 서로 예민해지는 지점이 다릅니다."],s,4)}`));
      parts.push(card("🎯",`${relType} 관계 기준`,relationTypeStrategy(relType,rr,s)));
      parts.push(card("🏠",vc.title,vc.body));
      parts.push(card("✅","관계 전략",vc.strategy));
      parts.push(easy(vc.easy));
    } else if(id==="friend"){
      const myA=a;
      const friendName=p.partner.name||"친구";
      const friendA=SAJU.analyze({birth:p.partner.birth,time:p.partner.time,calendar:"양력"},"");
      const rr=relationReason(myA,friendA,n,friendName);
      parts.push(card("🔍","내 사주 근거",sajuExplain(n,myA)));
      parts.push(card("🔍","친구 사주 근거",friendA.ok?sajuExplain(friendName,friendA):"친구 생년월일과 태어난 시간을 입력하면 친구 사주 근거가 표시됩니다."));
      parts.push(card("🤝","친구로 왜 잘 맞는가",`${rr.line}
${rr.good}
친구 궁합에서는 연애 감정보다 “같이 있을 때 편한가, 내 텐션이 살아나는가, 뒤끝이 적은가”가 더 중요합니다.`));
      parts.push(card("⚔️","왜 서운해질 수 있는가",`${rr.bad}
냉정하게 말하면 친구 사이에서 제일 위험한 건 큰 싸움이 아니라, 작은 서운함을 계속 쌓아두는 것입니다.`));
      parts.push(card("🔥","소름 포인트",`이 친구와는 서로에게 도움이 될 수 있지만, 한쪽만 계속 맞춰주면 관계가 기울어질 수 있습니다.
특히 약속 시간, 돈 계산, 말투, 연락 빈도에서 서운함이 생기면 오래 갑니다.
친구 사이는 연인보다 덜 예민해 보여도, 한 번 마음에서 정리되면 회복이 더 어려울 수 있습니다.`));
      parts.push(card("📏","가까이 둘 친구인가, 거리 둘 친구인가",`가까이 둬도 되는 친구는 내 에너지를 회복시켜주는 사람입니다. 반대로 만나고 나서 피곤함, 비교심, 찝찝함이 남는다면 거리를 둬야 합니다.
이 궁합은 서로의 차이를 인정하면 오래 가지만, 한쪽이 계속 맞추면 “좋은 친구”가 아니라 “감정 노동 관계”가 될 수 있습니다.`));
      parts.push(card("✅","친구 관계 전략",`${rr.strategy}
친구끼리는 오히려 선을 정해야 오래 갑니다. 돈거래, 부탁, 약속 변경, 사적인 고민 공유 범위를 분명히 하세요.`));
      parts.push(easy(`친구 궁합은 같이 웃는 것보다 만나고 난 뒤 내 마음이 편한지가 중요합니다. 이 친구가 나를 살리는지, 아니면 은근히 지치게 하는지 보면 답이 나옵니다.`));
    } else if(id==="family"){
      parts.push(card("🔍","내 사주 근거",sajuExplain(n,a)));
      const famLines=(p.families||[]).map(f=>{
        const fa=SAJU.analyze({birth:f.birth,time:f.time,calendar:"양력"},"");
        return sajuExplain(`${f.relation} ${f.name}`,fa);
      });
      parts.push(card("🔍","가족 사주 근거",famLines.length?famLines.join("\n\n"):"가족 정보를 넣으면 가족별 사주 근거가 표시됩니다."));
      parts.push(card("👨‍👩‍👧","가족 안에서의 역할",`${n}님은 가족 안에서 조율하거나 책임을 떠안는 역할이 되기 쉽습니다.`));
      parts.push(card("🔥","가족에 대한 냉정한 말",`가족이라고 해서 내가 전부 해결해야 하는 건 아닙니다. 착한 사람 역할을 오래 하면 결국 서운함이 폭발합니다.\n${pick(POOLS.family,s)}`));
      parts.push(card("🤝","해결 방법",`내가 할 수 있는 일과 없는 일을 나눠야 합니다. 부탁은 짧게, 기준은 정확하게 말하는 것이 좋습니다.`));
      parts.push(easy(`가족 문제는 혼자 다 해결하려고 하면 힘들어집니다. 역할을 나누고 부탁은 짧고 정확하게 말하세요.`));
    } else if(id==="luck"){
      parts.push(card("🌟","신살·길성 활용",sinsalText(a)));
      parts.push(card("🎨","필요한 기운",`${n}님은 ${hl.low}(${lo.label}) 기운을 보완하는 것이 좋습니다.`));
      parts.push(card("🧿","추천 컬러·아이템",`${lo.luck}\n이런 요소를 생활에 넣으면 부족한 기운을 현실적으로 보완하는 데 도움이 됩니다.`));
      parts.push(card("🔥","개운법에 대한 냉정한 말",`비싼 물건을 산다고 운이 바로 바뀌는 게 아닙니다. 이 사주에는 생활 리듬을 바꾸는 개운법이 더 현실적입니다.`));
      parts.push(card("🏃","오늘 할 행동",`방 한 구역 정리, 지출 확인, 20분 걷기, 미룬 연락 하나 처리, 내일 할 일 3개 적기 중 하나를 바로 하세요.`));
      parts.push(easy(`개운법은 거창한 게 아닙니다. 방 정리, 돈 기록, 걷기, 수면 회복처럼 생활을 정리하는 것이 진짜 도움이 됩니다.`));
    } else if(id==="risk"){
      parts.push(card("🧬","십신 리스크",tenGodCardText(a)));
      parts.push(card("🔟","10년 흐름에서 조심할 구간",tenYearFlow(a,s)));
      parts.push(card("🚨","가장 조심해야 할 것",`${pick(POOLS.risk,s)}\n특히 ${lo.risk}`));
      parts.push(card("💳","돈 리스크",`${pick(POOLS.moneyLeak,s)}\n큰돈보다 작은 반복 지출을 먼저 봐야 합니다.`));
      parts.push(card("🔥","냉정한 경고",`${pick(SPICY,s)}\n다만 이것은 겁주기 위한 말이 아니라, 미리 알고 피하라는 뜻입니다.`));
      parts.push(card("🧠","관계·건강 리스크",`모두에게 잘하려고 하면 결국 지칩니다. 수면 부족과 과로가 쌓이면 판단도 흐려질 수 있습니다.`));
      parts.push(easy(`가장 조심할 것은 급한 결정입니다. 기분이 흔들릴 때는 돈 쓰기, 연락하기, 계약하기를 하루 미루세요.`));
    } else {
      parts.push(card("📦","종합 결론",`${n}님은 돈, 일, 관계를 한꺼번에 넓히기보다 하나씩 정리할 때 운이 좋아집니다.`));
      parts.push(card("💰","돈",`돈은 ${hi.money} 쪽에서 흐름이 생기기 쉽습니다. 하지만 먼저 새는 돈을 막아야 합니다.`));
      parts.push(card("💼","일",`일은 ${hi.work} 쪽에서 강점이 살아납니다. 결과물을 보여주는 것이 중요합니다.`));
      parts.push(card("❤️","연애·가족",`연애는 생활 기준, 가족은 역할 분리가 중요합니다. 혼자 다 책임지지 않는 것이 좋습니다.`));
      parts.push(card("🔥","종합 냉정 포인트",`${pick(SPICY,s)}\n좋은 운도 관리하지 않으면 지나갑니다. 이 리포트의 핵심은 겁주기가 아니라 미리 정리하라는 뜻입니다.`));
      parts.push(easy(`지금 핵심은 정리입니다. 돈은 기록하고, 일은 하나에 집중하고, 사람은 기준을 세우면 전체 운이 좋아집니다.`));
    }

    const combined=combine(parts);
    return {title,html:combined.html,text:combined.text,analysis:a};
  }

  window.ENGINE={MENU,report,hasPartner,hasFamily,summary:SAJU.summary};
})();
