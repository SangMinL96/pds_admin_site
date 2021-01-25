import Axios from 'axios'



export const netError = async (errStatus, operation) => {
  let netWorkError = errStatus
  if (netWorkError === 401) {
    try {
      const token = await Axios.get(process.env.REACT_APP_API_GW_URL + '/api/v1/getToken', {
        withCredentials: true,
      })
      if (token.statusText === 'OK') {
       if(operation !==undefined){
         operation.setContext(({ headers = {} }) => ({
          headers: { ...headers, Authorization: `Bearer ${token.data.accessToken}` || null },
        }))
       } 
        sessionStorage.setItem('token', token.data.accessToken)
        return 'OK'
      } else {
        sessionStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.reload()
      }
    } catch (e) {
      console.log(e)
      sessionStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      window.location.reload()
    }
  } else if (netWorkError === 400) {
    sessionStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    window.location.reload()
  } else if (netWorkError === 403) {
    sessionStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    window.location.reload()
  } else if (netWorkError === 500) {
    return null
  }
}
