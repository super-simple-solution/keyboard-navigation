import { Pattern } from '@/types/local.d'
import { getEle } from '@/utils'

const keyCodeMap = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
}

export default class Navigate {
  pattern: Pattern = {} as Pattern
  enabled: boolean = false
  constructor(pattern: Pattern, auto_enable?: boolean) {
    this.pattern = pattern
    if (auto_enable) {
      this.enabled = true
    }
  }

  init() {
    document.addEventListener('keydown', keyPad(this.pattern), false)
  }
  undo() {
    document.removeEventListener('keydown', keyPad(this.pattern), false)
  }
}

// [attr~=value]  "value xxx"
// [attr|=value] "value-xxx"
// [attr^=value] "valuexxx"
// [attr$=value] "xxxvalue"
// [attr*=value] "xxxvaluexxx"
// [class^='value' i] i or s
// test url: https://postgrest.org/en/stable/releases/v10.2.0.html
function keyPad(pattern: Pattern) {
  return (e: KeyboardEvent) => {
    const code = e.code
    if (userEditing() || !pattern) return
    // selector priority
    const prevEle = getEleBySelectorList(pattern.prev_selector) as HTMLElement
    const nextEle = getEleBySelectorList(pattern.next_selector) as HTMLElement
    if (keyCodeMap.left.includes(code)) {
      prevEle && prevEle.click()
    } else if (keyCodeMap.right.includes(code)) {
      nextEle && nextEle.click()
    }
  }
}

function getEleBySelectorList(list: string[]) {
  let elRes
  for (const selector of list) {
    elRes = getEle(selector)
    if (elRes) break
  }
  return elRes
}

function userEditing() {
  const activeTarget = document.activeElement
  if (!activeTarget || activeTarget.tagName === 'BODY') return false
  return true
}
