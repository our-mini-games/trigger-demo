import CentralControlSystem from './modules/CentralControlSystem'

const centralControlSystem = new CentralControlSystem(document.querySelector<HTMLElement>('#app')!)

centralControlSystem.init()

centralControlSystem.run()

document.querySelector('#btn')!.addEventListener('click', () => {
  centralControlSystem.pause()
})
