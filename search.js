// Header search with live suggestions — matches product names, drops and categories
const LS_SEARCH_ITEMS=[
  ...Object.entries(LS_PRODUCTS).map(([id,p])=>({id,name:p.name,image:p.image,meta:p.drop+' · '+money(p.price),keywords:p.drop+' fall collection'})),
  {name:'Sweat suits',href:'/essentials#sweat-suits',meta:'Essentials · Coming soon',keywords:'sweatsuit sweats hoodie joggers set essentials'},
  {name:'Graphic tees',href:'/essentials#graphic-tees',meta:'Essentials · Coming soon',keywords:'tee t-shirt shirt graphic essentials'},
  {name:'Jackets',href:'/essentials#jackets',meta:'Essentials · Coming soon',keywords:'jacket outerwear coat essentials'}
];
const escapeHtml=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function searchItems(q){
  const words=q.toLowerCase().split(/\s+/).filter(Boolean);
  if(!words.length)return[];
  return LS_SEARCH_ITEMS.filter(i=>{const text=(i.name+' '+i.keywords).toLowerCase();return words.every(w=>text.includes(w))})
    .sort((a,b)=>(b.name.toLowerCase().includes(words[0]))-(a.name.toLowerCase().includes(words[0])));
}
function highlight(name,q){
  let html=escapeHtml(name);
  q.split(/\s+/).filter(Boolean).forEach(w=>{const safe=escapeHtml(w).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');html=html.replace(new RegExp('('+safe+')','ig'),'<mark>$1</mark>')});
  return html;
}
function openSearchResult(item){
  if(item.href){location.href=item.href;return}
  const card=document.querySelector(`[data-product="${item.id}"]`);
  if(card){card.scrollIntoView({behavior:'smooth',block:'center'});card.click()}
  else location.href='/?product='+encodeURIComponent(item.id);
}
document.querySelectorAll('[data-search]').forEach(box=>{
  const input=box.querySelector('input'),list=box.querySelector('.search-results');
  let results=[],active=-1;
  const close=()=>{list.hidden=true;active=-1;input.setAttribute('aria-expanded','false')};
  function render(){
    const q=input.value.trim();
    if(!q){close();return}
    results=searchItems(q);active=-1;
    list.innerHTML=results.length
      ?`<li class="search-count">${results.length} result${results.length>1?'s':''} for “${escapeHtml(q)}”</li>`+results.map((r,i)=>`<li role="option" id="sr-${i}" data-i="${i}">${r.image?`<img src="${r.image}" alt="">`:'<span class="search-icon">↘</span>'}<span><strong>${highlight(r.name,q)}</strong><small>${escapeHtml(r.meta)}</small></span></li>`).join('')
      :`<li class="search-empty">No products match “${escapeHtml(q)}”. Try “fall”, “tees” or “jackets”.</li>`;
    list.hidden=false;input.setAttribute('aria-expanded','true');
    list.querySelectorAll('[data-i]').forEach(li=>li.onmousedown=e=>{e.preventDefault();close();input.blur();openSearchResult(results[+li.dataset.i])});
  }
  function move(d){
    if(!results.length)return;
    active=(active+d+results.length)%results.length;
    list.querySelectorAll('[data-i]').forEach(li=>li.classList.toggle('on',+li.dataset.i===active));
    input.setAttribute('aria-activedescendant','sr-'+active);
  }
  input.addEventListener('input',render);
  input.addEventListener('focus',render);
  input.addEventListener('blur',close);
  input.addEventListener('keydown',e=>{
    if(e.key==='ArrowDown'){e.preventDefault();move(1)}
    else if(e.key==='ArrowUp'){e.preventDefault();move(-1)}
    else if(e.key==='Enter'){e.preventDefault();const pick=results[active>-1?active:0];if(pick){close();input.blur();openSearchResult(pick)}}
    else if(e.key==='Escape'){e.stopPropagation();close();input.blur()}
  });
  box.addEventListener('submit',e=>e.preventDefault());
});
// Opening a product picked from search on another page (/?product=id)
(()=>{const id=new URLSearchParams(location.search).get('product'),card=id&&document.querySelector(`[data-product="${CSS.escape(id)}"]`);
  if(card){history.replaceState(null,'',location.pathname+location.hash);card.click()}})();
