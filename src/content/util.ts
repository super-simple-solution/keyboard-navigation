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
  if (!pattern) return
  const prevEle = getEle(pattern.prev_selector.join())
  const nextEle = getEle(pattern.next_selector.join())
  if (keyCodeMap.left === e.code) {
    prevEle && prevEle.click()
  } else if (keyCodeMap.right === e.code) {
    nextEle && nextEle.click()
    console.log(nextEle, 'nextEle')
  }
}
