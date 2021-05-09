import _ from 'lodash'
import jwt from 'jsonwebtoken'

const authenticate = () => {
  let keep = {}
  const privateKey = 'SsLcCZsLcz'

  const get = () => {
    try {
      // Get from closure
      if (!_.isEmpty(keep)) return keep

      // Or get from local storage
      let localStore = localStorage.getItem('keep')
      if (!_.isEmpty(localStore)) {
        localStore = jwt.verify(localStore, privateKey)
        return localStore
      }

      // Nothing
      return {}
    } catch (e) {
      del()
      return {}
    }
  }

  const set = (token: string) => {
    try {
      keep = _.isEmpty(token) ? {} : token
      const jwtToken = jwt.sign(keep, privateKey)
      localStorage.setItem('keep', jwtToken)
      return true
    } catch (e) {
      del()
    }
  }

  const del = () => {
    keep = {}
    localStorage.removeItem('keep')
    return true
  }

  const isAuth = () => {
    const accessToken = _.get(get(), 'accessToken')
    if (_.isEmpty(accessToken)) return false

    const clientId = _.get(get(), 'clientId')
    if (_.isEmpty(clientId)) return false

    const uid = _.get(get(), 'uid')
    if (_.isEmpty(uid)) return false

    return true
  }

  return {
    get,
    set,
    del,
    isAuth,
  }
}

const auth = authenticate()

export default auth
