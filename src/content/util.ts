import { getEle } from '@/utils'
import { PatternData } from '@/types/local.d'

const keyCodeMap = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
}

export function setKeypad(pattern: PatternData) {
  document.addEventListener('keydown', (e) => keypad(e, pattern), false)
}

// [attr~=value]  "value xxx"
// [attr|=value] "value-xxx"
// [attr^=value] "valuexxx"
// [attr$=value] "xxxvalue"
// [attr*=value] "xxxvaluexxx"
// [class^='value' i] i or s
// https://postgrest.org/en/stable/releases/v10.2.0.html
function keypad(e: KeyboardEvent, pattern: PatternData) {
  if (userEditing() || !pattern) return
  // selector priority
  const prevEle = getElBySelectorList(pattern.prev_selector)
  const nextEle = getElBySelectorList(pattern.next_selector)
  if (keyCodeMap.left === e.code) {
    prevEle && prevEle.click()
  } else if (keyCodeMap.right === e.code) {
    nextEle && nextEle.click()
    console.log(nextEle, 'nextEle')
  }
}

function getElBySelectorList(list: string[]) {
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
