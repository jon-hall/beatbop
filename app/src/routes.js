export default [
  {
    path: '/',
    name: 'home',
    component: require('components/home')
  },
  {
    path: '*',
    redirect: '/'
  }
]
