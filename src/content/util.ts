import { getEle } from '@/utils'
import { PatternData } from '@/types/local.d'

const keyCodeMap = {
  left: ['ArrowLeft', 'KeyA'],
  right: ['ArrowRight', 'KeyD'],
}

export function setKeyPad(pattern: PatternData) {
  document.addEventListener('keydown', keyPad(pattern), false)
}

export function removeKeyPad(pattern: PatternData) {
  document.removeEventListener('keydown', keyPad(pattern), false)
}

// [attr~=value]  "value xxx"
// [attr|=value] "value-xxx"
// [attr^=value] "valuexxx"
// [attr$=value] "xxxvalue"
// [attr*=value] "xxxvaluexxx"
// [class^='value' i] i or s
// test url: https://postgrest.org/en/stable/releases/v10.2.0.html
function keyPad(pattern: PatternData) {
  return (e: KeyboardEvent) => {
    const code = e.code
    if (userEditing() || !pattern) return
    // selector priority
    const prevEle = getEleBySelectorList(pattern.prev_selector)
    const nextEle = getEleBySelectorList(pattern.next_selector)
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
