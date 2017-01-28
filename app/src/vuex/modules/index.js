const files = require.context('.', true, /index\.js$/)
const modules = {}

files.keys().forEach((key) => {
  if (key === './index.js') return
  modules[key.replace(/(\.\/|\/index\.js)/g, '')] = files(key).default
})

export default modules
