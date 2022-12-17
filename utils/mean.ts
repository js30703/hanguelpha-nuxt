export function cutFixed(num:any, fixed = 2) {
  if (typeof(num) === 'string' ) {
    num = num.replaceAll(' ','').replaceAll(',','').replaceAll('억','')
    num = num.includes('조') ?  Number(num.split('조')[0]) * 10000 + Number(num.split('조')[1]) : Number(num)
    if (num == Number.NaN ) return 0
  }
  return Number(num.toFixed(fixed))
}

export function getStandardDeviation (array) {
    const n = array.length
    const mean = cutFixed((array.reduce((a, b) => a + b) / n))
    const deviations = cutFixed(Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n))
    return [mean , deviations]
  }
// check array is decreasing
export function isDecreasing(array) {
    return array.every((item, index, array) => {
      const last = array[index - 1]
      const now = item
      return (index === 0 || item === Number.NaN ) || now <= last
    })
  }

