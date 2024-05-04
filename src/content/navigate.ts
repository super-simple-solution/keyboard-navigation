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
      this.init()
    }
  }

  init() {
    this.enabled = true
    document.addEventListener('keydown', this.keyPad.bind(this), false)
  }
  undo() {
    this.enabled = false
    document.removeEventListener('keydown', this.keyPad.bind(this), false)
  }

  // [attr~=value]  "value xxx"
  // [attr|=value] "value-xxx"
  // [attr^=value] "valuexxx"
  // [attr$=value] "xxxvalue"
  // [attr*=value] "xxxvaluexxx"
  // [class^='value' i] i or s
  // test url: https://postgrest.org/en/stable/releases/v10.2.0.html
  keyPad(e: KeyboardEvent) {
    const code = e.code
    if (!this.enabled || !this.pattern || userEditing()) return
    // selector priority
    const prevEle = getEleBySelectorList(this.pattern.prev_selector) as HTMLElement
    const nextEle = getEleBySelectorList(this.pattern.next_selector) as HTMLElement
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

const INPUT_TAG = ['INPUT', 'TEXTAREA']
function userEditing() {
  const activeTarget = document.activeElement
  if (!activeTarget || !INPUT_TAG.includes(activeTarget.tagName)) return false
  return true
}
