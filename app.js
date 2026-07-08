const $ = (id)=>document.getElementById(id);
const tabs=document.querySelectorAll('.tab');
tabs.forEach(btn=>btn.addEventListener('click',()=>{tabs.forEach(b=>b.classList.remove('active'));document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));btn.classList.add('active');$(btn.dataset.tab).classList.add('active')}));

const profileFields=['catName','catAge','catWeight','catActivity'];
profileFields.forEach(id=>{const v=localStorage.getItem(id); if(v) $(id).value=v;});
$('saveProfile').onclick=()=>{profileFields.forEach(id=>localStorage.setItem(id,$(id).value));$('profileSaved').textContent='Profil wurde lokal auf diesem Gerät gespeichert.'};

$('photoInput').addEventListener('change', e=>{const file=e.target.files[0]; if(!file) return; const img=$('preview'); img.src=URL.createObjectURL(file); img.hidden=false; document.querySelector('.photo-box span').style.display='none';});

function selectedWarnings(){return [...document.querySelectorAll('.warn:checked')].map(x=>x.value)}
function profileName(){return localStorage.getItem('catName') || $('catName').value || 'deine Katze'}

$('analyzeBtn').onclick=()=>{
  const behavior=$('behavior').value, meow=$('meow').value, warns=selectedWarnings();
  const urgent=warns.some(w=>['atemnot','blut','erbricht','frisst nicht'].includes(w));
  let mood='wirkt anhand deiner Eingaben eher unauffällig.';
  let tips=[];
  if(['entspannt','aufmerksam'].includes(behavior)) tips.push('Beobachte weiter: Körperhaltung, Ohren, Schwanz und Fressverhalten geben oft gute Hinweise.');
  if(behavior==='versteckt') {mood='könnte gestresst, unsicher oder überfordert sein.'; tips.push('Biete Rückzugsorte an und bedränge sie nicht.');}
  if(behavior==='unruhig') {mood='könnte Aufmerksamkeit, Beschäftigung, Futter oder Zugang zu einem Ort suchen.'; tips.push('Prüfe Futter, Wasser, Toilette und ob sie spielen möchte.');}
  if(behavior==='aggressiv') {mood='wirkt abwehrend oder gereizt.'; tips.push('Abstand halten, nicht hochnehmen und Stressquellen reduzieren.');}
  if(behavior==='matt') {mood='wirkt ungewöhnlich ruhig. Das sollte beobachtet werden.'; tips.push('Wenn das neu ist oder länger anhält: tierärztlich abklären lassen.');}
  if(meow==='futter') tips.push('Lautes Miauen am Futterplatz kann Hunger, Gewohnheit oder Erwartung bedeuten.');
  if(meow==='tuer') tips.push('Miauen an Tür/Fenster kann Neugier, Revierverhalten oder den Wunsch nach Zugang anzeigen.');
  if(meow==='nacht') tips.push('Nächtliches Miauen kann Langeweile, Routine, Alter, Stress oder Hunger als Ursache haben.');
  if(meow==='dauerhaft') tips.push('Ungewohnt dauerhaftes lautes Miauen sollte ernst genommen und beobachtet werden.');
  if(warns.length) tips.push('Markierte Warnzeichen: '+warns.join(', ')+'.');
  const cls=urgent?'result danger':'result ok';
  $('result').className=cls;
  $('result').hidden=false;
  $('result').innerHTML=`<h3>Hinweis für ${profileName()}</h3><p><strong>Einschätzung:</strong> ${profileName()} ${mood}</p>${urgent?'<p><strong>Bitte Tierarzt kontaktieren:</strong> Bei Warnzeichen wie Atemnot, Blut, wiederholtem Erbrechen oder Futterverweigerung sollte zeitnah eine Praxis kontaktiert werden.</p>':''}<h4>Mögliche Gründe fürs Miauen</h4><ul>${tips.map(t=>`<li>${t}</li>`).join('')}</ul><p class="small">Keine Diagnose. Nur allgemeine Hinweise aus deinen Angaben.</p>`;
};

$('foodBtn').onclick=()=>{
  const weight=parseFloat(localStorage.getItem('catWeight') || $('catWeight').value || '0');
  const activity=localStorage.getItem('catActivity') || $('catActivity').value;
  const meals=$('meals').value, type=$('foodType').value;
  let text='Bitte Gewicht im Profil eintragen, damit ein grober Plan erstellt werden kann.';
  if(weight>0){
    let factor=activity==='hoch'?1.15:activity==='niedrig'?0.9:1;
    const kcal=Math.round(weight*55*factor);
    text=`Grobe Tagesorientierung: ca. ${kcal} kcal pro Tag, verteilt auf ${meals} Mahlzeiten. Bei ${type==='nass'?'Nassfutter':type==='trocken'?'Trockenfutter':'Mischfütterung'} bitte die Herstellerangaben prüfen, da Kalorien stark variieren.`;
  }
  $('foodResult').hidden=false;
  $('foodResult').innerHTML=`<h3>Fütterungsplan für ${profileName()}</h3><p>${text}</p><span class="pill">frisches Wasser</span><span class="pill">langsame Futterwechsel</span><span class="pill">Leckerlis einrechnen</span><p class="small">Richtwert, keine medizinische Fütterungsberatung.</p>`;
};

if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
