import { useReducer, useEffect } from 'react'
import axios from 'axios'

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null,
      }
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null,
      }

    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error,
      }
    default:
      return state
  }
}
function useAxiosGet(URL, deps = []) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null,
  })
  const fatchData = async () => {
    dispatch({ type: 'LOADING' })
    try {
      const response = await axios.get(URL)
      dispatch({ type: 'SUCCESS', data: response.data })
    } catch (e) {
      dispatch({ type: 'ERROR', error: e })
    }
  }
  useEffect(() => {
    fatchData()
    //eslint-disable-next-line
  }, deps)
  return [state, fatchData]
}
export default useAxiosGet
