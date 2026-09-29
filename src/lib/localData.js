import {
  alertStats,
  alerts,
  availableReports,
  forestZoneStats,
  forestZones,
  hectaresSavedMonthly,
  liveThreatFeed,
  nodeList,
  notificationSettings,
  overviewStats,
  reportStats,
  satelliteNodes,
  sensorMapStats,
  sensorRegistry,
  sensorUnitStats,
  shortcuts,
  threatsVsResolved,
  zoneDistribution
} from '../data/mockData.js'

const localData = {
  '/overview': {
    overviewStats,
    shortcuts,
    threatActivity: threatsVsResolved,
    liveThreatFeed,
    satelliteNodes,
    zoneDistribution,
    meta: { totalThreats: 23, resolvedPct: 78 }
  },
  '/sensor-map': { sensorMapStats, nodeList, satelliteNodes },
  '/alerts': { alertStats, alerts },
  '/forest-zones': { forestZoneStats, forestZones },
  '/sensors': { sensorUnitStats, sensorRegistry },
  '/reports': { reportStats, threatsVsResolved, hectaresSavedMonthly, availableReports },
  '/settings': { notificationSettings }
}

export function getLocalData(path) {
  return localData[path]
}

export function formatZoneLabel(location) {
  const match = String(location ?? '').match(/\bZone\s*0*(\d+)\b/i)
  return match ? `Zone${match[1].padStart(3, '0')}` : 'Unknown zone'
}