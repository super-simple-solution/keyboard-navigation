import { initEventHandler } from '@/utils/extension-action'
import supabaseClient from '@/lib/supabase'

const contentReq = {
  'to-get-pattern': toGetPattern,
}

const syncHour = 3
async function toGetPattern({ forceUpdate = false, domain }, sendResponse) {
  let { pattern_list_updated_at, pattern_list: localPatternList } = await chrome.storage.local.get([
    'pattern_list_updated_at',
    'pattern_list',
  ])
  localPatternList = localPatternList || []
  if (
    !forceUpdate &&
    localPatternList.length &&
    pattern_list_updated_at &&
    Date.now() - pattern_list_updated_at <= 1000 * 60 * 60 * syncHour
  ) {
    sendResponse && sendResponse(localPatternList)
    return
  }
  const { data: patternList } = await supabaseClient
    .from('pagination_selector')
    .select('domain,prev_selector,next_selector,updated_at')
    .in('domain', domain ? [domain, '*'] : ['*'])
  console.log(patternList, 'patternList')
  sendResponse && sendResponse(patternList[0])
  chrome.storage.local.set({ pattern_list: patternList, pattern_list_updated_at: Date.now() })
}

function refreshPattern() {
  toGetPattern(true)
}

chrome.runtime.onInstalled.addListener(() => refreshPattern(true))

initEventHandler(contentReq)
