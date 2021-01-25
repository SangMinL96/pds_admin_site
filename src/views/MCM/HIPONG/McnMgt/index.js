import React, { forwardRef, useEffect, useState } from 'react'
//###########Material-UI IMPORT ################//
import Page from 'src/components/Page'
import {
  Box,
  Button,
  Card,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
  Container,
  makeStyles,
  CardContent,
  FormHelperText,
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core'
import { AddBox, Check, Clear, DeleteOutline, Edit } from '@material-ui/icons'
import MaterialTable, { MTableEditField, MTableToolbar } from 'material-table'
//################################################//
//########### Material-UI Date Pickers IMPORT #######//
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Moment from 'moment'
//#####################################################//

import QRCode from 'qrcode.react'

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import {
  GET_MCN_DATA,
  GET_DTL_STT_DATA,
  ADD_MCN_STT_ITM,
  EDIT_MCN_STT_ITM,
  INIT_MCN_STT_ITM,
  DEL_MCN_STT_ITM,
  GET_DTL_STT_ITM_DATA,
  SVC_CD_CODE,
  MCN_MDL_CODE,
  GET_MCN_PART_DATA,
  ADD_MCN_PART,
  EDIT_MCN_PART,
  DEL_MCN_PART,
  GET_MCN_STT_DATA,
  ADD_MCN,
  EDIT_MCN,
  DEL_MCN,
  PART_CODE,
  PART_TP_CODE,
} from './McnQuery'
//###################################################//

//############ toast (알림창) 라이브러리 IMPORT #############//
import { toast } from 'react-toastify'
//#####################################################//

//############### AG-GRID IMPORT #######################//
import { AgGridReact } from 'ag-grid-react/lib/agGridReact'
//######################################################//

//############## confirm 라이브러리 IMPORT ################//
import { confirmAlert } from 'react-confirm-alert'
//########################################################//

//############# react-hook-form IMPORT ################//
import { useForm } from 'react-hook-form'
//###################################################//

//############## SRC IMPORT   ##################//
import { disabledHandler2, validate, ver } from 'src/components/Utils'
import useMedia from 'src/components/useMedia'

//##############################################//

//############### CSS ####################//
const useStyles = makeStyles(theme => ({
  page: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  table: {
    width: '60%',
  },
  detail: {
    width: '39%',
  },
  //################# SEARCH CSS ##################//
  searchBox: {
    position: 'relative',
    zIndex: 1,
  },
  searchCard: {
    padding: '0.8em',
    overflow: 'visible',
    '& form': {
      justifyContent: 'space-between',
      display: 'flex',
    },
  },
  formBox: {
    width: '80%',
    marginRight: '5em',
  },
  formInputWidth: {
    width: '240px',
  },
  srchBtn: theme.searchBtn,
  w490searchCard: {
    padding: '0.8em',
    overflow: 'visible',
    '& form': {},
  },
  w490srchBtn: {
    width: '100%',
    marginTop: '1em',
  },
  //############################################//

  //############ Grig CSS ######################//
  tableBtn: theme.tableBtn,
  TopBarBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: ' 46px',

    backgroundColor: '#ffffff',
    border: '1px solid #babfc7',
    ...theme.tableText,
  },
  //############################################//

  //################### Detail CSS ###############//

  dtlBtn: theme.detailBtn,
  w525dtlBtn: {
    marginTop: '0.5em',
  },
  detailsHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  detailsHeaderTitle: theme.detailTitle,
  detailsBtnBox: {
    position: 'relative',
    width: '50%',
    marginTop: '0.5em',
    marginRight: '1.4em',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  inputCardContent: {
    width: '100%',
    height: '700px',
  },
  qrCodeBox: {
    position: 'relative',
    border: '1px solid #BABFC7',
    borderRadius: '5px',
    height: '165px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& div': {
      position: 'absolute',
      background: '#FFFFFF',
      padding: '5px',
      top: '-12px',
      left: '10px',
      fontSize: '0.7rem',
      color: ' #546E7A',
    },
  },
  tabsBtnBox: {
    backgroundColor: ' #4c90af',
    borderTopRightRadius: '10px',
    borderTopLeftRadius: '10px',

    minHeight: '25px',
    minWidth: '50%',
  },

  W800detailBox: {
    marginBottom: '1em',
  },
  w525detailsBtnBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    padding: '1em',
  },
}))
//#########################################//

