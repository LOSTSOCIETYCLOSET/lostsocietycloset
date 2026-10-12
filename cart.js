// Shared LOSTSOCIETY cart — stored in the visitor's browser (localStorage)
const LS_PRODUCTS={
  'fall-memories':{name:'Fall Memories',price:60,image:'/fall-memories.png',drop:'First drop'},
  'forgotten-persona':{name:'Forgotten Persona',price:75,image:'/forgotten-persona.png',drop:'Second drop'},
  'fallen-freedom':{name:'Fallen Freedom',price:60,image:'/image.png',drop:'Third drop'},
  'ls-sweat-suit':{name:'Lost Society Sweat Suit',price:150,image:'/lost-society-sweat-suit.png',drop:'Sweat suit drop one',page:'/essentials',keywords:'full set hoodie pants sweatsuit sweats joggers essentials'},
  'ls-sweat-hoodie':{name:'Lost Society Sweat Suit — Hoodie',price:75,image:'/lost-society-sweat-hoodie.png',drop:'Sweat suit drop one',page:'/essentials',keywords:'hoodie sweatshirt sweatsuit sweats essentials'},
  'ls-sweat-pants':{name:'Lost Society Sweat Suit — Pants',price:75,image:'/lost-society-sweat-pants.png',drop:'Sweat suit drop one',page:'/essentials',keywords:'pants joggers sweatpants sweatsuit sweats essentials'}
};
const LS_SIZES=['S','M','L','XL','XXL'];
const Cart={
  key:'lostsociety-cart',
  get(){try{return (JSON.parse(localStorage.getItem(this.key))||[]).filter(i=>LS_PRODUCTS[i.id])}catch(e){return[]}},
  save(items){localStorage.setItem(this.key,JSON.stringify(items));document.dispatchEvent(new CustomEvent('cart:change'))},
  add(id,size,qty){const items=this.get(),hit=items.find(i=>i.id===id&&i.size===size);if(hit)hit.qty=Math.min(10,hit.qty+qty);else items.push({id,size,qty});this.save(items)},
  setQty(index,qty){const items=this.get();if(!items[index])return;if(qty<1)items.splice(index,1);else items[index].qty=Math.min(10,qty);this.save(items)},
  remove(index){const items=this.get();items.splice(index,1);this.save(items)},
  count(){return this.get().reduce((n,i)=>n+i.qty,0)},
  subtotal(){return this.get().reduce((n,i)=>n+LS_PRODUCTS[i.id].price*i.qty,0)}
};
const money=n=>'$'+n.toFixed(2);
function renderCartLines(el,{editable=true}={}){
  const items=Cart.get();
  if(!items.length){el.innerHTML='<p class="cart-empty">Your cart is empty. Go grab a drop.</p>';return}
  el.innerHTML=items.map((i,idx)=>{const p=LS_PRODUCTS[i.id];return `<div class="cart-line">
<img src="${p.image}" alt="${p.name}"><div class="cart-line-info"><strong>${p.name}</strong><span>Size ${i.size} · ${money(p.price)}</span>
${editable?`<div class="qty"><button data-dec="${idx}" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-inc="${idx}" aria-label="Increase quantity">+</button><button class="remove" data-rm="${idx}">Remove</button></div>`:`<span>Qty ${i.qty}</span>`}
</div><strong class="cart-line-total">${money(p.price*i.qty)}</strong></div>`}).join('');
  el.querySelectorAll('[data-dec]').forEach(b=>b.onclick=()=>Cart.setQty(+b.dataset.dec,Cart.get()[+b.dataset.dec].qty-1));
  el.querySelectorAll('[data-inc]').forEach(b=>b.onclick=()=>Cart.setQty(+b.dataset.inc,Cart.get()[+b.dataset.inc].qty+1));
  el.querySelectorAll('[data-rm]').forEach(b=>b.onclick=()=>Cart.remove(+b.dataset.rm));
}
function updateCartBadges(){document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=Cart.count())}
document.addEventListener('cart:change',updateCartBadges);
window.addEventListener('storage',e=>{if(e.key===Cart.key)document.dispatchEvent(new CustomEvent('cart:change'))});
document.addEventListener('DOMContentLoaded',updateCartBadges);
