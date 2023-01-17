let blickData
let blickWatches = [];
const blickStore = {}

class BlickApp {

  data(dt){
    blickData = new Proxy(dt, {
      get(c, a) {
        return Reflect.get(c, a)
      },
      set(d, a, b) {  
        // console.log(d, a, b); 
        let old = d[a]
        blickWatches.forEach(wch=>{if (a === wch.var || wch.var === true) wch.func(old,b)})
        d[a] = b
        update(a, old, b, a)
      }
    })
    return blickData
  }

  watch(a,b){
    blickWatches.push({
      var:a,
      func:b
    })
  }

  mounted(e){
    addEventListener("DOMContentLoaded",e)
  }

}


const end = (c, a) => c.slice(0, -a);
const keywords = 'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments,typeof,void'
const checkKeywords = (a, b) => Boolean(a.split(',').filter(el => b.includes(el)).length)


const js = str => {
  if (!checkKeywords(keywords, String(str))) {
    Object.keys(blickData).forEach(el => {
      if (str.includes(el) && !str.includes('blickData.'+el)) {
        str = str.replaceAll(el, 'blickData.' + el)
      }
    })
    return new Function(`return ${str}`)()
  }
}

const q = e => document.querySelectorAll(e)

const attr = (elem, str, st, val) => {
  if (st=="has") return elem.hasAttribute(str)
  if (st=="set") return elem.setAttribute(str, val)
  if (st=="get") return elem.getAttribute(str)
  else return elem.getAttribute(str)
}


function parseAttr(b){
  const c=[],d=(d,a)=>c.push({prop:d,value:a}),
  e=a=>a.slice(0,a.indexOf(":")).trim(),
  f=a=>a.slice(a.indexOf(":")+1).trim(),
  g=c=>e(c?c:b).split("&").forEach(a=>{d(a.trim(),f(c?c:b))});
  return b.includes(";")
  ?b.split(";").forEach(a=>a.includes("&")?g(a):d(e(a),f(a)))
  :b.includes("&")?g():d(e(b),f(b)),c
}

function update(zm, old, nw, pr) {
  blickStore[zm]?.forEach(e=>{
    
    if (e.bind) {
      parseAttr(e.bind).forEach(sho =>{
        if (sho.prop == 'class') sho.prop = 'className'
        if (sho.prop == 'text')  sho.prop = 'innerText'
        
        if (sho.prop == 'this') {
          if (blickData[sho.value] != e.el) blickData[sho.value] = e.el 
        }
        else if (sho.prop == 'className') {
          if (old !== undefined) {
            old = typeof old === 'string' ? `"${old}"` : old
            e.el.classList.remove(js(sho.value.replaceAll(zm,old)))
            e.el.classList.add(js(sho.value))
          }
          else{
            console.log(js(sho.value));
            if (!e.el.className.includes(js(sho.value))) {
              e.el.className += ' ' + js(sho.value)
            }
          }
        }
        else if (sho.prop == 'innerText'){
          if (blickData[sho.value] != e.el[sho.prop] ) blickData[sho.value] = e.el[sho.prop] 
        }
        else e.el[sho.prop] = js(sho.value)
        
        
      })
    }
    if (e.if) {
      if(js(e.if)){
        e.el.append(...e.html)
      }
      else {
        e.el.innerHTML = ''
      }
    }
    if (e.css) {
      parseAttr(e.css).forEach(sho =>{
        e.el.style[sho.prop] = js(sho.value)
      })
    }
    if (e.in) {
      let g = e.in
      let h = g.match(/\{([^}]+)\}/g)
      let d = h.map(a => a.slice(1, a.length-1).trim())

      for (let c in h) {
        g = g.replaceAll(h[c], js(d[c]))
      }

      e.el.innerHTML = g
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  if (blickData) {
    Object.keys(blickData).forEach(key =>{if(typeof(blickData[key])!='function')blickStore[key]=[]})
  }

  function setStore(elem,str){
    Object.keys(blickStore).forEach(key =>{
      if (attr(elem,str).includes(key)||elem.innerText.includes(key)){
        let obj = {el:elem}
        if (str === 'in') obj[str] = elem.innerText
        else {
          if (str === 'if') {
            obj.html = Array.from(elem.children)
          }
          obj[str] = attr(elem,str)
        }
        blickStore[key].push(obj)
      }
      update(key)
    })
  }

  const selectors = 'on,in,if,bind,css'
  const querySelAll = selectors.split(',').map(sel => '['+sel+']').join()

  q(querySelAll).forEach(el => {
    if (el.hasAttribute('in')  ) {
      setStore(el,'in')  
      el.removeAttribute('in')
    }   
    if (el.hasAttribute('if')  ) {
      setStore(el,'if')  
      el.removeAttribute('if')
    }    
    if (el.hasAttribute('css') ) {
      setStore(el,'css') 
      el.removeAttribute('css')
    }
    if (el.hasAttribute('bind')) {
      let ev = 'change'
      let at = attr(el, 'bind')
      if (at.includes('value') || at.includes('checked')) {
        parseAttr(at).forEach(pars=>{
          if (pars.prop == 'value') ev = 'input'
          el.addEventListener(ev, ()=>{blickData[pars.value] = el[pars.prop]})
        })
      }
      setStore(el,'bind')
      el.removeAttribute('bind')
    }   
    if (el.hasAttribute('on')) {
      parseAttr(attr(el, 'on')).forEach(pars=>{
        el.addEventListener(pars.prop,function(){js(pars.value)})
      })
      el.removeAttribute('on')
    }
  })
  
})