import { helper } from '@ember/component/helper';

const mapping = [
  [11.25, 'N'],
  [33.75, 'NNE'],
  [56.25, 'NE'],
  [78.75, 'ENE'],
  [101.25, 'E'],
  [123.75, 'ESE'],
  [146.25, 'SE'],
  [168.75, 'SSE'],
  [191.25, 'S'],
  [213.75, 'SSW'],
  [236.25, 'SW'],
  [258.75, 'WSW'],
  [281.25, 'W'],
  [303.75, 'WNW'],
  [326.25, 'NW'],
  [348.75, 'NNW'],
  [361, 'N']
];

export function formatWindDirection([value, units]) {
  if (units === undefined || value === undefined) {
    return '';
  } else if (units === '°' || units === 'degree') {
    for(let i = 0; i < mapping.length; i++) {
      let map = mapping[i];
      if (value < map[0]) {
        return map[1];
      }
    }
  } else {
    console.warn('Unknown units for wind direction, no formatting will be applied.', value, units);
    return `${value}${units}`;
  }
}

export default helper(formatWindDirection);
