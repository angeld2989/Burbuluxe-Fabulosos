const products = [
  {id:1, title:'Kiwi', price:15, img:'ManzanaKiwi.png'},
  {id:2, title:'Naranja', price:15, img:'Naranja.png'},
  {id:3, title:'Lavanda con Citronela', price:15, img:'Lavanda.png'},
  {id:4, title:'Cereza', price:15, img:'Cereza.png'},
  {id:5, title:'Mar Fresco', price:15, img:'MarFresco.png'},
  {id:6, title:'Manzana', price:15, img:'ManzanaKiwi.png'}
];

const sellerPhone = '523338063100'; 
let cart = JSON.parse(localStorage.getItem('burbuluxe_cart') || '{}');

const productsEl = document.getElementById('products');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItemsEl = document.getElementById('cartItems');

products.forEach(p => {
  const card = document.createElement('article');
  card.className = 'card';
  card.innerHTML = `
    <div class="product-media">
      <img src="${p.img}" alt="${p.title}">
      <div class="bubble-area" data-id="${p.id}"></div>
    </div>
    <div class="product-info">
      <div><strong>${p.title}</strong></div>
      <div class="price">$ ${p.price.toFixed(2)}</div>
      <button class="btn btn-add" data-id="${p.id}">Agregar</button>
    </div>
  `;
  productsEl.appendChild(card);
});

function saveCart(){ localStorage.setItem('burbuluxe_cart', JSON.stringify(cart)); renderCart(); }
function renderCart(){
  const keys = Object.keys(cart);
  cartCount.textContent = keys.reduce((s,k)=>s+cart[k].qty,0);
  cartItemsEl.innerHTML = '';
  if(keys.length===0){ cartItemsEl.innerHTML = '<div>No hay productos</div>'; return; }
  keys.forEach(k=>{
    const it = cart[k];
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div><strong>${it.title}</strong> - $${it.price.toFixed(2)}</div>
      <div class="qty">
        <button onclick="changeQty(${it.id},-1)">-</button>
        <span>${it.qty}</span>
        <button onclick="changeQty(${it.id},1)">+</button>
        <button onclick="removeItem(${it.id})">🗑</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });
}
function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  if(cart[id]) cart[id].qty++; else cart[id]={...p,qty:1};
  saveCart();
}
function changeQty(id,delta){
  if(!cart[id]) return;
  cart[id].qty += delta;
  if(cart[id].qty<=0) delete cart[id];
  saveCart();
}
function removeItem(id){ delete cart[id]; saveCart(); }

// Botones
document.addEventListener('click', e=>{
  if(e.target.matches('.btn-add')){
    addToCart(Number(e.target.dataset.id));
  }
});
document.getElementById('openCart').addEventListener('click',()=>{ cartPanel.style.display='block'; renderCart(); });
document.getElementById('closeCart').addEventListener('click',()=>{ cartPanel.style.display='none'; });
document.getElementById('sendWhats').addEventListener('click',()=>{
  const keys = Object.keys(cart);
  if(keys.length===0) return alert('Carrito vacío');
  const name=document.getElementById('buyerName').value||'Cliente';
  const phone=document.getElementById('buyerPhone').value||'';
  const addr=document.getElementById('buyerAddr').value||'';
  let text=`Pedido desde BURBULUXE%0ACliente: ${name}%0ATeléfono: ${phone}%0ADirección: ${addr}%0A%0AProductos:%0A`;
  let total=0;
  keys.forEach(k=>{const it=cart[k];text+=`${it.qty} x ${it.title} - $${it.price}%0A`;total+=it.qty*it.price;});
  text+=`%0ATotal: $${total}`;
  window.open(`https://wa.me/${sellerPhone}?text=${text}`,'_blank');
});
renderCart();

// Burbujas animadas
function spawnBubble(area){
  const b=document.createElement('div');b.className='bubble';
  const size=Math.random()*18+6;
  b.style.width=b.style.height=size+'px';
  b.style.left=Math.random()*90+'%';
  b.style.bottom='-10%';
  b.style.animationDuration=(3+Math.random()*3)+'s';
  area.appendChild(b);
  setTimeout(()=>b.remove(),4000);
}
function startBubbles(){
  document.querySelectorAll('.bubble-area').forEach(area=>{
    setInterval(()=>spawnBubble(area),600);
  });
}
startBubbles();
