(function(){
var S=window.SITE,K='cart_'+S.key,off=0;
function $(q,e){return(e||document).querySelector(q)}
var St=window.St={S:S,P:window.PRODUCTS,$:$,
fmt:function(n){return S.cur+Math.round(n).toLocaleString('en-IN')},
by:function(id){return St.P.filter(function(p){return p.id==id})[0]},
qs:function(k){return new URLSearchParams(location.search).get(k)},
get:function(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return{}}},
put:function(c){try{localStorage.setItem(K,JSON.stringify(c))}catch(e){}St.count();if(St.onCart)St.onCart()},
add:function(id,q){var c=St.get();c[id]=(c[id]||0)+(q||1);St.put(c);St.toast('Added to cart')},
lines:function(){var c=St.get();return Object.keys(c).filter(St.by).map(function(i){var p=St.by(i);return{p:p,q:c[i],t:p.price*c[i]}})},
count:function(){var n=0,c=St.get();for(var k in c)n+=c[k];document.querySelectorAll('[data-count]').forEach(function(e){e.textContent=n});return n},
coupon:function(c){if(c.trim().toUpperCase()=='WELCOME10'){off=.1;return true}return false},
totals:function(){var sub=0,n=0;St.lines().forEach(function(l){sub+=l.t;n+=l.q});var r=off;if(S.bundle)r=Math.max(r,n>=3?.2:n>=2?.15:0);var d=sub*r,sh=sub&&sub-d<S.free?S.ship:0;return{sub:sub,d:d,sh:sh,n:n,rate:r,total:sub-d+sh}},
list:function(o){var l=St.P.filter(function(p){return(!o.cat||o.cat=='All'||p.cat==o.cat)&&(!o.q||(p.name+p.sub+p.cat).toLowerCase().indexOf(o.q)>-1)&&(!o.r||(o.r=='a'?p.price<500:o.r=='b'?p.price>=500&&p.price<2000:p.price>=2000))});if(o.s=='a')l.sort(function(a,b){return a.price-b.price});if(o.s=='d')l.sort(function(a,b){return b.price-a.price});return l},
off:function(p){return p.old?Math.round((1-p.price/p.old)*100):0},
toast:function(t){var e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=t;e.className='on';clearTimeout(e.t);e.t=setTimeout(function(){e.className=''},1800)}};
document.addEventListener('click',function(e){var t=e.target.closest('[data-add],[data-inc],[data-dec],[data-rm],[data-checkout]');if(!t)return;var d=t.dataset,c=St.get();
 if(d.add!==undefined){var q=d.qin?+$(d.qin).value||1:+d.q||1;St.add(d.add,q);if(St.opened)St.opened()}
 else if(d.checkout!==undefined){St.put({});St.toast('Order placed (demo). Thank you!')}
 else{var id=d.inc||d.dec||d.rm;if(d.inc)c[id]++;if(d.dec)c[id]=Math.max(1,c[id]-1);if(d.rm)delete c[id];St.put(c)}});
document.addEventListener('DOMContentLoaded',function(){St.count();
 document.querySelectorAll('nav a').forEach(function(a){if(location.pathname.split('/').pop()==a.getAttribute('href'))a.classList.add('on')});
 var cf=$('[data-contact]');if(cf)cf.onsubmit=function(e){e.preventDefault();cf.innerHTML='<p><b>Thanks, message received (demo).</b></p>'};
 if(St.onCart)St.onCart()});
})();
