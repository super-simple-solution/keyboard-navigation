export function getEle(el, context) {
  if (!el) return
  return (context || document).querySelector(el)
}

export function $$(el, context) {
  if (!el) return []
  return Array.from((context || document).querySelectorAll(el))
}

export function getAttrs(el) {
  const res = {}
  for (const key in el.attributes) {
    if (isNaN(+key)) {
      res[key] = el.attributes[key].value
    }
  }
  return res
}

export function createEle({ tag, content, class: className }) {
  const el = document.createElement(tag)
  el.innerText = content || ''
  el.className = className
  return el
}

// https://www.benpickles.com/articles/51-finding-a-dom-nodes-common-ancestor-using-javascript
function parents(node) {
  let nodes = []
  for (; node; node = node.parentNode) {
    nodes.unshift(node)
  }
  return nodes
}

export function commonAncestor(node1, node2) {
  let parents1 = parents(node1)
  let parents2 = parents(node2)

  if (parents1[0] != parents2[0]) throw 'No common ancestor!'

  for (let i = 0; i < parents1.length; i++) {
    if (parents1[i] != parents2[i]) return parents1[i - 1]
  }
}
