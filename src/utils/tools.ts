export const getRandomId = (suffix = '') => {
  return `${suffix ? `${suffix}_` : ''}${Math.random().toString().substring(2, 8)}`
}