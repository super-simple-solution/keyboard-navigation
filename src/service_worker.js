import { initEventHandler } from '@/utils/extension-action'
import supabaseClient from '@/lib/supabase'

const contentReq = {
  'to-get-pattern': toGetPattern,
  'to-save-detect-ele': toSaveDetectEle,
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

async function toSaveDetectEle(params) {
  const paginationRes = await supabaseClient.from('pagination_selector').select().eq('domain', params.domain)
  if (paginationRes.data.length) {
    const { data, error } = await supabaseClient.from('pagination_selector').update(params).eq('domain', params.domain)
    console.log(data, error, 'update')
  } else {
    const { data, error } = await supabaseClient.from('pagination_selector').insert(params)
    console.log(data, error, 'insert')
  }
}

function refreshPattern() {
  toGetPattern(true)
}
chrome.runtime.onInstalled.addListener(() => refreshPattern(true))

initEventHandler(contentReq)
