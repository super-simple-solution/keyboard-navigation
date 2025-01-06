export function getEle(el: string, context?: Element | null) {
  if (!el) return
  return (context || document).querySelector(el)
}

export function $$(el: string, context?: Element | null) {
  if (!el) return []
  return Array.from((context || document).querySelectorAll(el))
}

interface DynamicObject {
  [key: string]: string | number | null
}

export function getAttrs(el: Element) {
  const res = {} as DynamicObject
  for (const key in el.attributes) {
    if (Number.isNaN(+key)) {
      res[key] = el.attributes[key].value
    }
  }
  return res
}

export function createEle(option: {
  tag?: string
  content: string
  class?: string
  style?: string
  attrs?: DynamicObject
}) {
  const { tag = 'div', content, class: className = '', style = {} } = option
  const el = document.createElement(tag)
  el.innerText = content || ''
  el.className = className
  Object.assign(el.style, style)
  return el
}

export function getNumber(str: string | null | undefined): number {
  return Number((str || '').replace(/[^(\d|.)]/g, ''))
}

export function isEmpty(obj: object) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false
    }
  }
  return true
}

// https://www.benpickles.com/articles/51-finding-a-dom-nodes-common-ancestor-using-javascript
function parents(node: Node | null) {
  const nodes = []
  for (; node; node = node.parentNode) {
    nodes.unshift(node)
  }
  return nodes
}

export function commonAncestor(node1: Node, node2: Node) {
  const parents1 = parents(node1)
  const parents2 = parents(node2)

  if (parents1[0] !== parents2[0]) throw 'No common ancestor!'

  for (let i = 0; i < parents1.length; i++) {
    if (parents1[i] !== parents2[i]) return parents1[i - 1]
  }
}