const McnView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  const [tabValue, setTabValue] = useState(0)
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)
  const McnCloumns = [
    {
      headerName: '서비스',
      field: 'SVC_NM',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: '모델명',
      field: 'MCN_MDL_NM',
    },
    {
      headerName: '시리얼 번호',
      field: 'MCN_SR_NO',
    },
    {
      headerName: 'MAC Address',
      field: 'MAC_ADDR',
    },
    {
      headerName: '등록일',
      field: 'REG_DT',
    },
    {
      headerName: '수정일',
      field: 'UPD_DT',
    },
  ]

  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    width: 190,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }

  //##############################################//

  //################ SHOP_MGT STATE ################/
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    SVC_CD: '',
    MCN_MDL_CD: '',
    MCN_SR_NO: '',
    MAC_ADDR: '',
    STRT_REG_DT: '',
    STRT_UPD_DT: '',
  })
  const [DTL_DATA, SET_DTL_DATA] = useState({
    MCN_ID: undefined,
    MCN_MDL_CD: '',
    MCN_SR_NO: '',
    MAC_ADDR: '',
    SVC_CD: '',
    MCN_MDL_NO: '',
    W_SZ: '',
    H_SZ: '',
    D_SZ: '',
  })
  const [UI_INFO, SET_UI_INFO] = useState({
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    DEL_MCN_ID: [],
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
    DTL_STTG_ITM_URP: undefined,
    QR_SVC_CD: '',
    QR_SVC_URL: '',
  })
  //#######################################/

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { register: srchRegister, handleSubmit: srchSubmit } = useForm()
  const { register: dtlRegister, handleSubmit: dtlSubmit, reset, errors, setValue, getValues } = useForm()
  //#################################################################//

  //############### 공통함수 #################//
  const resetInfo = () => {
    SET_UI_INFO(props => ({
      ...props,
      ADD_FLAG: false,
      EDIT_FLAG: false,
      INPUT_READ_ONLY: false,
      INPUT_VARIDATE: false,
      DTL_STTG_ITM_URP: undefined,
    }))
  }
  const resetDtl = () => {
    SET_DTL_DATA(props => ({
      ...props,
      MCN_ID: undefined,
      MCN_SR_NO: '',
      MAC_ADDR: '',
      MCN_MDL_NO: '',
      W_SZ: '',
      H_SZ: '',
      D_SZ: '',
      SVC_CD: '',
      MCN_MDL_CD: '',
    }))
    reset()
  }
  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: svc_code } = useQuery(SVC_CD_CODE)
  const { data: mcn_mdl_code } = useQuery(MCN_MDL_CODE)
  const { data: LOAD_DTL_STT_ITM_DATA, refetch: DTL_STT_ITM_REFETCH } = useQuery(GET_DTL_STT_ITM_DATA, {
    skip: UI_INFO.DTL_STTG_ITM_URP === undefined,
    variables: { param: { MCN_STTG_ID: UI_INFO.DTL_STTG_ITM_URP }, ver },
  })
  const { data: part_code } = useQuery(PART_CODE)
  const { data: part_tp_code } = useQuery(PART_TP_CODE)
  const { data: LOAD_DTL_STT_DATA } = useQuery(GET_DTL_STT_DATA, { variables: { param: {}, ver } })
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//

  //#### MCN CRUD ###//
  const [LOAD_MCN, { data: LOAD_MCN_DATA }] = useLazyQuery(GET_MCN_DATA, {
    variables: { param: SRCH_DATA, ver },
    fetchPolicy: 'network-only',
  })
  const { data: LOAD_MCN_PART_DATA,refetch:MCN_PART_REFETCH } = useQuery(GET_MCN_PART_DATA, {
    skip: DTL_DATA.MCN_ID === undefined,
    variables: { MCN_ID: DTL_DATA.MCN_ID, ver },
  })
  const { data: LOAD_MCN_STT_DATA,refetch:MCN_STT_REFETCH } = useQuery(GET_MCN_STT_DATA, {
    skip: DTL_DATA.MCN_ID === undefined,
    variables: { MCN_ID: DTL_DATA.MCN_ID, ver },
  })
  const [MCN_ADD_MTT] = useMutation(ADD_MCN, {
    //신규 추가 뮤테이션
    variables: {
      param: { ...DTL_DATA, MCN_ID: undefined },
      ver,
    },
  })
  const [MCN_EDIT_MTT] = useMutation(EDIT_MCN, {
    //데이터 수정 뮤테이션
    variables: {
      param: { ...DTL_DATA, MCN_ID: undefined },
      ver,
    },
  })
  const [MCN_DEL_MTT] = useMutation(DEL_MCN, { variables: { param: { MCN_IDS: UI_INFO.DEL_MCN_ID }, ver } })
  //################//

  //#### MCN PART CRUD ###//
  const [ADD_MCN_PART_MTT] = useMutation(ADD_MCN_PART)
  const [EDIT_MCN_PART_MTT] = useMutation(EDIT_MCN_PART)
  const [DEL_MCN_PART_MTT] = useMutation(DEL_MCN_PART)
  //######################//
  //#### MCN STT_ITM CRUD ###//
  const [ADD_MCN_STT_ITM_MTT] = useMutation(ADD_MCN_STT_ITM)
  const [EDIT_MCN_STT_ITM_MTT] = useMutation(EDIT_MCN_STT_ITM)
  const [DEL_MCN_STT_ITM_MTT] = useMutation(DEL_MCN_STT_ITM)
  const [INIT_MCN_STT_ITM_MTT] = useMutation(INIT_MCN_STT_ITM)
  //######################//
  //#############################################################//

  //################# useEffect ####################//
  
  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node => node.setSelected(node.data.MCN_ID === DTL_DATA.MCN_ID))
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }
  }, [
    UI_INFO.SEL_FOCUS,
    GRID_API,
    LOAD_MCN,
    DTL_DATA.MCN_MDL_CD_LST,
    DTL_STT_ITM_REFETCH,
    DTL_DATA.MCN_ID,
    LOAD_MCN_DATA,
 
  ])
  //#################################################//

  //##############  SRCH_EVENT   ##################//
  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_MCN useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    SET_SRCH_DATA(props => ({ ...props, ...datas }))
    LOAD_MCN()
    resetInfo()
    resetDtl()
  }
  //###################################################//

  //##################   GRID_EVENT    ##################//

  /**
   * 그리드 데이터 선택 함수.
   * 디스패치 실행시켜 Detail컴포넌트에게 클릭한 데이터를 보냄
   * @param {object} ev 데이터 선택시 해당 공지사항 데이터를 받아옴.
   */
  const onRowClickd = ev => {
    setValue('MCN_SR_NO', ev?.data?.MCN_SR_NO)
    setValue('MAC_ADDR', ev?.data?.MAC_ADDR)
    setValue('GME_RND_VAL', ev?.data?.GME_RND_VAL)
    setValue('MCN_MDL_NO', ev?.data?.MCN_MDL_NO)
    setValue('W_SZ', ev?.data?.W_SZ)
    setValue('H_SZ', ev?.data?.H_SZ)
    setValue('D_SZ', ev?.data?.D_SZ)
    setValue('MCN_MDL_DESC', ev?.data?.MCN_MDL_DESC)
    SET_DTL_DATA(props => ({ ...props, SVC_CD: ev?.data?.SVC_CD, MCN_MDL_CD: ev?.data?.MCN_MDL_CD, MCN_ID: ev?.data?.MCN_ID }))
    resetInfo()
  }

  /**
   * onRowClickd함수에서 ChackBox클릭시 row 데이터를 받아오지 못하는 오류가 발생.
   * 그래서 row선택이 되면 전체를 인지하고 데이터를 받아올수있는 함수추가.
   * 이함수는 다수의 데이터를 클릭하여 삭제하는 이벤트와 수정시 해당 데이터를 포커싱하는 이벤트을 담당
   * @param {object} ev 선택된 데이터의 데이터 값
   */
  const onRowSelected = ev => {
    const clickData = GRID_API.getSelectedRows().map(data => data.MCN_ID)
    SET_UI_INFO(props => ({ ...props, DEL_MCN_ID: clickData }))
  }

  /**
   * 데이터 삭제 함수
   */
  const onRemove = () => {
    confirmAlert({
      title: '삭제',
      message: '정말 삭제 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: async () => {
            try {
              const result = await MCN_DEL_MTT()
              if (result.data.delMachine.rsltCd === 'OK') {
                toast.success('정상적으로 삭제 되었습니다.')
                resetDtl()
                resetInfo()
                LOAD_MCN()
              } else {
                toast.error('오류가 발생했습니다.')
              }
            }  catch (err) {
              resetInfo()
              toast.error(`${err} 오류가 발생했습니다.`)
          }
          },
        },
        {
          label: '아니요',
        },
      ],
    })
  }
  //#################################################//

  //##############   DTL_EVENT    ##################//
  const inputReset = () => {
    SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, ADD_FLAG: true, EDIT_FLAG: false }))
    resetDtl()
    GRID_API.deselectAll()
  }

  /**
   * 수정 클릭시 useState이용한 상태 변경 함수
   */
  const editClick = () => {
    if (getValues('MCN_ID') !== '') {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, EDIT_FLAG: true, ADD_FLAG: false }))
    } else {
      toast.error(`수정을 원하는 게임을 클릭해주세요.`)
    }
  }

  /**
   * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시
   * submit Flag의 따라 실행되는 함수.
   * @param {object} data 인풋 데이터
   */
  const onSubmitDtl = async datas => {
    await SET_DTL_DATA(props => ({
      ...props,
      ...datas,
      W_SZ: Number(datas?.W_SZ),
      H_SZ: Number(datas?.H_SZ),
      D_SZ: Number(datas?.D_SZ),
    })) //subMit인풋 데이터
    if (DTL_DATA.MCN_MDL_CD === '') {
      toast.error('모델명을 선택해주세요.')
    } else {
      if (UI_INFO?.ADD_FLAG === true) {
        //신규 subMit 실행 함수
        try {
          const result = await MCN_ADD_MTT()
          console.log(result)
          if (result.data.saveMachine.rsltCd === 'OK') {
            toast.success('성공적으로 추가 되었습니다.')
            LOAD_MCN()
            resetDtl()
            resetInfo()
          } else {
            toast.error('오류가 발생했습니다.')
            resetDtl()
            resetInfo()
          }
        }  catch (err) {
          resetInfo()
          toast.error(`${err} 오류가 발생했습니다.`)
      }
      }

      if (UI_INFO?.EDIT_FLAG === true) {
        //수정 subMit 실행 함수
        try {
          const result = await MCN_EDIT_MTT()
          console.log(result)
          if (result.data.saveMachine.rsltCd === 'OK') {
            toast.success('성공적으로 수정 되었습니다.')
            LOAD_MCN()
            resetInfo()
            SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
          } else {
            resetInfo()
            toast.error('오류가 발생했습니다.')
          }
        }  catch (err) {
          resetInfo()
          toast.error(`${err} 오류가 발생했습니다.`)
      }
      }
    }
  }

  //############### DTL TABS #################//

  function TabsContent(props) {
    const { children, value, index } = props

    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box>{children}</Box>}
      </div>
    )
  }

  //######################################################//

  //############ TABS IN  MCN_PART #######################//
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  }
  const mcnPartColumns = [
    {
      title: '부품타입',
      field: 'PART_TP_CD',
      cellStyle: { textAlign: 'center' },
      width: '40%',
      lookup: part_tp_code?.getCode?.reduce(function(acc, cur) {
        acc[cur.COM_CD] = cur.COM_CD_NM
        return acc
      }, {}),
    },
    {
      title: '부품명',
      field: 'PART_CD',
      cellStyle: { textAlign: 'center' },
      width: '30%',
      lookup: part_code?.getCode?.reduce(function(acc, cur) {
        acc[cur.COM_CD] = cur.COM_CD_NM
        return acc
      }, {}),
    },
    {
      title: '교환일',
      field: 'PART_XCHG_DT',
      cellStyle: { textAlign: 'center' },
      width: '30%',
      editComponent: props => (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            invalidDateMessage={false}
            autoOk
            variant="inline"
            inputVariant="outlined"
            format="yyyy-MM-dd"
            onChange={props.onChange}
            value={props.value}
            size="small"
          />
        </MuiPickersUtilsProvider>
      ),
    },
  ]
  /**
   * 데이터 추가 함수
   */

  const onPartAdd = async newData => {
    const PART_TP_CD_RDC = LOAD_MCN_PART_DATA.getMachinePart.filter(item => item.PART_TP_CD === newData.PART_TP_CD)

    if (PART_TP_CD_RDC.filter(items => items.PART_CD === newData.PART_CD).length !== 0) {
      toast.error('이미 등록된 부품이 있습니다.')
    } else {
      try {
        const result = await ADD_MCN_PART_MTT({
          variables: {
            param: {
              MCN_ID: DTL_DATA.MCN_ID,
              PART_TP_CD: newData?.PART_TP_CD,
              PART_CD: newData?.PART_CD,
              PART_XCHG_DT: Moment(newData?.PART_XCHG_DT).format('YYYY.MM.DD'),
            },
            ver,
          },
        })

        if (result.data.saveMachinePart.rsltCd === 'OK') {
          toast.success('성공적으로 추가 되었습니다.')
          MCN_PART_REFETCH()
        } else {
          toast.error('오류 발생 했습니다.')
        }
      }  catch (err) {
        resetInfo()
        toast.error(`${err} 오류가 발생했습니다.`)
    }
    }
  }
  /**
   * 데이터 저장 함수
   */
  const onEditPart = async (newData, oldData) => {
    if (newData.PART_TP_CD !== oldData.PART_TP_CD || newData.PART_CD !== oldData.PART_CD) {
      toast.error('부품 수정은 교환일만 가능합니다.')
    } else {
      try {
        const result = await EDIT_MCN_PART_MTT({
          variables: {
            param: {
              MCN_ID: newData?.MCN_ID,
              PART_TP_CD: newData?.PART_TP_CD,
              PART_CD: newData?.PART_CD,
              PART_XCHG_DT: Moment(newData?.PART_XCHG_DT).format('YYYY.MM.DD'),
            },
            ver,
          },
        })
        if (result.data.saveMachinePart.rsltCd === 'OK') {
          toast.success('성공적으로 저장 되었습니다.')
          MCN_PART_REFETCH()
        } else {
          toast.error('오류 발생 했습니다.')
        }
      }  catch (err) {
        resetInfo()
        toast.error(`${err} 오류가 발생했습니다.`)
    }
    }
  }
  /**
   * 데이터 삭제 함수
   */
  const onPartRemove = async oldData => {
    try {
      const result = await DEL_MCN_PART_MTT({
        variables: {
          MCN_ID: oldData?.MCN_ID,
          PART_TP_CD: oldData?.PART_TP_CD,
          PART_CD: oldData?.PART_CD,
          ver,
        },
      })

      if (result.data.delMachinePart.rsltCd === 'OK') {
        toast.success('성공적으로 삭제 되었습니다.')
        MCN_PART_REFETCH()
      } else {
        toast.error('오류 발생 했습니다.')
      }
    }  catch (err) {
      resetInfo()
      toast.error(`${err} 오류가 발생했습니다.`)
  }
  }

  //#########################################################//

  //############### MCN STT TABS ############################//
  const mcnSttColumns = [
    { title: '설정 ID', field: 'MCN_STTG_ITM_ID', cellStyle: { textAlign: 'center' }, width: '20%' },
    { title: '설정 항목', field: 'MCN_STTG_ITM_NM', cellStyle: { textAlign: 'center' }, width: '20%' },
    { title: '설정값', field: 'MCN_STTG_ITM_VAL', cellStyle: { textAlign: 'center' }, width: '30%' },
    {
      title: '로컬설정여부',
      field: 'MCN_LCL_UPD_YN',
      cellStyle: { textAlign: 'center' },
      width: '30%',
      lookup: { Y: 'Y', N: 'N' },
    },
  ]
  /**
   * 데이터 추가 함수
   */
  const onSttAdd = async newData => {
    if (!LOAD_MCN_STT_DATA) {
      toast.error('추가를 원하는 머신을 선택해주세요.')
    } else {
      if (
        LOAD_MCN_STT_DATA?.getMachineSettingItemL?.filter(items => items.MCN_STTG_ITM_ID === newData.MCN_STTG_ITM_ID).length !== 0
      ) {
        toast.error('이미 등록된 설정이 있습니다.')
      } else {
        try {
          const result = await ADD_MCN_STT_ITM_MTT({
            variables: {
              param: {
                MCN_ID: DTL_DATA.MCN_ID,
                MCN_STTG_ITM_ID: newData?.MCN_STTG_ITM_ID,
                MCN_STTG_ITM_NM: newData?.MCN_STTG_ITM_NM,
                MCN_STTG_ITM_VAL: newData?.MCN_STTG_ITM_VAL,
                MCN_LCL_UPD_YN: newData?.MCN_LCL_UPD_YN,
              },
              ver,
            },
          })

          if (result.data.saveMachineSttgItemL.rsltCd === 'OK') {
            toast.success('성공적으로 추가 되었습니다.')
            MCN_STT_REFETCH()
          } else {
            toast.error('오류 발생 했습니다.')
          }
        }  catch (err) {
          resetInfo()
          toast.error(`${err} 오류가 발생했습니다.`)
      }
      }
    }
  }
  /**
   * 데이터 저장 함수
   */
  const onSttEdit = async (newData, oldData) => {
    try {
      const result = await EDIT_MCN_STT_ITM_MTT({
        variables: {
          param: {
            MCN_ID: DTL_DATA.MCN_ID,
            MCN_STTG_ITM_ID: oldData?.MCN_STTG_ITM_ID,
            MCN_STTG_ITM_NM: newData?.MCN_STTG_ITM_NM,
            MCN_STTG_ITM_VAL: newData?.MCN_STTG_ITM_VAL,
            MCN_LCL_UPD_YN: newData?.MCN_LCL_UPD_YN,
          },
          ver,
        },
      })

      if (result.data.saveMachineSttgItemL.rsltCd === 'OK') {
        if (newData?.MCN_STTG_ITM_ID !== oldData?.MCN_STTG_ITM_ID) {
          toast.success('ID를 제외한 항목이 성공적으로 수정 되었습니다.')
        } else {
          toast.success('성공적으로 수정 되었습니다.')
        }

        MCN_STT_REFETCH()
      } else {
        toast.error('오류 발생 했습니다.')
      }
    } catch (err) {
      resetInfo()
      toast.error(`${err} 오류가 발생했습니다.`)
  }
  }
  /**
   * 데이터 삭제 함수
   */
  const onSttRemove = async oldData => {
    try {
      const result = await DEL_MCN_STT_ITM_MTT({
        variables: {
          MCN_ID: oldData?.MCN_ID,
          MCN_STTG_ITM_ID: oldData?.MCN_STTG_ITM_ID,
          ver,
        },
      })

      if (result.data.delMachineSttgItemL.rsltCd === 'OK') {
        toast.success('성공적으로 삭제 되었습니다.')
        MCN_STT_REFETCH()
      } else {
        toast.error('오류 발생 했습니다.')
      }
    } catch (err) {
      resetInfo()
      toast.error(`${err} 오류가 발생했습니다.`)
  }
  }

  const onAllSttItm = async () => {
    if (!DTL_DATA.MCN_ID) {
      toast.error('설정을 원하는 머신을 선택해주세요.')
    } else {
      confirmAlert({
        title: <h6 style={{ marginBottom: '0.5em' }}>적용</h6>,
        message: (
          <div>
            적용 시 현재 설정 목록 삭제 후 적용됩니다.
            <br /> 적용하시겠습니까?
          </div>
        ),
        buttons: [
          {
            label: '네',
            onClick: async () => {
              try {
                const result = await INIT_MCN_STT_ITM_MTT({
                  variables: {
                    param: {
                      MCN_ID: DTL_DATA.MCN_ID,
                      MCN_STTG_ID: LOAD_DTL_STT_ITM_DATA?.getMachineSettingItem[0].MCN_STTG_ID || '',
                    },
                    ver,
                  },
                })
                if (result.data.initMachineSttgItemL.rsltCd === 'OK') {
                  toast.success('성공적으로 적용 되었습니다.')
                  MCN_STT_REFETCH()
                } else {
                  toast.error('오류 발생 했습니다.')
                }
              }  catch (err) {
                resetInfo()
                toast.error(`${err} 오류가 발생했습니다.`)
            }
            },
          },
          {
            label: '아니요',
          },
        ],
      })
    }
  }

  //#########################################################//

  return (
    <Page className={classes.root}>
      <Container maxWidth={false}>
        <Box mt={1}>
          <Box className={classes.searchBox}>
            <Card className={media.w490 ? classes.searchCard : classes.w490searchCard}>
              <form onSubmit={srchSubmit(onSubmitSrch)}>
                <Box className={media.w490 ? classes.formBox : null}>
                  <Grid container spacing={1}>
                    <Grid lg={2} xs={12} item>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>서비스</InputLabel>
                        <Select
                          label="서비스"
                          name="SVC_CD"
                          value={SRCH_DATA.SVC_CD || ''}
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, SVC_CD: ev.target.value })) || ''}
                        >
                          <MenuItem value={''}>전체</MenuItem>
                          {svc_code?.getCode?.map(option => (
                            <MenuItem key={option.COM_CD} value={option.COM_CD}>
                              {option.COM_CD_NM}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>모델명</InputLabel>
                        <Select
                          label="모델명"
                          name="MCN_MDL_CD"
                          value={SRCH_DATA.MCN_MDL_CD || ''}
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, MCN_MDL_CD: ev.target.value })) || ''}
                        >
                          <MenuItem value={''}>전체</MenuItem>
                          {mcn_mdl_code?.getCode?.map(option => (
                            <MenuItem key={option.COM_CD} value={option.COM_CD}>
                              {option.COM_CD_NM}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label="시리얼번호"
                        variant="outlined"
                        type="text"
                        name="MCN_SR_NO"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label="MAC 주소"
                        variant="outlined"
                        type="text"
                        name="MAC_ADDR"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          invalidDateMessage={false}
                          fullWidth
                          variant="inline"
                          inputVariant="outlined"
                          label="등록일"
                          format="yyyy-MM-dd"
                          onChange={ev =>
                            SET_SRCH_DATA(props => ({
                              ...props,
                              STRT_REG_DT:
                                Moment(ev).format('YYYY.MM.DD') === 'Invalid date' ? '' : Moment(ev).format('YYYY.MM.DD'),
                            }))
                          }
                          value={SRCH_DATA.STRT_REG_DT || null}
                          size="small"
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          invalidDateMessage={false}
                          fullWidth
                          variant="inline"
                          inputVariant="outlined"
                          label="수정일"
                          format="yyyy-MM-dd"
                          onChange={ev =>
                            SET_SRCH_DATA(props => ({
                              ...props,
                              STRT_UPD_DT:
                                Moment(ev).format('YYYY.MM.DD') === 'Invalid date' ? '' : Moment(ev).format('YYYY.MM.DD'),
                            }))
                          }
                          value={SRCH_DATA.STRT_UPD_DT || null}
                          size="small"
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Button
                    onClick={resetInfo}
                    className={media.w490 ? classes.srchBtn : classes.w490srchBtn}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    조회
                  </Button>
                </Box>
              </form>
            </Card>
          </Box>
        </Box>
        <Box mt={3} display={media.w980 ? 'flex' : null} width="100%" justifyContent="space-between">
          <Box className={media.w980 ? classes.table : null}>
            <Card>
              {/* TopBar 박스 */}
              <Box className={classes.TopBarBox}>
                <div>
                  <h3>
                    총
                    {LOAD_MCN_DATA?.getMachine?.RET_LIST?.length > 0 ? (
                      <span>{LOAD_MCN_DATA?.getMachine?.RET_LIST?.length}</span>
                    ) : (
                      <span>0</span>
                    )}
                    건
                  </h3>
                </div>
                <div>
                  <Button
                    className={classes.tableBtn}
                    onClick={onRemove}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={UI_INFO?.DEL_MCN_ID?.length > 0 ? false : true}
                  >
                    삭제
                  </Button>
                </div>
              </Box>
              {/* TopBar 박스 */}

              {/* Ag그리드 박스 */}
              <Box>
                <div className="ag-theme-alpine" style={{ position: 'relative', height: '700px', width: '100%' }}>
                  <AgGridReact
                    headerHeight={35}
                    onRowClicked={onRowClickd}
                    onRowSelected={onRowSelected}
                    onGridReady={ev => SET_GRID_API(ev.api)}
                    rowSelection="multiple"
                    rowData={LOAD_MCN_DATA?.getMachine?.RET_LIST || []}
                    defaultColDef={defaultColDef}
                    localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                    columnDefs={McnCloumns}
                    pagination={true}
                    paginationPageSize={10}
                    gridOptions={{ rowHeight: 40 }}
                  />
                </div>
              </Box>
              {/* Ag그리드 박스 */}
            </Card>
          </Box>
          <Box className={media.w980 ? classes.detail : null}>
            <Card style={{ overflowY: 'auto' }}>
              <form onSubmit={dtlSubmit(onSubmitDtl)}>
                <Box className={media.w525 ? classes.detailsHeader : null}>
                  <h5 className={classes.detailsHeaderTitle}>게임 정보 상세</h5>

                  {/*  버튼 박스 */}
                  <Box className={media.w525 ? classes.detailsBtnBox : classes.w525detailsBtnBox}>
                    <Button
                      className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                      onClick={inputReset}
                      variant="contained"
                      color="primary"
                      disabled={UI_INFO.ADD_FLAG === false ? false : true}
                    >
                      신규
                    </Button>
                    <Button
                      className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                      style={{ marginLeft: media.w525 ? '0.5em' : null }}
                      onClick={editClick}
                      variant="contained"
                      color="primary"
                      disabled={disabledHandler2(UI_INFO) ? false : true}
                    >
                      수정
                    </Button>
                    <Button
                      className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                      style={{
                        marginLeft: media.w525 ? '0.5em' : null,
                        backgroundColor: disabledHandler2(UI_INFO) ? '#E0E0E0' : 'red',
                      }}
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={disabledHandler2(UI_INFO) ? true : false}
                    >
                      저장
                    </Button>
                  </Box>
                  {/*  버튼 박스 */}
                </Box>
                <CardContent className={media.w500 ? classes.inputCardContent : null}>
                  {/* 디테일 인풋폼 그리드 컨테이너 */}
                  <Grid container spacing={2}>
                    <Grid item lg={4} xs={12}>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>모델명 *</InputLabel>
                        <Select
                          label="모델명 *"
                          name="MCN_MDL_CD"
                          value={DTL_DATA.MCN_MDL_CD || ''}
                          onChange={ev => SET_DTL_DATA(props => ({ ...props, MCN_MDL_CD: ev.target.value })) || ''}
                          readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                        >
                          {mcn_mdl_code?.getCode?.map(option => (
                            <MenuItem key={option.COM_CD} value={option.COM_CD}>
                              {option.COM_CD_NM}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <TextField
                        error={validate(errors?.MCN_SR_NO, getValues('MCN_SR_NO')) ? true : false}
                        helperText={validate(errors?.MCN_SR_NO, getValues('MCN_SR_NO')) ? '게임명을 입력해주세요.' : false}
                        style={{ width: '100%' }}
                        label="시리얼 번호 *"
                        variant="outlined"
                        name="MCN_SR_NO"
                        inputRef={dtlRegister({ required: true })}
                        size="small"
                        InputProps={
                          UI_INFO.INPUT_READ_ONLY
                            ? { startAdornment: <div></div> }
                            : {
                                readOnly: true,
                                startAdornment: <div></div>,
                              }
                        }
                      />
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <TextField
                        error={errors?.MAC_ADDR ? true : false}
                        helperText={errors?.MAC_ADDR ? `정상적인 MAC주소 형식을 입력해주세요.` : false}
                        style={{ width: '100%' }}
                        label="Mac Address *"
                        variant="outlined"
                        name="MAC_ADDR"
                        inputRef={dtlRegister({
                          required: true,
                          pattern: /([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})/,
                        })}
                        size="small"
                        InputProps={
                          UI_INFO.INPUT_READ_ONLY
                            ? { startAdornment: <div></div> }
                            : {
                                readOnly: true,
                                startAdornment: <div></div>,
                              }
                        }
                      />
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <FormControl
                        style={{ width: '100%' }}
                        size="small"
                        variant="outlined"
                        error={UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.SVC_CD === undefined ? true : false) : false}
                      >
                        <InputLabel>서비스</InputLabel>
                        <Select
                          label="서비스 *"
                          name="SVC_CD"
                          value={DTL_DATA.SVC_CD || ''}
                          onChange={ev => SET_DTL_DATA(props => ({ ...props, SVC_CD: ev.target.value })) || ''}
                          readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                        >
                          {svc_code?.getCode?.map(option => (
                            <MenuItem key={option.COM_CD} value={option.COM_CD}>
                              {option.COM_CD_NM}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.SVC_CD === undefined ? '서비스를 선택해주세요.' : false) : false}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item lg={8} xs={12}>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>서비스URL</InputLabel>
                        <Select label="서비스URL" value={DTL_DATA.SVC_CD || ''} readOnly={true}>
                          {svc_code?.getCode?.map(option => (
                            <MenuItem key={option.COM_CD} value={option.COM_CD}>
                              {option.COM_CD_VAL}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={3} xs={12}>
                      <TextField
                        style={{ width: '100%' }}
                        label="모델번호"
                        variant="outlined"
                        name="MCN_MDL_NO"
                        inputRef={dtlRegister}
                        size="small"
                        InputProps={
                          UI_INFO.INPUT_READ_ONLY
                            ? { startAdornment: <div></div> }
                            : {
                                readOnly: true,
                                startAdornment: <div></div>,
                              }
                        }
                      />
                    </Grid>
                    <Grid item lg={3} xs={12}>
                      <TextField
                        style={{ width: '100%' }}
                        label="가로크기"
                        variant="outlined"
                        type="number"
                        name="W_SZ"
                        inputRef={dtlRegister}
                        size="small"
                        InputProps={
                          UI_INFO.INPUT_READ_ONLY
                            ? { startAdornment: <div></div> }
                            : {
                                readOnly: true,
                                startAdornment: <div></div>,
                              }
                        }
                      />
                    </Grid>
                    <Grid item lg={3} xs={12}>
                      <TextField
                        style={{ width: '100%' }}
                        label="세로크기"
                        variant="outlined"
                        name="H_SZ"
                        type="number"
                        inputRef={dtlRegister}
                        size="small"
                        InputProps={
                          UI_INFO.INPUT_READ_ONLY
                            ? { startAdornment: <div></div> }
                            : {
                                readOnly: true,
                                startAdornment: <div></div>,
                              }
                        }
                      />
                    </Grid>
                    <Grid item lg={3} xs={12}>
                      <TextField
                        style={{ width: '100%' }}
                        label="폭크기"
                        variant="outlined"
                        name="D_SZ"
                        type="number"
                        inputRef={dtlRegister}
                        size="small"
                        InputProps={
                          UI_INFO.INPUT_READ_ONLY
                            ? { startAdornment: <div></div> }
                            : {
                                readOnly: true,
                                startAdornment: <div></div>,
                              }
                        }
                      />
                    </Grid>
                    <Grid item lg={7} xs={12}>
                      <TextField
                        style={{ width: '100%' }}
                        label="모델 설명"
                        multiline
                        rows={8}
                        name="MCN_MDL_DESC"
                        inputRef={dtlRegister}
                        variant="outlined"
                        InputProps={
                          UI_INFO.INPUT_READ_ONLY
                            ? { startAdornment: <div></div> }
                            : {
                                readOnly: true,
                                startAdornment: <div></div>,
                              }
                        }
                      />
                    </Grid>
                    <Grid item lg={5} xs={12}>
                      <Box className={classes.qrCodeBox}>
                        <div>QR CODE</div>
                        <QRCode
                          value={`${svc_code?.getCode?.filter(item => item.COM_CD === DTL_DATA.SVC_CD)[0]?.COM_CD_VAL}?SVC_CD=${
                            DTL_DATA.SVC_CD
                          }&mac=${getValues('MAC_ADDR')}`}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                  <Box mt={2}>
                    <AppBar position="static" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
                      <Tabs value={tabValue} onChange={(event, newValue) => setTabValue(newValue)} style={{ minHeight: '25px' }}>
                        <Tab className={classes.tabsBtnBox} label="부품 목록" />
                        <Tab className={classes.tabsBtnBox} label="설정 목록" />
                      </Tabs>
                    </AppBar>
                    <TabsContent value={tabValue} index={0}>
                      <MaterialTable
                        style={{ height: '290px' }}
                        localization={{
                          header: {
                            actions: 'Edit',
                            headerStyle: { textAlign: 'center', minHeight: '20px' },
                          },
                          body: {
                            emptyDataSourceMessage: '권한이 없습니다.',
                            editRow: {
                              deleteText: '삭제 시 복구 할 수 없습니다. 정말 삭제하시겠습니까?',
                            },
                          },
                        }}
                        title={''}
                        columns={mcnPartColumns}
                        components={{
                          EditField: props => <MTableEditField {...props} fullWidth />,
                          Toolbar: props => (
                            <div
                              style={{
                                height: '35px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <MTableToolbar {...props} />
                            </div>
                          ),
                        }}
                        data={LOAD_MCN_PART_DATA?.getMachinePart?.map(item => ({ id: item.MCN_ID, ...item })) || []}
                        icons={tableIcons}
                        options={{
                          rowStyle: rowData => {
                            return { fontSize: '13px' }
                          },
                          headerStyle: {
                            position: 'sticky',
                            top: 0,
                            backgroundColor: '#b5bcc4',
                            color: '#FFF',
                            textAlign: 'center',
                          },

                          actionsColumnIndex: -1,
                          addRowPosition: 'first',
                          maxBodyHeight: '240px',
                          overflowY: 'auto',
                          search: false,
                          paging: false,
                          sorting: false,
                        }}
                        editable={{
                          onRowAdd: newRow => onPartAdd(newRow),
                          onRowUpdate: (newData, oldData) => onEditPart(newData, oldData),
                          onRowDelete: oldData => onPartRemove(oldData),
                        }}
                        // onRowClick={(event, rowData) => onPartRowClicked(event, rowData)}
                      />
                    </TabsContent>
                    <TabsContent value={tabValue} index={1}>
                      <MaterialTable
                        style={{ height: '290px' }}
                        localization={{
                          toolbar: {},
                          header: {
                            actions: 'Edit',
                            headerStyle: { textAlign: 'center', minHeight: '20px' },
                          },
                          body: {
                            emptyDataSourceMessage: '권한이 없습니다.',
                            editRow: {
                              deleteText: '삭제 시 복구 할 수 없습니다. 정말 삭제하시겠습니까?',
                            },
                          },
                        }}
                        title={
                          <div style={{ width: '250px', display: 'flex', alignItems: 'center' }}>
                            <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                              <InputLabel>머신 설정 목록</InputLabel>
                              <Select
                                label="머신 설정 목록"
                                name="SVC_CD"
                                value={UI_INFO.DTL_STTG_ITM_URP || ''}
                                onChange={ev => SET_UI_INFO(props => ({ ...props, DTL_STTG_ITM_URP: ev.target.value })) || ''}
                              >
                                <MenuItem value={undefined}>해제</MenuItem>
                                {LOAD_DTL_STT_DATA?.getMachineSetting?.map(option => (
                                  <MenuItem key={option.MCN_STTG_ID} value={option.MCN_STTG_ID}>
                                    {option.MCN_STTG_NM}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <Button
                              style={{ height: '23px', marginLeft: '1em' }}
                              variant="contained"
                              color="primary"
                              onClick={onAllSttItm}
                            >
                              적용
                            </Button>
                          </div>
                        }
                        columns={mcnSttColumns}
                        components={{
                          EditField: props => <MTableEditField {...props} fullWidth />,
                        }}
                        data={LOAD_MCN_STT_DATA?.getMachineSettingItemL?.map(item => ({ id: item.MCN_ID, ...item })) || []}
                        icons={tableIcons}
                        options={{
                          rowStyle: rowData => {
                            return { fontSize: '13px' }
                          },
                          headerStyle: {
                            position: 'sticky',
                            top: 0,
                            backgroundColor: '#b5bcc4',
                            color: '#FFF',
                            textAlign: 'center',
                          },

                          actionsColumnIndex: -1,
                          addRowPosition: 'first',
                          maxBodyHeight: '220px',
                          overflowY: 'auto',
                          search: false,
                          paging: false,
                          sorting: false,
                        }}
                        editable={{
                          onRowAdd: newRow => onSttAdd(newRow),
                          onRowUpdate: (newData, oldData) => onSttEdit(newData, oldData),
                          onRowDelete: oldData => onSttRemove(oldData),
                        }}
                        // onRowClick={(event, rowData) => onPartRowClicked(event, rowData)}
                      />
                    </TabsContent>
                  </Box>
                  {/* 디테일 인풋폼 그리드 컨테이너 */}
                </CardContent>
              </form>
            </Card>
          </Box>
        </Box>
      </Container>
    </Page>
  )
}

export default React.memo(McnView)
