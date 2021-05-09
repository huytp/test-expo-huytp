import _ from 'lodash'
import authenticate from '../authenticate'
import axios from 'react-native-axios'

function api (url: string, _method = 'GET', data = {}) {
  const method = _.upperCase(_method)
  const auth = authenticate.get()
  const headers = {
    'Content-Type': 'application/json;charset=utf-8',
    'access-token': auth.accessToken,
    client: auth.clientId,
    uid: auth.uid,
  }
  switch (method) {
    case 'POST':
    case 'PUT':
    case 'DELETE':
      return axios(url, {
        method,
        headers,
        data,
      }).then((response: any) => { return response })
    case 'GET':
      return axios(url, {
        method,
        headers,
      }).then((response: any) => { return response })
    default:
      break
  }
}

export default api
