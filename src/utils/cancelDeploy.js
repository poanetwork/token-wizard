import { cancellingIncompleteDeploy } from './alerts'

const cancelDeploy = () => {
  return cancellingIncompleteDeploy()
    .then(result => {
      if (result.value) {
        localStorage.clear()
        window.location = '/' // go to home
      }

      return result.value
    })
}

export default cancelDeploy
