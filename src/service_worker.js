import supabaseClient from '@/lib/supabase'
import { initEventHandler } from '@/utils/extension-action'

function dbTable() {
  return supabaseClient.from('pager')
}

const contentReq = {
  'to-get-pattern': toGetPattern,
  'to-save-detect-ele': toSaveDetectEle,
}

function domainMatch(domain) {
  return (item) => domain === item || domain.endsWith(item)
}

function domainPropertyMatch(domain, isGeneric = false) {
  return (item) => {
    const curDomain = item.domain
    const res = domain === curDomain || domain.endsWith(curDomain)
    return isGeneric ? res || curDomain === '*' : res
  }
}

const syncHour = 3
async function toGetPattern({ forceUpdate = false, domain = '' }, sendResponse) {
  let {
    pattern_list_updated_at,
    pattern_list: localPatternList = [],
    domain_list = [],
  } = await chrome.storage.local.get(['pattern_list_updated_at', 'pattern_list', 'domain_list'])
  // if (domain) {
  //   const specificDomain = config.localSpecificDomainList.find((item) => domain.includes(item))
  //   if (specificDomain) {
  //     domain = specificDomain
  //   }
  // }
  // config.localSpecificDomainList = config.localSpecificDomainList || []
  localPatternList = localPatternList || []
  domain_list = domain_list || []
  const domainTarget = domain_list.find(domainMatch)
  const domainPattern = localPatternList.find(domainPropertyMatch(domain))
  if (
    !forceUpdate &&
    localPatternList.length &&
    pattern_list_updated_at &&
    ((domainTarget && domainPattern) || !domainTarget) &&
    Date.now() - pattern_list_updated_at <= 1000 * 60 * 60 * syncHour
  ) {
    if (!sendResponse) return
    sendResponse(domainPattern || localPatternList.domainPattern.find((item) => item.domain === '*'))
    return
  }
  const [{ data: patternList }, { data: domainList }] = await Promise.all([
    dbTable()
      .select('domain,prev_selector,next_selector')
      .in('domain', domain ? [domain, domain.match(/[^.]+\.\w+$/)[0], '*'] : ['*']),
    dbTable().select('domain'),
  ])
  sendResponse?.(patternList.find(domainPropertyMatch(domain, true)))
  chrome.storage.local.set({
    pattern_list: patternList,
    domain_list: domainList.map((item) => item.domain),
    pattern_list_updated_at: Date.now(),
  })
}

async function toSaveDetectEle(params, sendResponse) {
  const paginationRes = await dbTable().select('domain').eq('domain', params.domain)
  if (paginationRes.data.length) {
    const { data } = await dbTable().update(params).eq('domain', params.domain).select()
    sendResponse?.(data[0])
    refreshPattern()
  } else {
    const { data } = await dbTable().insert(params).select()
    sendResponse?.(data[0])
    refreshPattern()
  }
}

function refreshPattern() {
  toGetPattern({ forceUpdate: true })
}

chrome.runtime.onInstalled.addListener(refreshPattern)

initEventHandler(contentReq)
