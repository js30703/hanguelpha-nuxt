export function cutFixed(num:number | string, fixed = 2) {
  if (typeof(num)=== 'string') {
    num = Number(num.replaceAll(' ','').replaceAll(',','').replaceAll('억','').replaceAll('조',''))
  }
  return Number(num.toFixed(fixed))
}

export function getStandardDeviation (array) {
    const n = array.length
    const mean = cutFixed((array.reduce((a, b) => a + b) / n))
    const deviations = cutFixed(Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n))
    return [mean , deviations]
  }
