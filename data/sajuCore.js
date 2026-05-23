/*
  Fortune Fate V7 Calendar Core
  - 양력 사주 8글자 계산
  - 음력 -> 양력 변환 테이블 내장(1900~2049)
  - 24절기 근사 시각 기반 월주/연주 경계 계산
  - KST 기준 비교
  주의: 브라우저 오프라인용 내장 역법입니다. 실제 유료 감정에서는 외부 만세력과 교차 검증을 권장합니다.
*/
(function(){
  const STEMS=["갑","을","병","정","무","기","경","신","임","계"];
  const BRANCHES=["자","축","인","묘","진","사","오","미","신","유","술","해"];
  const STEM_ELEM=["목","목","화","화","토","토","금","금","수","수"];
  const BRANCH_ELEM=["수","토","목","목","토","화","화","토","금","금","토","수"];
  const PRODUCES={목:"화",화:"토",토:"금",금:"수",수:"목"};
  const CONTROLS={목:"토",토:"수",수:"화",화:"금",금:"목"};
  const PRODUCED_BY={화:"목",토:"화",금:"토",수:"금",목:"수"};
  const CONTROLLED_BY={토:"목",수:"토",화:"수",금:"화",목:"금"};

  // 1900~2049 lunar data. Common lunisolar table used in offline calendars.
  const LUNAR_INFO=[
    0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
    0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
    0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
    0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
    0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
    0x06ca0,0x0b550,0x15355,0x04da0,0x0a5d0,0x14573,0x052d0,0x0a9a8,0x0e950,0x06aa0,
    0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
    0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
    0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
    0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
    0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
    0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
    0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
    0x05aa0,0x076a3,0x096d0,0x04bd7,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
    0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0
  ];

  // 24절기 minute offset table from 1900-01-06 02:05 UTC style formula.
  const TERM_NAMES=["소한","대한","입춘","우수","경칩","춘분","청명","곡우","입하","소만","망종","하지","소서","대서","입추","처서","백로","추분","한로","상강","입동","소설","대설","동지"];
  const S_TERM_INFO=[0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
  const MONTH_BOUNDARY_TERMS=[2,4,6,8,10,12,14,16,18,20,22,0]; // 입춘~소한
  const MONTH_BRANCH_INDEX=[2,3,4,5,6,7,8,9,10,11,0,1]; // 인월~축월

  function pad(n){return String(n).padStart(2,"0")}
  function toDateParts(date){
    return {y:date.getFullYear(),m:date.getMonth()+1,d:date.getDate(),hh:date.getHours(),mm:date.getMinutes()};
  }
  function parseSolar(dateStr,timeStr){
    if(!dateStr)return null;
    const [y,m,d]=dateStr.split("-").map(Number);
    let hh=12,mm=0;
    if(timeStr&&timeStr.includes(":")){const t=timeStr.split(":").map(Number);hh=t[0];mm=t[1]||0;}
    return new Date(y,m-1,d,hh,mm,0,0); // local browser timezone; for Korea deployment this is KST. Date comparisons are internally consistent.
  }
  function julianDay(y,m,d){
    if(m<=2){y-=1;m+=12}
    const A=Math.floor(y/100),B=2-A+Math.floor(A/4);
    return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5;
  }
  function pillarBy(si,bi){for(let i=0;i<60;i++)if(i%10===si&&i%12===bi)return pillar(i);return pillar(0)}
  function pillar(idx){
    idx=((idx%60)+60)%60;
    const si=idx%10,bi=idx%12;
    return {index:idx,text:STEMS[si]+BRANCHES[bi],stem:STEMS[si],branch:BRANCHES[bi],si,bi,se:STEM_ELEM[si],be:BRANCH_ELEM[bi]};
  }

  function lunarYearDays(y){
    let sum=348;
    const info=LUNAR_INFO[y-1900];
    for(let i=0x8000;i>0x8;i>>=1) sum += (info&i)?1:0;
    return sum + leapDays(y);
  }
  function leapMonth(y){return LUNAR_INFO[y-1900]&0xf}
  function leapDays(y){return leapMonth(y)?((LUNAR_INFO[y-1900]&0x10000)?30:29):0}
  function monthDays(y,m){return (LUNAR_INFO[y-1900]&(0x10000>>m))?30:29}
  function lunarToSolar(y,m,d,isLeap){
    if(y<1900||y>2049)return null;
    let offset=0;
    for(let i=1900;i<y;i++) offset+=lunarYearDays(i);
    const leap=leapMonth(y);
    for(let i=1;i<m;i++){
      offset+=monthDays(y,i);
      if(i===leap) offset+=leapDays(y);
    }
    if(isLeap&&leap===m) offset+=monthDays(y,m);
    offset += d-1;
    const base=new Date(1900,0,31,0,0,0,0);
    base.setDate(base.getDate()+offset);
    return base;
  }

  function solarTermDate(year,termIndex){
    // returns local Date around KST-compatible day. Formula is approximate but term boundary is much closer than fixed-day method.
    const ms=31556925974.7*(year-1900)+S_TERM_INFO[termIndex]*60000+Date.UTC(1900,0,6,2,5);
    return new Date(ms);
  }
  function termLocalDate(year,termIndex){
    const d=solarTermDate(year,termIndex);
    // Use local date object. Deployed in Korea, this resolves KST; still internally consistent elsewhere.
    return new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),0,0);
  }
  function getIpchun(year){return termLocalDate(year,2)}
  function yearPillar(date){
    const ip=getIpchun(date.getFullYear());
    const y = date < ip ? date.getFullYear()-1 : date.getFullYear();
    return pillar((y-1984)%60);
  }
  function monthNumber(date){
    const y=date.getFullYear();
    const boundaries=[];
    // previous year's 소한 for early January and all current boundaries
    boundaries.push({num:12,date:termLocalDate(y,0),name:"소한"});
    for(let i=0;i<11;i++){
      boundaries.push({num:i+1,date:termLocalDate(y,MONTH_BOUNDARY_TERMS[i]),name:TERM_NAMES[MONTH_BOUNDARY_TERMS[i]]});
    }
    // if before current 소한, treat as previous 대설 month
    let current=12;
    for(const b of boundaries){
      if(date>=b.date) current=b.num;
    }
    // special: Jan before 소한 belongs to previous 자월/대설, but for practical month pillar use 축월 until 입춘? 
    // 명리 월주는 소한 이후 축월, 대설~소한 자월. We return 11 for before 소한 in Jan.
    if(date < termLocalDate(y,0)) current=11;
    return current; // 1=인월 ... 12=축월, 11=자월 before 소한
  }
  function monthPillar(date,yp){
    const num=monthNumber(date);
    const yStem=yp.si;
    const startStem=[2,4,6,8,0][yStem%5]; // 갑기 병인, 을경 무인...
    const stemIndex=(startStem+(num-1))%10;
    const branchIndex=MONTH_BRANCH_INDEX[num-1];
    return pillarBy(stemIndex,branchIndex);
  }
  function dayPillar(date){
    // 1984-02-02 as 갑자 day reference. Date-only local comparison.
    const diff=Math.floor(julianDay(date.getFullYear(),date.getMonth()+1,date.getDate())-julianDay(1984,2,2));
    return pillar(diff%60);
  }
  function hourBranch(hh){
    if(hh===23||hh===0)return 0;
    if(hh<3)return 1;if(hh<5)return 2;if(hh<7)return 3;if(hh<9)return 4;if(hh<11)return 5;
    if(hh<13)return 6;if(hh<15)return 7;if(hh<17)return 8;if(hh<19)return 9;if(hh<21)return 10;return 11;
  }
  function hourPillar(date,dp){
    const b=hourBranch(date.getHours());
    const start=[0,2,4,6,8][dp.si%5]; // 갑기 갑자...
    return pillarBy((start+b)%10,b);
  }
  function counts(ps){
    const c={목:0,화:0,토:0,금:0,수:0};
    ps.forEach(p=>{c[p.se]+=1.1;c[p.be]+=1});
    return c;
  }
  function strength(ps){
    const c=counts(ps),de=ps[2].se;
    let s=c[de]*1.2+c[PRODUCED_BY[de]]*.9-c[PRODUCES[de]]*.4-c[CONTROLS[de]]*.6-c[CONTROLLED_BY[de]]*.55;
    if(ps[1].be===de)s+=1.2;
    if(PRODUCED_BY[de]===ps[1].be)s+=.9;
    return {score:Number(s.toFixed(1)),level:s>=4.3?"신강":s<=2.1?"신약":"중간"};
  }
  function yongsin(ps){
    const st=strength(ps),de=ps[2].se,c=counts(ps);
    let cand=st.level==="신강"?[PRODUCES[de],CONTROLS[de],CONTROLLED_BY[de]]:st.level==="신약"?[de,PRODUCED_BY[de]]:Object.entries(c).sort((a,b)=>a[1]-b[1]).slice(0,2).map(x=>x[0]);
    return [...new Set(cand)].slice(0,3);
  }
  function manual(text){
    if(!text)return null;
    const arr=[];
    for(let si=0;si<10;si++)for(let bi=0;bi<12;bi++){const t=STEMS[si]+BRANCHES[bi];if(text.includes(t))arr.push(pillarBy(si,bi))}
    return arr.length>=4?arr.slice(0,4):null;
  }
  function analyze(person,manse){
    const warnings=[];
    const man=manual(manse);
    let date=parseSolar(person.birth,person.time);
    let source="자동 양력 계산";
    if(!date)return {ok:false,warnings:["생년월일을 입력해야 합니다."]};
    if((person.calendar||"양력")==="음력"){
      const parts=person.birth.split("-").map(Number);
      const solar=lunarToSolar(parts[0],parts[1],parts[2],false);
      if(solar){
        const t=parseSolar(person.birth,person.time);
        solar.setHours(t.getHours(),t.getMinutes(),0,0);
        date=solar;
        source="음력→양력 변환 후 계산";
      }else{
        warnings.push("음력 변환 지원 범위(1900~2049)를 벗어나 입력일을 양력처럼 계산했습니다.");
        source="음력 변환 범위 밖: 입력일 기준 계산";
      }
    }
    let ps;
    if(man){ps=man;source="직접 입력 만세력 우선";}
    else{
      const yp=yearPillar(date),mp=monthPillar(date,yp),dp=dayPillar(date),hp=hourPillar(date,dp);
      ps=[yp,mp,dp,hp];
    }
    const c=counts(ps),st=strength(ps),ys=yongsin(ps);
    return {
      ok:true,date,
      solarDate:`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`,
      pillars:ps,counts:c,strength:st,yongsin:ys,source,warnings,
      dayElement:ps[2].se,dayStem:ps[2].stem,month:ps[1].text
    };
  }
  function summary(a){
    if(!a.ok)return "생년월일을 입력하면 사주 계산이 표시됩니다.";
    const warn=a.warnings&&a.warnings.length?`\n참고: ${a.warnings.join(" ")}`:"";
    return `사주 8글자: ${a.pillars.map(p=>p.text).join(" · ")}
기준 양력일: ${a.solarDate||"-"}
일간: ${a.dayStem}(${a.dayElement})
오행: 목 ${a.counts.목.toFixed(1)} · 화 ${a.counts.화.toFixed(1)} · 토 ${a.counts.토.toFixed(1)} · 금 ${a.counts.금.toFixed(1)} · 수 ${a.counts.수.toFixed(1)}
구조: ${a.strength.level} / 보완 포인트: ${a.yongsin.join(", ")}
계산: ${a.source}${warn}`;
  }

  window.SAJU={analyze,summary,PRODUCES,CONTROLS,lunarToSolar,solarTermDate};
})();
