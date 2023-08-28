import { initEventHandler } from '@/utils/extension-action'
import supabaseClient from '@/lib/supabase'

const dbTable = supabaseClient.from('pagination_selector')

const contentReq = {
  'to-get-pattern': toGetPattern,
  'to-save-detect-ele': toSaveDetectEle,
}

const syncHour = 3
async function toGetPattern({ forceUpdate = false, domain }, sendResponse) {
  let {
    pattern_list_updated_at,
    pattern_list: localPatternList,
    domain_list,
  } = await chrome.storage.local.get(['pattern_list_updated_at', 'pattern_list', 'domain_list'])
  localPatternList = localPatternList || []
  domain_list = domain_list || []
  const domainTarget = domain_list.find((item) => item === domain)
  const domainPattern = localPatternList.find((item) => item.domain === domain)
  if (
    !forceUpdate &&
    localPatternList.length &&
    pattern_list_updated_at &&
    ((domainTarget && domainPattern) || !domainTarget) &&
    Date.now() - pattern_list_updated_at <= 1000 * 60 * 60 * syncHour
  ) {
    if (!sendResponse) return
    sendResponse(domainPattern || localPatternList[0])
    return
  }
  const [{ data: patternList }, { data: domainList }] = await Promise.all([
    dbTable.select('domain,prev_selector,next_selector,updated_at').in('domain', domain ? [domain, '*'] : ['*']),
    dbTable.select('domain'),
  ])
  sendResponse && sendResponse(patternList.find((item) => item.domain === domain || '*'))
  chrome.storage.local.set({ pattern_list: patternList, domain_list: domainList, pattern_list_updated_at: Date.now() })
}

async function toSaveDetectEle(params) {
  const paginationRes = await dbTable.select('domain').eq('domain', params.domain)
  if (paginationRes.data.length) {
    const { data, error } = await dbTable.update(params).eq('domain', params.domain)
    console.log(data, error, 'update')
  } else {
    const { data, error } = await dbTable.insert(params)
    console.log(data, error, 'insert')
  }
}

function refreshPattern() {
  toGetPattern(true)
}
chrome.runtime.onInstalled.addListener(() => refreshPattern(true))

initEventHandler(contentReq)
