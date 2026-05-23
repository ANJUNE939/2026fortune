
/*
  Fortune Fate V9 Trust + Spicy Report Engine
  핵심 수정:
  1) 내 사주/상대 사주/가족 사주 해설 카드 추가
  2) 궁합에서 왜 맞는지/왜 안 맞는지 근거 카드 강화
  3) 한국인이 좋아하는 직설적·자극적 표현 추가
  4) 단정/공포/의학/투자 확정 표현은 피하고 참고용 자기이해 콘텐츠 톤 유지
*/
(function(){
  const MENU=[
    ["life","내 인생 전체 흐름","평생 흐름·전환점·반복 패턴","self"],
    ["year","2026년 운세","2026년 기회·리스크·월별 흐름","self"],
    ["money","재물·돈의 그릇","돈이 들어오는 방식과 새는 습관","self"],
    ["career","직업·사업 운","직장·사업·이직·창업 방향","self"],
    ["love","연애·결혼 운","연애 스타일·결혼 기준·맞는 사람","self"],
    ["match","궁합 분석","두 사람의 끌림과 갈등 포인트","partner"],
    ["family","가족 관계","가족 안에서의 역할과 갈등 해결","family"],
    ["luck","개운법","색상·습관·오늘 할 행동","self"],
    ["risk","조심해야 할 것","돈·관계·건강에서 주의할 점","self"],
    ["total","전체 종합 분석","돈·일·연애·가족을 한 번에","self"]
  ];

  const ELEM={
    목:{label:"성장·시작·배움·계획", trait:"새로운 것을 배우고 키우는 힘", money:"교육·기획·성장형 일·소개를 통한 확장", work:"기획, 교육, 콘텐츠, 브랜딩, 신규 프로젝트", love:"함께 성장하는 관계", risk:"계획만 많아지고 실행이 늦어질 수 있음", luck:"초록색, 산책, 식물, 새 노트, 아침 루틴", spicy:"머리로는 이미 답을 아는데 실행이 늦어 손해를 볼 수 있습니다."},
    화:{label:"표현·인기·홍보·열정", trait:"사람들 앞에서 드러나고 표현하는 힘", money:"홍보·영업·발표·노출을 통한 수입", work:"마케팅, 영업, 발표, 디자인, 영상, 행사", love:"표현과 확신이 있는 관계", risk:"감정이 과열되거나 말이 앞설 수 있음", luck:"핑크 포인트, 조명, 발표, 짧은 운동, 밝은 표정", spicy:"인기가 붙을 때는 빠르지만, 말 한마디로 판을 깰 수도 있습니다."},
    토:{label:"현실·책임·돈 관리·안정", trait:"현실을 붙잡고 책임지는 힘", money:"관리·장기 고객·반복 거래·안정형 수입", work:"운영, 관리, 회계, 매장, 조직 유지", love:"안정감과 책임감이 있는 관계", risk:"혼자 너무 많이 떠안거나 답답함을 참을 수 있음", luck:"베이지, 가계부, 집안 정리, 고정 루틴", spicy:"착한 사람 역할을 계속하면 결국 내가 제일 먼저 지칩니다."},
    금:{label:"정리·기준·판단·결과", trait:"기준을 세우고 결과를 만드는 힘", money:"계약·전문성·품질·정산이 명확한 수입", work:"검수, 행정, 분석, 품질관리, 전문직", love:"애매함보다 명확한 관계", risk:"차갑게 보이거나 완벽주의가 강해질 수 있음", luck:"화이트·실버, 체크리스트, 물건 비우기, 계약서 확인", spicy:"아닌 건 아닌 겁니다. 애매한 사람과 일에 시간을 쓰면 운이 샙니다."},
    수:{label:"생각·감정·회복·지혜", trait:"흐름을 읽고 깊게 생각하는 힘", money:"정보·상담·온라인·유통·연결형 수입", work:"전략, 데이터, 상담, 글쓰기, 온라인 운영", love:"편안한 대화와 깊은 감정 교류", risk:"걱정이 많아지고 결정을 미룰 수 있음", luck:"블랙, 물 마시기, 수면 회복, 기록, 조용한 공간", spicy:"생각이 너무 많아지면 기회가 와도 내가 스스로 문을 닫을 수 있습니다."}
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

  const P={
    lifeFocus:["인생의 큰 방향은 확장보다 정리에서 좋아집니다.","사람과 일을 동시에 넓히기보다 내 기준을 먼저 세워야 합니다.","전환점은 책임이 커질 때 찾아옵니다.","지금 가진 경험을 결과물로 바꿀 때 흐름이 좋아집니다."],
    yearFocus:["2026년은 움직임과 노출이 많아지는 해입니다.","2026년은 제안과 관계가 늘어나는 해입니다.","2026년은 준비한 것을 밖으로 보여줘야 하는 해입니다.","2026년은 돈과 관계가 같이 움직이는 해입니다."],
    moneyLeak:["기분 전환용 소비가 반복되면 돈이 새기 쉽습니다.","사람 때문에 쓰는 돈과 필요한 돈을 구분해야 합니다.","작은 구독, 배달, 즉흥 구매가 모이면 큰 지출이 됩니다.","새로운 일을 시작할 때 준비 비용이 커질 수 있습니다."],
    moneyGrow:["고정비를 줄이고 매주 지출을 확인하면 바로 효과가 납니다.","수입이 들어오면 생활비, 저축, 비상금으로 바로 나누세요.","반복 수입을 하나라도 만들면 돈 흐름이 안정됩니다.","계약, 정산, 가격표를 명확히 하면 돈운이 좋아집니다."],
    careerWay:["스스로 판단하고 움직이는 일에서 강점이 나옵니다.","사람과 정보를 연결할 때 성과가 납니다.","경험을 정리해 보여줄 때 일이 풀립니다.","혼자 열심히 하는 것보다 시스템을 만드는 것이 중요합니다."],
    loveWay:["말보다 반복되는 행동을 봐야 합니다.","생활 습관이 맞는 사람이 오래 갑니다.","연락과 태도가 일정한 사람이 안정적입니다.","설렘보다 신뢰가 오래 갑니다."],
    familyWay:["가족 문제는 기대 차이에서 시작되는 경우가 많습니다.","내 역할과 가족의 역할을 나눠야 피로가 줄어듭니다.","돈 문제와 감정 문제를 분리해야 합니다.","짧고 정확하게 부탁하는 것이 좋습니다."],
    riskWay:["급한 결정이 가장 큰 리스크입니다.","지친 상태에서 돈과 관계를 결정하면 손해가 생깁니다.","모두에게 잘하려고 하면 결국 지칩니다.","계약과 약속은 글로 남기는 것이 안전합니다."],
    spicy:["좋게 말하면 가능성이 많고, 냉정하게 말하면 정리가 안 되면 다 놓칠 수 있습니다.","운이 안 좋은 게 아니라, 기준 없이 끌려다니면 운이 새는 구조입니다.","이 사주는 사람을 잘못 고르면 돈보다 멘탈이 먼저 털립니다.","지금 필요한 건 위로가 아니라 정리입니다.","애매한 사람, 애매한 일, 애매한 돈이 제일 위험합니다."],
    easy:["한 번에 다 해결하려 하지 말고 하나씩 정리하면 운이 좋아집니다.","지금은 새로운 걸 더 늘리기보다 돈, 일, 사람을 정리하는 게 먼저입니다.","운이 없는 게 아니라 흩어지면 약해지는 타입입니다. 하나로 모으면 좋아집니다.","기록하고 정리하면 생각보다 빠르게 흐름이 달라집니다."]
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

  function sajuExplain(name,a,role){
    if(!a||!a.ok)return `${role} 사주 정보가 부족합니다.`;
    const hl=highLow(a), hi=ELEM[hl.high], lo=ELEM[hl.low], st=STEM[a.dayStem]||["자기 흐름이 있는 타입","상황을 보며 움직입니다","기준이 필요합니다"];
    return `${name}의 사주는 ${a.pillars.map(x=>x.text).join(" · ")}입니다.\n일간은 ${a.dayStem}(${a.dayElement})이고, 기본 성향은 “${st[0]}”입니다. ${st[1]} 반대로 ${st[2]}\n가장 강한 기운은 ${hl.high}(${hi.label})입니다. 그래서 ${hi.trait}이 잘 살아납니다.\n가장 부족한 기운은 ${hl.low}(${lo.label})입니다. 이 부분이 흔들리면 ${lo.risk}\n구조는 ${a.strength.level}으로 보며, 보완 포인트는 ${a.yongsin.join(", ")}입니다.`;
  }

  function relationReason(myA, otherA, myName, otherName){
    if(!myA.ok||!otherA.ok)return {line:"상대 사주 정보가 부족해 궁합 근거를 충분히 볼 수 없습니다.", good:"상대 생년월일과 시간을 넣으면 더 구체적으로 볼 수 있습니다.", risk:"정보가 부족한 상태에서는 단정하지 않는 것이 안전합니다.", strategy:"상대 정보를 추가해 다시 확인하세요."};
    const me=myA.dayElement, you=otherA.dayElement;
    if(SAJU.PRODUCES[me]===you){
      return {line:`${myName}의 ${me} 기운이 ${otherName}의 ${you} 기운을 살려주는 구조입니다.`, good:`${myName}이 ${otherName}을 챙기고 밀어주는 궁합으로 보입니다. 상대가 고마움을 표현하면 관계가 좋아집니다.`, risk:`문제는 ${myName}만 계속 맞춰주는 느낌이 생길 수 있다는 점입니다. 한쪽만 주는 관계가 되면 서운함이 쌓입니다.`, strategy:"도움과 배려를 당연하게 만들지 말고, 서로 고마움을 말로 확인해야 합니다."};
    }
    if(SAJU.PRODUCES[you]===me){
      return {line:`${otherName}의 ${you} 기운이 ${myName}의 ${me} 기운을 살려주는 구조입니다.`, good:`상대가 나에게 힘을 주는 궁합입니다. 내가 지칠 때 상대가 방향을 잡아주는 느낌이 생길 수 있습니다.`, risk:`다만 받기만 하면 균형이 깨집니다. 상대가 챙겨주는 것을 당연하게 여기면 관계가 식을 수 있습니다.`, strategy:"상대에게 받는 만큼 인정과 표현을 돌려줘야 오래 갑니다."};
    }
    if(SAJU.CONTROLS[me]===you || SAJU.CONTROLS[you]===me){
      return {line:`두 사주는 오행상 서로 누르거나 자극하는 관계가 있습니다.`, good:"끌림은 강할 수 있습니다. 서로 다르기 때문에 처음에는 묘하게 신경 쓰이고 강하게 끌릴 수 있습니다.", risk:"하지만 주도권 싸움, 말투 싸움, 연락 문제, 돈 쓰는 방식에서 부딪히기 쉽습니다. 좋을 때는 뜨겁지만 싸우면 피곤한 궁합입니다.", strategy:"감정으로 밀어붙이면 깨지고, 규칙을 정하면 살아납니다. 연락, 돈, 가족 이야기를 미리 해야 합니다."};
    }
    if(me===you){
      return {line:`두 사람의 일간 오행이 ${me}로 같습니다.`, good:"생각이 비슷하고 통하는 지점이 많습니다. 친구 같은 편안함이 생기기 쉽습니다.", risk:"비슷하기 때문에 둘 다 같은 지점에서 고집을 부릴 수 있습니다. 한 번 싸우면 둘 다 쉽게 안 물러설 수 있습니다.", strategy:"누가 맞냐를 따지기보다 역할을 나누는 방식이 좋습니다."};
    }
    return {line:`두 사주는 같은 방향은 아니지만 보완 가능성이 있는 구조입니다.`, good:"서로 다른 점을 잘 쓰면 역할 분담이 됩니다. 내가 약한 부분을 상대가 보고, 상대가 약한 부분을 내가 볼 수 있습니다.", risk:"다름을 고치려 들면 계속 싸웁니다. 서로의 방식을 인정하지 않으면 피로가 커집니다.", strategy:"상대가 나와 다르다는 점을 문제로 보지 말고 역할로 나누는 것이 좋습니다."};
  }

  function hero(p,a,id,s,title){
    const hl=highLow(a), st=STEM[a.dayStem]||["자기 흐름이 있는 타입","상황을 보며 움직입니다","기준이 필요합니다"];
    const byMenu={
      life:`평생 흐름의 핵심은 ${ELEM[hl.high].label}을 장점으로 쓰고 ${ELEM[hl.low].label}을 보완하는 것입니다.`,
      year:`2026년의 핵심은 기회가 늘어날 때 돈·일정·관계를 차분히 관리하는 것입니다.`,
      money:`재물운의 핵심은 버는 힘보다 남기는 구조를 먼저 만드는 것입니다.`,
      career:`직업운의 핵심은 내가 잘하는 일을 남이 알아볼 수 있게 구조화하는 것입니다.`,
      love:`연애·결혼운의 핵심은 설렘보다 생활 기준과 신뢰를 보는 것입니다.`,
      match:`궁합의 핵심은 두 사주가 왜 끌리고 왜 부딪히는지 근거를 보는 것입니다.`,
      family:`가족운의 핵심은 가족 사주별 역할을 보고 혼자 책임지지 않는 것입니다.`,
      luck:`개운법의 핵심은 부족한 ${hl.low} 기운을 생활 습관으로 채우는 것입니다.`,
      risk:`리스크 관리의 핵심은 급한 결정과 감정적 지출을 줄이는 것입니다.`,
      total:`종합 흐름의 핵심은 돈·일·연애·가족을 한 번에 넓히지 않고 순서대로 정리하는 것입니다.`
    };
    return {
      html:`<div class="result-hero"><span class="result-kicker">${esc(title)} 핵심 요약</span><div class="result-topline">1. 결론: ${esc(byMenu[id]||byMenu.life)}<br>2. 기본 성향: ${esc(st[0])}. ${esc(st[1])}<br>3. 냉정한 한마디: ${esc(pick(P.spicy,s))}</div><div class="result-meta">사주 8글자: ${esc(a.pillars.map(x=>x.text).join(" · "))}<br>기준 양력일: ${esc(a.solarDate||"-")}<br>일간: ${esc(a.dayStem)}(${esc(a.dayElement)}) / 구조: ${esc(a.strength.level)} / 보완 포인트: ${esc(a.yongsin.join(", "))}<br>계산 방식: ${esc(a.source)}${a.warnings&&a.warnings.length?`<br>참고: ${esc(a.warnings.join(" "))}`:""}</div></div>`,
      text:`[${title} 핵심 요약]\n1. 결론: ${byMenu[id]||byMenu.life}\n2. 기본 성향: ${st[0]}. ${st[1]}\n3. 냉정한 한마디: ${pick(P.spicy,s)}\n사주 8글자: ${a.pillars.map(x=>x.text).join(" · ")} / 일간: ${a.dayStem}(${a.dayElement})`
    };
  }

  function report(id,p){
    const a=SAJU.analyze(p.me,p.manseMemo);
    if(!a.ok)return{title:"분석 불가",html:"생년월일을 입력해 주세요.",text:"생년월일을 입력해 주세요.",analysis:a};

    const title=(MENU.find(m=>m[0]===id)||MENU[0])[1];
    const s=seedOf(p,id,a), hl=highLow(a), hi=ELEM[hl.high], lo=ELEM[hl.low], n=p.me.name||"고객";
    const parts=[hero(p,a,id,s,title)];

    // 신뢰도 보강: 모든 자기 분석 메뉴에 "내 사주 근거" 카드 추가
    if(!["match","family"].includes(id)){
      parts.push(card("🔍","내 사주 근거",sajuExplain(n,a,"내")));
    }

    if(id==="life"){
      parts.push(card("🧭","평생 흐름",`${n}님의 전체 흐름은 ${hi.trait}을 잘 쓰는 방향으로 열립니다. ${MONTH[a.pillars[1].branch]||""}\n인생이 막힐 때는 보통 ${lo.risk}에서 시작됩니다.`));
      parts.push(card("🔥","냉정한 포인트",`${pick(P.spicy,s)}\n좋게만 보면 기회가 많지만, 현실적으로는 기준 없이 움직이면 사람이든 돈이든 빠져나가기 쉽습니다.`));
      parts.push(card("🚪","전환점",`전환점은 책임이 커지거나 관계 구도가 바뀔 때 옵니다. 이때 모든 사람을 챙기려 하지 말고 내 역할을 정해야 합니다.`));
      parts.push(card("📝","실천 전략",`이번 달에는 돈, 일, 사람 중 하나만 정리하세요. 특히 ${lo.luck}을 생활에 넣으면 균형이 좋아집니다.`));
      parts.push(easy(`${n}님의 인생 흐름은 꾸준히 쌓을 때 좋아집니다. 새로 벌리기보다 기준을 정리하면 운이 편해집니다.`));
    } else if(id==="year"){
      parts.push(card("🗓️","2026년 전체 운",`${pick(P.yearFocus,s)}\n2026년에는 움직임과 제안이 늘 수 있지만, 준비 없이 확장하면 지칠 수 있습니다.`));
      parts.push(card("💰","2026년 돈·일",`돈은 ${pick(P.moneyGrow,s)}\n일은 ${hi.work} 쪽 흐름이 살아납니다. 보여주는 자료, 제안서, 결과물이 중요합니다.`));
      parts.push(card("❤️","2026년 연애·관계",`${pick(P.loveWay,s)}\n새 인연은 들어올 수 있지만 애매한 관계는 빨리 정리하는 편이 좋습니다.`));
      parts.push(card("⚠️","2026년 조심할 것",`${pick(P.spicy,s,2)}\n이 해에는 좋은 제안도 들어오지만, 애매한 제안도 같이 들어올 수 있습니다. 말만 좋은 사람을 조심해야 합니다.`));
      parts.push(easy(`2026년은 기회가 늘어나는 해입니다. 다만 급하면 손해이니 돈, 일정, 사람을 차분히 관리하세요.`));
    } else if(id==="money"){
      parts.push(card("💸","돈이 들어오는 방식",`${n}님은 ${hi.money} 방식으로 돈 흐름이 생기기 쉽습니다.\n한 번에 크게 잡는 돈보다 반복되는 수입 구조를 만드는 것이 중요합니다.`));
      parts.push(card("🧾","돈이 새는 습관",`${pick(P.moneyLeak,s)}\n부족한 ${hl.low} 기운이 흔들리면 지출 판단이 흐려질 수 있습니다.`));
      parts.push(card("🔥","돈에 대한 냉정한 말",`돈복이 있어도 관리가 안 되면 남는 돈은 없습니다. 특히 ${pick(P.moneyLeak,s,3)}\n이 사주는 돈을 못 버는 게 문제가 아니라, 돈이 들어와도 새는 구멍을 막는 게 먼저입니다.`));
      parts.push(card("🏦","돈을 키우는 방법",`${pick(P.moneyGrow,s)}\n가격표, 정산일, 계약 조건을 명확히 하면 돈이 남기 시작합니다.`));
      parts.push(easy(`재물운은 있습니다. 하지만 핵심은 버는 것보다 남기는 것입니다. 이번 주에는 새는 돈부터 막으세요.`));
    } else if(id==="career"){
      parts.push(card("💼","일의 성향",`${n}님은 ${hi.work} 쪽에서 강점이 살아납니다.\n${pick(P.careerWay,s)}`));
      parts.push(card("🚀","직장형 vs 사업형",`${a.strength.level} 구조상 완전히 수동적인 일만 하면 답답할 수 있습니다. 내 판단과 책임이 있는 역할이 맞습니다.\n사업·부업은 크게 시작하기보다 작게 검증하는 방식이 안전합니다.`));
      parts.push(card("🔥","일에 대한 냉정한 말",`지금 제일 위험한 건 바쁘기만 하고 남는 게 없는 구조입니다. 성과가 문서, 포트폴리오, 매출, 계약으로 남지 않으면 운이 새는 일입니다.`));
      parts.push(card("🛠️","성공 방식",`성공하려면 결과물이 보여야 합니다. 말로만 잘하는 것이 아니라 문서, 이미지, 제안서, 포트폴리오처럼 남겨야 합니다.`));
      parts.push(easy(`직업운은 “내가 판단하고 결과를 만드는 일”에서 좋아집니다. 창업이나 부업은 작게 테스트하고 키우세요.`));
    } else if(id==="love"){
      parts.push(card("❤️","연애 스타일",`${n}님은 ${hi.love}를 중요하게 봅니다.\n${pick(P.loveWay,s)}`));
      parts.push(card("💍","결혼 기준",`결혼은 설렘보다 생활 방식이 맞아야 안정됩니다. 돈 관리, 가족 관계, 시간 사용이 맞지 않으면 좋아해도 피곤해집니다.`));
      parts.push(card("🔥","연애에 대한 냉정한 말",`설레게 하는 사람과 오래 갈 사람은 다를 수 있습니다. 이 사주는 애매한 사람에게 시간을 쓰면 마음이 먼저 닳습니다.`));
      parts.push(card("👫","잘 맞는 사람",`말보다 행동이 일정한 사람, 책임감 있는 사람, 돈과 생활 습관이 안정된 사람이 잘 맞습니다.`));
      parts.push(easy(`연애는 설렘만 보면 안 됩니다. 오래 갈 사람은 연락, 돈, 생활 습관이 안정적인 사람입니다.`));
    } else if(id==="match"){
      const myA=a;
      const partnerA=SAJU.analyze({birth:p.partner.birth,time:p.partner.time,calendar:"양력"},"");
      const partnerName=p.partner.name||"상대";
      const rr=relationReason(myA,partnerA,n,partnerName);
      parts.push(card("🔍","내 사주 근거",sajuExplain(n,myA,"내")));
      parts.push(card("🔍","상대 사주 근거",partnerA.ok?sajuExplain(partnerName,partnerA,"상대"):"상대 생년월일과 태어난 시간을 입력하면 상대 사주 근거가 표시됩니다."));
      parts.push(card("💞","왜 끌리는가",`${rr.line}\n${rr.good}`));
      parts.push(card("⚔️","왜 안 맞을 수 있는가",`${rr.risk}\n냉정하게 말하면, 좋아하는 마음만으로 이 부분을 덮으면 나중에 같은 문제로 반복해서 부딪힐 수 있습니다.`));
      parts.push(card("🏠","결혼까지 볼 때",`생활비, 집안일, 양가 가족, 휴일 사용 방식은 미리 이야기해야 합니다. 연애 때 넘긴 문제가 결혼 후에는 커질 수 있습니다.`));
      parts.push(card("✅","관계 전략",`${rr.strategy}\n감정 확인보다 생활 규칙을 정하세요. 연락, 돈, 가족, 미래 계획을 구체적으로 맞춰야 합니다.`));
      parts.push(easy(`이 궁합은 “왜 끌리는지”보다 “왜 싸우는지”를 아는 게 중요합니다. 싸움 포인트를 미리 정리하면 오래 갈 가능성이 좋아집니다.`));
    } else if(id==="family"){
      parts.push(card("🔍","내 사주 근거",sajuExplain(n,a,"내")));
      const famLines=(p.families||[]).map((f,idx)=>{
        const fa=SAJU.analyze({birth:f.birth,time:f.time,calendar:"양력"},"");
        return sajuExplain(`${f.relation} ${f.name}`,fa,"가족");
      });
      parts.push(card("🔍","가족 사주 근거",famLines.length?famLines.join("\n\n"):"가족 정보를 넣으면 가족별 사주 근거가 표시됩니다."));
      parts.push(card("👨‍👩‍👧","가족 안에서의 역할",`${n}님은 가족 안에서 조율하거나 책임을 떠안는 역할이 되기 쉽습니다.`));
      parts.push(card("⚠️","갈등이 생기는 이유",`${pick(P.familyWay,s)}\n가족은 가까워서 말이 더 쉽게 상처가 됩니다.`));
      parts.push(card("🔥","가족에 대한 냉정한 말",`가족이라고 해서 내가 전부 해결해야 하는 건 아닙니다. 착한 사람 역할을 오래 하면 결국 서운함이 폭발합니다.`));
      parts.push(card("🤝","해결 방법",`내가 할 수 있는 일과 없는 일을 나눠야 합니다. 부탁은 짧게, 기준은 정확하게 말하는 것이 좋습니다.`));
      parts.push(easy(`가족 문제는 혼자 다 해결하려고 하면 힘들어집니다. 역할을 나누고 부탁은 짧고 정확하게 말하세요.`));
    } else if(id==="luck"){
      parts.push(card("🎨","필요한 기운",`${n}님은 ${hl.low}(${lo.label}) 기운을 보완하는 것이 좋습니다.`));
      parts.push(card("🧿","추천 컬러·아이템",`${lo.luck}\n이런 요소를 생활에 넣으면 부족한 기운을 현실적으로 보완하는 데 도움이 됩니다.`));
      parts.push(card("🔥","개운법에 대한 냉정한 말",`비싼 물건을 산다고 운이 바로 바뀌는 게 아닙니다. 이 사주에는 생활 리듬을 바꾸는 개운법이 더 현실적입니다.`));
      parts.push(card("🏃","오늘 할 행동",`방 한 구역 정리, 지출 확인, 20분 걷기, 미룬 연락 하나 처리, 내일 할 일 3개 적기 중 하나를 바로 하세요.`));
      parts.push(easy(`개운법은 거창한 게 아닙니다. 방 정리, 돈 기록, 걷기, 수면 회복처럼 생활을 정리하는 것이 진짜 도움이 됩니다.`));
    } else if(id==="risk"){
      parts.push(card("🚨","가장 조심해야 할 것",`${pick(P.riskWay,s)}\n특히 ${lo.risk}`));
      parts.push(card("💳","돈 리스크",`${pick(P.moneyLeak,s)}\n큰돈보다 작은 반복 지출을 먼저 봐야 합니다.`));
      parts.push(card("🔥","냉정한 경고",`${pick(P.spicy,s)}\n다만 이것은 겁주기 위한 말이 아니라, 미리 알고 피하라는 뜻입니다.`));
      parts.push(card("🧠","관계·건강 리스크",`모두에게 잘하려고 하면 결국 지칩니다. 수면 부족과 과로가 쌓이면 판단도 흐려질 수 있습니다.`));
      parts.push(card("🛡️","방어 전략",`중요한 결정은 하루 미루고, 계약과 약속은 글로 남기세요. 감정이 흔들릴수록 새로 벌이기보다 지키는 전략이 좋습니다.`));
      parts.push(easy(`가장 조심할 것은 급한 결정입니다. 기분이 흔들릴 때는 돈 쓰기, 연락하기, 계약하기를 하루 미루세요.`));
    } else {
      parts.push(card("📦","종합 결론",`${n}님은 돈, 일, 관계를 한꺼번에 넓히기보다 하나씩 정리할 때 운이 좋아집니다.`));
      parts.push(card("💰","돈",`돈은 ${hi.money} 쪽에서 흐름이 생기기 쉽습니다. 하지만 먼저 새는 돈을 막아야 합니다.`));
      parts.push(card("💼","일",`일은 ${hi.work} 쪽에서 강점이 살아납니다. 결과물을 보여주는 것이 중요합니다.`));
      parts.push(card("❤️","연애·가족",`연애는 생활 기준, 가족은 역할 분리가 중요합니다. 혼자 다 책임지지 않는 것이 좋습니다.`));
      parts.push(card("🔥","종합 냉정 포인트",`${pick(P.spicy,s)}\n좋은 운도 관리하지 않으면 지나갑니다. 이 리포트의 핵심은 겁주기가 아니라 미리 정리하라는 뜻입니다.`));
      parts.push(easy(`지금 핵심은 정리입니다. 돈은 기록하고, 일은 하나에 집중하고, 사람은 기준을 세우면 전체 운이 좋아집니다.`));
    }

    const combined=combine(parts);
    return {title,html:combined.html,text:combined.text,analysis:a};
  }

  window.ENGINE={MENU,report,hasPartner,hasFamily,summary:SAJU.summary};
})();
