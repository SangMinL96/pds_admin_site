import { useMediaQuery } from '@material-ui/core'

function useMedia() {
  const media = {
    w800: useMediaQuery('(min-width:800px)'),
    w525: useMediaQuery('(min-width:525px)'),
    w490: useMediaQuery('(min-width:490px)'),
    w750: useMediaQuery('(min-width:750px)'),
    w665: useMediaQuery('(min-width:665px)'),
    w1691: useMediaQuery('(min-width:1691px)'),
    w1430: useMediaQuery('(min-width:1430px)'),
    w980: useMediaQuery('(min-width:980px)'),
    w500: useMediaQuery('(min-width:500px)'),
    w630: useMediaQuery('(min-width:630px)'),
    w1600: useMediaQuery('(min-width:1600px)'),
    w820: useMediaQuery('(min-width:820px)'),
    w1170: useMediaQuery('(min-width:1170px)'),
  }
  return [media]
}

export default useMedia
