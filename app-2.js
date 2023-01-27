let Rem_Data
let Rem_Watches = [];
const Rem_Store = {}
const Rem_Store_For = {}
const RemJs = {
  data(dt) {
    Rem_Data = new Proxy(dt, {
      get(c, a) {
        return Reflect.get(c, a)
      },
      set(d, a, b) {
        let old = d[a]
        Rem_Watches.forEach(wch => {
          if (a === wch.var || wch.var === true) wch.func(old, b)
        })
        d[a] = b
        Rem_Update(a, old, b, a)
        // console.log(123);
      }
    })
    return Rem_Data
  },
  watch(a, b) {
    Rem_Watches.push({ var: a, func: b })
  },
  mounted(e) {
    addEventListener("DOMContentLoaded", e)
  }
}


function Rem_js(str) {
  const keywords = 'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,super,throw,while,yield,delete,export,import,return,switch,default,extends,finally,continue,debugger,function,arguments,typeof,void'
  const checkKeywords = (a, b) => Boolean(a.split(',').filter(el => b.includes(el)).length)

  if (!checkKeywords(keywords, String(str))) {
    Object.keys(Rem_Data).forEach(el => {
      if (str.includes(el) && !str.includes('Rem_Data.' + el)) {
        str = str.replaceAll(el, 'Rem_Data.' + el)
      }
    })
    return new Function(`return ${str}`)()
  }
}

function Rem_parseAttr(b) {
  const c = [], d = (d, a) => c.push({ prop: d, value: a }),
    e = a => a.slice(0, a.indexOf(":")).trim(),
    f = a => a.slice(a.indexOf(":") + 1).trim(),
    g = c => e(c ? c : b).split("&").forEach(a => { d(a.trim(), f(c ? c : b)) });
  return b.includes(";")
    ? b.split(";").forEach(a => a.includes("&") ? g(a) : d(e(a), f(a)))
    : b.includes("&") ? g() : d(e(b), f(b)), c
}

function Rem_Update(zm, old, nw, pr) {
  // console.log(zm);
  Rem_Store[zm]?.forEach(e => {
    // console.log(e);
    if (e.bind) {
      for (const sho of Rem_parseAttr(e.bind)) {
        if (sho.prop == 'class') sho.prop = 'className'
        if (sho.prop == 'text') sho.prop = 'innerText'

        if (sho.prop == 'this') {
          if (Rem_Data[sho.value] != e.el) Rem_Data[sho.value] = e.el
        }
        else if (sho.prop == 'className') {
          if (old !== undefined) {
            old = typeof old === 'string' ? `"${old}"` : old
            e.el.classList.remove(Rem_js(sho.value.replaceAll(zm, old)))
            e.el.classList.add(Rem_js(sho.value))
          }
          else {
            console.log(Rem_js(sho.value));
            if (!e.el.className.includes(Rem_js(sho.value))) {
              e.el.className += ' ' + Rem_js(sho.value)
            }
          }
        }
        else if (sho.prop == 'innerText') {
          if (Rem_Data[sho.value] != e.el[sho.prop]) Rem_Data[sho.value] = e.el[sho.prop]
        }
        else e.el[sho.prop] = Rem_js(sho.value)
      }
    }
    if (e.if) {

      if (Rem_js(e.if)) {
        e.el.append(...e.html)
      }
      else {
        e.el.innerHTML = ''
      }
    }
    if (e.css) {
      for (const sho of Rem_parseAttr(e.css)) {
        e.el.style[sho.prop] = Rem_js(sho.value)
      }
    }
    if (e.for) {
      e.el.innerHTML = ''

      for (const i in Rem_Data[e.for]) {
        let elem = createElement(e.html)[0]?.cloneNode(true)
        if (!elem) break
        // let isIn = elem.hasAttribute('in')
        let text = elem.innerHTML.replaceAll('$', `${e.for}[${i}]`)
        let prv = text

        // if (isIn) {
          let h = text.match(/\{([^}]+)\}/g)
          let d = h?.map(a => a.slice(1, a.length - 1).trim())
          for (let c in d) {
            text = text.replaceAll(h[c], Rem_js(d[c]))
          }
          elem.removeAttribute('in')
        // }

        elem.innerHTML = text
        e.el.append(elem)
        setStore(elem, 'in', prv, i)
      }
    }
    if (e.in) {
      let g = e.in
      let h = g.match(/\{([^}]+)\}/g)
      let d = h.map(a => a.slice(1, a.length - 1).trim())

      for (let c in h) {
        g = g.replaceAll(h[c], Rem_js(d[c]))
      }

      e.el.innerHTML = g
    }

  })
}

function createElement(str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  return div.childNodes;
}

function setStore(elem, str, prevStr, id) {
  if (str === 'in') {
    let elStr = prevStr || elem.innerText
    let keys = elStr
      .match(/\{([^}]+)\}/g)
      ?.map(a => a.slice(1, a.length - 1).trim())
    for (const key in Rem_Store) {
      if (keys?.filter(e => e.includes(key)).length) {
        if (id) {
          let curID = Rem_Store[key].filter(e => e.k == id)
          if (!curID.length) {
            Rem_Store[key].push({
              el: elem,
              [str]: elStr,
              k: id
            })
          } else curID[0].el = elem
        }
        else {
          Rem_Store[key].push({
            el: elem,
            [str]: elStr
          })
        }
      }
    }
  }
  else {
    for (const key in Rem_Store) {
      if (elem.getAttribute(str).includes(key)) {
        let obj = {}
        if (str === 'if') {
          obj.html = Array.from(elem.children)
        }
        if (str === 'for') {
          obj.html = elem.innerHTML.trim()
          elem.innerHTML = ''
        }
        obj[str] = elem.getAttribute(str)
        obj.el = elem
        Rem_Store[key].push(obj)
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (Rem_Data) {
    for (const key of Object.keys(Rem_Data)) {
      if (typeof (Rem_Data[key]) !== 'function') Rem_Store[key] = []
    }
  }



  const selectors = 'on,in,if,bind,css'
  const querySelAll = selectors.split(',').map(sel => `[${sel}]`).join()

  for (const el of document.querySelectorAll('[for]')) {
    setStore(el, 'for')
    el.removeAttribute('for')
  }
  for (const el of document.querySelectorAll('[in]')) {
    setStore(el, 'in')
    el.removeAttribute('in')
  }

  for (const el of document.querySelectorAll(querySelAll)) {
    if (el.hasAttribute('if')) {
      setStore(el, 'if')
      el.removeAttribute('if')
    }
    if (el.hasAttribute('css')) {
      setStore(el, 'css')
      el.removeAttribute('css')
    }
    if (el.hasAttribute('bind')) {
      let ev = 'change'
      let at = el.getAttribute('bind')
      if (at.includes('value') || at.includes('checked')) {
        Rem_parseAttr(at).forEach(pars => {
          if (pars.prop == 'value') ev = 'input'
          el.addEventListener(ev, () => { Rem_Data[pars.value] = el[pars.prop] })
        })
      }
      setStore(el, 'bind')
      el.removeAttribute('bind')
    }
    if (el.hasAttribute('on')) {
      Rem_parseAttr(el.getAttribute('on')).forEach(pars => {
        el.addEventListener(pars.prop, function () { Rem_js(pars.value) })
      })
      el.removeAttribute('on')
    }
  }

  for (const key in Rem_Store) {
    // console.log(Rem_Store)
    Rem_Update(key)
    // Rem_Store[key]?.forEach(e=>{console.log(e,key);})
  }

  // console.log(Rem_Store);
})