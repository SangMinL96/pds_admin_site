import Axios from 'axios'
import fileDownload from 'js-file-download'
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'

export const ver = 'v1'
export const disabledHandler2 = subMitFlag => subMitFlag?.EDIT_FLAG === false && subMitFlag?.ADD_FLAG === false
export const validate = (error, getValues) => error !== undefined && getValues === ''
export const serviceValue = params => {
  if (params === '001') {
    return '어드민'
  } else if (params === '002') {
    return 'HIPONG'
  } else if (params === '003') {
    return 'DARTS'
  } else if (params === '001,002') {
    return '어드민,HIPONG'
  } else if (params === '001,003') {
    return '어드민,DARTS'
  } else if (params === '002,003') {
    return 'HIPONG,DARTS'
  } else if (params === '001,002,003') {
    return '어드민,HIPONG,DARTS'
  } else if (params === '000') {
    return '공통'
  }
}

export const userAuthValue = (authData, clickId) => {
  let newAutrId = authData !== undefined ? authData?.getAuthorization?.filter(item => item.AUTR_ID === clickId) : []
  return newAutrId.map(item => item.AUTR_NM)
}

export const fileUpload = async (filesObject, noticeId, refetch, SET_UI_INFO) => {
  const formPayload = new FormData()

  for (let i = 0; i < filesObject.length; i++) {
    formPayload.append('file', filesObject[i].file)
  }
  formPayload.append('FL_OWNR_ID', noticeId)
  formPayload.append('ver', 'v1')

  try {
    const result = await Axios.post(`${process.env.REACT_APP_API_GW_URL}/api/v1/files`, formPayload, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` || null },
      withCredentials: true,
    })
    if (result?.data?.rsltCd === 'OK') {
      refetch()
      if (SET_UI_INFO !== null) {
        SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
      }
    } else {
      toast.error('파일 업로드 실패하였습니다.')
    }
  } catch (e) {
    console.log(e)
  }
}

export const download = (url, filename) => {
  Axios.get(url, {
    responseType: 'blob',
  }).then(res => {
    fileDownload(res.data, filename)
  })
}

export const fileRemove = (ev, refetch, UI_INFO, SET_UI_INFO, resetInfo) => {
  const fileId = ev.target.ownerDocument.activeElement.id
  confirmAlert({
    title: '삭제',
    message: '정말 삭제 하시겠습니까?',
    buttons: [
      {
        label: '네',
        onClick: async () => {
          try {
            const result = await Axios.delete(`${process.env.REACT_APP_API_GW_URL}/api/v1/files?ver=v1`, {
              params: { FL_IDS: [fileId] },
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem('token')}` || null,
              },
              withCredentials: true,
            })

            if (result.data.rsltCd === 'OK') {
              toast.success('정상적으로 삭제 되었습니다.')
              const removeFile = UI_INFO.FILE_CHIPS.fileId.filter(file => file !== fileId)
              SET_UI_INFO(props => ({ ...props, FILE_CHIPS: { ...UI_INFO.FILE_CHIPS, fileId: removeFile }, SEL_FOCUS: true }))
              refetch()
              resetInfo()
            } else {
              toast.success('다시 시도해주세요.')
            }
          } catch (e) {
            console.log(e.error)
          }
        },
      },
      {
        label: '아니요',
      },
    ],
  })
}

export const fileload = async ev => {
  const fileId = ev.currentTarget.id
  const fileName = ev.target.innerText
  try {
    const result = await Axios.get(`${process.env.REACT_APP_API_GW_URL}/api/v1/files/${fileId}?ver=v1`, { withCredentials: true })

    if (result?.config?.url !== undefined) {
      const fileUrl = result?.config?.url
      download(fileUrl, fileName)
    }
    console.log(result)
  } catch (e) {
    console.log(e)
  }
}

export const onFileAdd = (file, UI_INFO, SET_UI_INFO) => {
  let dropFile = []
  for (let i = 0; i < file.length; i++) {
    dropFile.push({ ...file[i], id: UI_INFO.DROP_FILE.length + file[i].data })
  }
  SET_UI_INFO(props => ({ ...props, DROP_FILE: UI_INFO.DROP_FILE.concat(dropFile) }))
}
