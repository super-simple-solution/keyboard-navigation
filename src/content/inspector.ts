import { createEle } from '@/utils'

export function inspect() {
  createLayer()
}

function createLayer() {
  const container = createEle({
    tag: 'div',
    content: '',
    class: '',
  })
  document.body.appendChild(container)
}
