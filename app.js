(function(){
  const PIN="0303";
  // Google Apps Script 배포 URL을 넣으면 스프레드시트 저장이 활성화됩니다.
  const SHEET_ENDPOINT="https://script.google.com/macros/s/AKfycbxtnSXuvyiovE87BQeHeMf46zqlfsEE-ILPTsj5CdmTqr2xgjd-c6zfqtvqIqnscdI/exec";
  const $=id=>document.getElementById(id);
  let families=[], history=["login"], hIndex=0, currentText="", currentType="";
  const E={pin:$("pinInput"),pinMsg:$("pinMessage"),menu:$("menuGrid"),sum:$("sajuSummary"),title:$("resultTitle"),sub:$("resultSub"),report:$("report"),save:$("saveStatus"),privacy:$("privacyAgree"),privacyDetail:$("privacyDetail")};
  const ids=["myName","myBirth","myTime","myGender","myCalendar","myConcern","partnerName","partnerBirth","partnerTime","partnerType","familyName","familyRelation","familyBirth","familyTime","manseMemo"];
  ids.forEach(id=>E[id]=$(id));

  function screen(id,push=true){
    document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
    $("screen-"+id).classList.add("active");
    if(push){ history=history.slice(0,hIndex+1); history.push(id); hIndex=history.length-1; }
    updateNav();
    scrollTo({top:0,behavior:"smooth"});
  }
  function updateNav(){
    document.querySelector('[data-action="back"]').disabled=hIndex<=0;
    document.querySelector('[data-action="forward"]').disabled=hIndex>=history.length-1;
  }
  function profile(){
    return {
      privacyAgree:E.privacy.checked,
      me:{name:E.myName.value.trim()||"고객",birth:E.myBirth.value,time:E.myTime.value||"모름",gender:E.myGender.value,calendar:E.myCalendar.value,concern:E.myConcern.value.trim()||"전체 흐름"},
      partner:{name:E.partnerName.value.trim(),birth:E.partnerBirth.value,time:E.partnerTime.value||"모름",type:E.partnerType.value},
      families:[...families],
      manseMemo:E.manseMemo.value.trim()
    };
  }
  function save(){
    const p=profile();
    p.privacyAgree=false;
    localStorage.setItem("fortune-v4", JSON.stringify(p));
  }
  function load(){
    try{
      const p=JSON.parse(localStorage.getItem("fortune-v4")||"null");
      if(!p) return;
      E.myName.value=p.me?.name||"";
      E.myBirth.value=p.me?.birth||"";
      E.myTime.value=p.me?.time==="모름"?"":(p.me?.time||"");
      E.myGender.value=p.me?.gender||"여성";
      E.myCalendar.value=p.me?.calendar||"양력";
      E.myConcern.value=p.me?.concern||"";
      E.partnerName.value=p.partner?.name||"";
      E.partnerBirth.value=p.partner?.birth||"";
      E.partnerTime.value=p.partner?.time==="모름"?"":(p.partner?.time||"");
      E.partnerType.value=p.partner?.type||"연인";
      families=Array.isArray(p.families)?p.families:[];
      E.manseMemo.value=p.manseMemo||"";
      renderFamily();
    }catch(err){}
  }
  function login(){ if(E.pin.value.trim()===PIN){ E.pinMsg.textContent=""; screen("form"); } else { E.pinMsg.textContent="PIN 번호가 맞지 않습니다."; } }
  function addFamily(){
    const f={name:E.familyName.value.trim(),relation:E.familyRelation.value.trim(),birth:E.familyBirth.value,time:E.familyTime.value||"모름"};
    if(!f.name||!f.relation||!f.birth){ alert("가족 이름, 관계, 생년월일을 입력해 주세요."); return; }
    families.push(f);
    E.familyName.value=""; E.familyRelation.value=""; E.familyBirth.value=""; E.familyTime.value="";
    renderFamily(); save();
  }
  function renderFamily(){
    const box=$("familyList");
    box.innerHTML=families.map((f,i)=>`<div class="family-item"><span>${f.relation} · ${f.name} · ${f.birth}</span><button class="btn ghost" style="padding:7px 10px;border-radius:10px" data-remove="${i}">삭제</button></div>`).join("");
  }
  function goMenu(){
    const p=profile();
    if(!p.me.birth){ alert("내 생년월일은 반드시 입력해 주세요."); return; }
    if(!p.privacyAgree){ alert("개인정보 수집 및 저장 동의에 체크해 주세요."); return; }
    save();
    E.sum.textContent=ENGINE.summary(SAJU.analyze(p.me,p.manseMemo));
    renderMenus(p);
    screen("menu");
  }
  function renderMenus(p){
    E.menu.innerHTML=ENGINE.MENU.map(m=>{
      const locked=(m[3]==="partner"&&!ENGINE.hasPartner(p))||(m[3]==="family"&&!ENGINE.hasFamily(p));
      const status=m[3]==="partner"?"상대 정보 필요":m[3]==="family"?"가족 정보 필요":"바로 보기";
      return `<button class="menu-card ${locked?'locked':''}" data-report="${m[0]}" ${locked?`data-locked="${m[3]}"`:""}><span class="status">${status}</span><div class="menu-title">${m[1]}</div><div class="menu-desc">${m[2]}</div></button>`;
    }).join("");
  }
  function make(id){
    const p=profile();
    const res=ENGINE.report(id,p);
    currentText=res.text;
    currentType=id;
    E.title.textContent=res.title;
    E.sub.textContent=res.analysis?.ok?`사주 8글자: ${res.analysis.pillars.map(x=>x.text).join(" · ")} / ${res.analysis.strength.level}`:"";
    E.report.innerHTML=res.html;
    screen("result");
    sendLead(p,id);
  }
  async function sendLead(p,id){
    E.save.textContent="";
    E.save.className="save-status";
    if(!SHEET_ENDPOINT){ return; }
    try{
      await fetch(SHEET_ENDPOINT,{
        method:"POST",
        mode:"no-cors",
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body:JSON.stringify({
          timestamp:new Date().toISOString(),
          name:p.me.name,birth:p.me.birth,time:p.me.time,gender:p.me.gender,calendar:p.me.calendar,concern:p.me.concern,
          partnerName:p.partner.name,partnerBirth:p.partner.birth,
          families:p.families.map(f=>`${f.relation}:${f.name}:${f.birth}`).join(" | "),
          reportType:id,userAgent:navigator.userAgent
        })
      });
      E.save.textContent="이용 기록이 스프레드시트로 전송되었습니다.";
      E.save.classList.add("ok");
    }catch(err){
      E.save.textContent="스프레드시트 전송 실패: URL 또는 배포 설정을 확인해 주세요.";
      E.save.classList.add("warn");
    }
  }
  function copy(){ navigator.clipboard?.writeText(currentText||E.report.textContent).then(()=>alert("결과를 복사했습니다.")).catch(()=>alert("복사가 지원되지 않는 브라우저입니다.")); }
  function download(){
    const blob=new Blob([currentText||E.report.textContent],{type:"text/plain;charset=utf-8"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=(E.title.textContent||"result")+".txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }
  function reset(){
    if(!confirm("전체 입력 정보를 삭제할까요?")) return;
    localStorage.removeItem("fortune-v4");
    families=[];
    document.querySelectorAll("input,textarea").forEach(x=>{ if(x.type!=="checkbox") x.value=""; });
    E.privacy.checked=false;
    renderFamily();
  }
  function sample(){
    E.myName.value="지훈"; E.myBirth.value="1990-05-20"; E.myTime.value="10:30"; E.myGender.value="남성"; E.myCalendar.value="양력"; E.myConcern.value="돈과 직업";
    E.partnerName.value="상대"; E.partnerBirth.value="1992-03-03"; E.partnerTime.value="14:00"; E.partnerType.value="연인";
    families=[{name:"어머니",relation:"부모",birth:"1965-08-15",time:"모름"}];
    renderFamily(); save();
  }

  document.addEventListener("click",e=>{
    const action=e.target.closest("[data-action]")?.dataset.action;
    if(action){
      if(action==="login") login();
      if(action==="home") screen("login");
      if(action==="back"&&hIndex>0){ hIndex--; screen(history[hIndex],false); }
      if(action==="forward"&&hIndex<history.length-1){ hIndex++; screen(history[hIndex],false); }
      if(action==="fill-sample") sample();
      if(action==="toggle-privacy") E.privacyDetail.classList.toggle("open");
      if(action==="clear-partner"){ E.partnerName.value=""; E.partnerBirth.value=""; E.partnerTime.value=""; save(); }
      if(action==="clear-family"){ families=[]; renderFamily(); save(); }
      if(action==="add-family") addFamily();
      if(action==="go-menu") goMenu();
      if(action==="back-form") screen("form");
      if(action==="back-menu") screen("menu");
      if(action==="make-all") make("total");
      if(action==="copy-report") copy();
      if(action==="download-report") download();
      if(action==="print-report") window.print();
      if(action==="reset-all") reset();
    }
    const rm=e.target.closest("[data-remove]");
    if(rm){ families.splice(Number(rm.dataset.remove),1); renderFamily(); save(); }
    const menu=e.target.closest("[data-report]");
    if(menu){
      if(menu.dataset.locked){ alert(menu.dataset.locked==="partner"?"궁합 분석을 위해 상대방 이름과 생년월일을 입력해 주세요.":"가족 관계 분석을 위해 가족 정보를 1명 이상 추가해 주세요."); return; }
      make(menu.dataset.report);
    }
  });

  E.pin.addEventListener("keydown",e=>{ if(e.key==="Enter") login(); });
  if("serviceWorker" in navigator){ addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{})); }
  load(); updateNav();
})();
