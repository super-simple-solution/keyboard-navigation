import { initEventHandler } from '@/utils/extension-action'
import supabaseClient from '@/lib/supabase'

function dbTable() {
  return supabaseClient.from('pagination_selector')
}

function configTable() {
  return supabaseClient.from('product')
}

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
    config,
  } = await chrome.storage.local.get(['pattern_list_updated_at', 'pattern_list', 'domain_list', 'config'])
  if (domain) {
    const specificDomain = config.localSpecificDomainList.find((item) => domain.includes(item))
    if (specificDomain) {
      domain = specificDomain
    }
  }
  config.localIgnoreDomainList = config.localIgnoreDomainList || []
  config.localSpecificDomainList = config.localSpecificDomainList || []
  localPatternList = localPatternList || []
  domain_list = domain_list || []
  if (ignoreDomain(domain, config.localIgnoreDomainList)) return
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
  const [{ data: patternList }, { data: domainList }, { data: productConfig }] = await Promise.all([
    dbTable()
      .select('domain,prev_selector,next_selector')
      .in('domain', domain ? [domain, '*'] : ['*']),
    dbTable().select('domain'),
    // find ignore domain
    configTable().select('ignore_domain_list', 'specific_domain_list').eq('product', 'keyboard-pagination'),
  ])
  if (ignoreDomain(domain, productConfig.ignore_domain_list)) return
  sendResponse && sendResponse(patternList.find((item) => item.domain === domain || '*'))
  chrome.storage.local.set({
    pattern_list: patternList,
    domain_list: domainList.map((item) => item.domain),
    pattern_list_updated_at: Date.now(),
    config: productConfig,
  })
}

function ignoreDomain(domain, domainList) {
  return domainList.includes((item) => domain.includes(item))
}

async function toSaveDetectEle(params, sendResponse) {
  const paginationRes = await dbTable().select('domain').eq('domain', params.domain)
  if (paginationRes.data.length) {
    const { data } = await dbTable().update(params).eq('domain', params.domain).select()
    sendResponse && sendResponse(data[0])
    refreshPattern()
  } else {
    const { data } = await dbTable().insert(params).select()
    sendResponse && sendResponse(data[0])
    refreshPattern()
  }
}

function refreshPattern() {
  toGetPattern({ forceUpdate: true })
}

chrome.runtime.onInstalled.addListener(refreshPattern)

initEventHandler(contentReq)
