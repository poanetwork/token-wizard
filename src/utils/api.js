import { GAS_PRICE } from './constants'

export const gasPriceValues = (endpoint = '') => {
  return fetch(`${GAS_PRICE.API.URL}/${endpoint}`)
    .then(response => response.json())
}
