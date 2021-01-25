import React, {  useEffect, useState } from 'react'
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
} from '@material-ui/core'
//################################################//

import Moment from 'moment'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
//###################################################//

import MultiSelects from 'react-multi-select-component'
//############## SRC IMPORT   ##################//
// import { GET_AREA, GET_UPR_AREA, GET_DEALER_DATA, SHP_CTG_CD_DATA,GET_SHOP, SHOP_DEL, SHOP_ADD, SHOP_EDIT } from './ShopQuery';
import { disabledHandler2, serviceValue, validate, ver } from 'src/components/Utils'
//##############################################//

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
import { EDIT_JOIN_USER, GET_USER_AUTH, JOIN_USER, PWD_RESET, SVC_CD, SVC_USE_TP_CD } from './JoinUserQuery'
import styled from 'styled-components'
import useMedia from 'src/components/useMedia'
import DetailTable from './JoinUserComponent/DetailTable'
//####################################################//

//############### CSS ####################//
const useStyles = makeStyles(theme => ({
  page: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  //########### SEARCH CSS ############//
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
  srchBtn: theme.searchBtn,
  w490srchBtn: {
    width: '100%',
    marginTop: '1em',
  },
  w490searchCard: {
    padding: '0.8em',
    height: '100%',
    '& form': {},
  },

  //######################################//

  //############ GRID CSS ###############//
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
  //#########################################//

  //############## DETAIL CSS #############//

  dtlBtn: theme.detailBtn,
  w525dtlBtn: {
    marginTop: '0.5em',
  },
  detailHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    '& h5': theme.detailTitle,
  },
  inputCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  w525detailsBtnBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    padding: '1.5em',
  },
}))
//#########################################//

const JoinUserView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)

  const JoinUserCloumns = [
    {
      headerName: '서비스',
      field: 'USE_SVC_CD_LST',
      valueGetter: function(params) {
        console.log(params)
        return serviceValue(params.data.USE_SVC_CD_LST)
      },

      checkboxSelection: true,
      headerCheckboxSelection: true,
      suppressSizeToFit: true,
    },
    {
      headerName: '아이디',

      field: 'USR_ID',
    },
    {
      headerName: '이름',

      field: 'USR_NM',
    },
    {
      headerName: '인증유형',
      field: 'AUTH_TP_NM',
    },
    {
      headerName: 'HP',

      field: 'HP',
    },
    {
      headerName: 'EMAIL',

      field: 'EML',
    },
    {
      headerName: '닉네임',

      field: 'NIC_NM',
    },
    {
      headerName: '홈샵',

      field: 'HME_SHP_NM',
    },
    {
      headerName: '상태',

      field: 'USR_ST_CD',
    },
  ]
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    width: 200,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }
  //##############################################//

  //########## SHOP_MGT STATE ##############/
  const [mltSelect, setMltSelect] = useState([])
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    USR_ID: '',
    USR_NM: '',
    HP: '',
    EML: '',
    NIC_NM: '',
    HME_SHP_NM: '',
  })

  const [DTL_DATA, SET_DTL_DATA] = useState({
    MBSHPValue: '',
    PWDValue: '',
    USR_ID: '',
    PRM_CRD: '',
    SVC_USE_TP_CD: '',
  })

  const [UI_INFO, SET_UI_INFO] = useState({
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    DEL_USR_ID: [],
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
    ON_ROW_CLIKC: false,
  })
  //#######################################/

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { register: srchRegister, handleSubmit: srchSubmit } = useForm()
  const { register: dtlRegister, handleSubmit: dtlSubmit, reset, errors, setValue, getValues } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })
  //#################################################################//

  //########## 공동코드 및 함수 ###############//

  const resetInfo = () => {
    SET_UI_INFO(props => ({ ...props, ADD_FLAG: false, EDIT_FLAG: false, INPUT_READ_ONLY: false, INPUT_VARIDATE: false }))
  }
  const resetDtl = () => {
    SET_DTL_DATA(props => ({ ...props, MBSHPValue: '', PWDValue: '', USR_ID: '', PRM_CRD: '', SVC_USE_TP_CD: '' }))
    reset()
  }
  //######################################//

  //########## 공동코드 쿼리 ###############//

  const { data: svcCd } = useQuery(SVC_CD)
  const { data: svcUseTpCd } = useQuery(SVC_USE_TP_CD)
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//

  const [LOAD_JOIN_USR, { data: LOAD_JOIN_USER_DATA }] = useLazyQuery(JOIN_USER, {
    variables: {
      param: {
        ...SRCH_DATA,
        SVC_CD_LST: mltSelect
          ?.map(item => item.value)
          .sort()
          .toString(),
      },
      ver,
    },
    fetchPolicy: 'network-only',
  })
  const [editMutation] = useMutation(EDIT_JOIN_USER, {
    variables: {
      param: {
        USR_ID: DTL_DATA.USR_ID,
        MBSHP_EXP_DT: DTL_DATA.MBSHPValue,
        PWD_EXP_DT: DTL_DATA.PWDValue,
        PRM_CRD: DTL_DATA.PRM_CRD,
      },
      ver,
    },
  })
  const [resetMutation] = useMutation(PWD_RESET, {
    variables: {
      USR_ID: getValues('USR_ID'),
      ver,
    },
  })
  const [LOAD_TABLE_DATA, { data: tableData }] = useLazyQuery(GET_USER_AUTH)
  //###########################################################//

  //##################### useEffect ##########################//

  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node => node.setSelected(node.data.USR_ID === DTL_DATA?.USR_ID))
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }
  }, [UI_INFO.SEL_FOCUS, GRID_API, DTL_DATA.USR_ID, LOAD_JOIN_USR, LOAD_JOIN_USER_DATA])
  //##############################################################//

  //##############  SRCH_EVENT   ##################//
  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_JOIN_USR useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    SET_SRCH_DATA(props => ({ ...props, ...datas }))
    LOAD_JOIN_USR()
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
    Moment.suppressDeprecationWarnings = true
    setValue('USR_ID', ev?.data?.USR_ID)
    setValue('USR_NM', ev?.data?.USR_NM)
    setValue('NIC_NM', ev?.data?.NIC_NM)
    setValue('HME_SHP_NM', ev?.data?.HME_SHP_NM)
    setValue('HP', ev?.data?.HP)
    setValue('PRM_CRD', ev?.data?.PRM_CRD)
    setValue('EML', ev?.data?.EML)
    setValue('PAID_EXP_DT', ev?.data?.PAID_EXP_DT)
    setValue('NAT_CD', ev?.data?.NAT_CD)
    setValue('LANG_CD', ev?.data?.LANG_CD)
    setValue('GME_CRD', ev?.data?.GME_CRD)
    setValue('LST_LGN_DT', ev?.data?.LST_LGN_DT)
    setValue('USE_SVC_CD_LST', serviceValue(ev?.data?.USE_SVC_CD_LST))
    SET_DTL_DATA(props => ({
      ...props,
      MBSHPValue: Moment(ev.data.MBSHP_EXP_DT).format('YYYY.MM.DD'),
      PWDValue: Moment(ev.data.PWD_EXP_DT).format('YYYY-MM-DD'),
      SVC_USE_TP_CD: ev.data.SVC_USE_TP_CD,
    }))

    resetInfo()
    LOAD_TABLE_DATA({ variables: { USR_ID: ev?.data?.USR_ID, ver } })
  }
  //############################################################//

  //################ DTL_EVENT  ##################//
  /**
   * 수정 클릭시 useState이용한 상태 변경 함수
   */
  const editClick = () => {
    if (getValues('USR_ID') !== '') {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, EDIT_FLAG: true, ADD_FLAG: false }))
    } else {
      toast.error(`수정을 원하는 가입자를 클릭해주세요.`)
    }
  }

  /**
   * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시
   * submit Flag의 따라 실행되는 함수.
   * @param {object} data 인풋 데이터
   */
  const onSubmitDtl = async datas => {
    SET_DTL_DATA(props => ({ ...props, USR_ID: datas.USR_ID, PRM_CRD: Number(datas.PRM_CRD) })) //subMit인풋 데이터
    if (UI_INFO?.EDIT_FLAG === true) {
      //수정 subMit 실행 함수
      try {
        const result = await editMutation()
        console.log(result)
        if (result.data.modifyUser.rsltCd === 'OK') {
          toast.success('성공적으로 수정 되었습니다.')
          resetInfo()
          SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
          LOAD_JOIN_USR()
        }
      } catch (err) {
        resetInfo()
        toast.error(`${err} 오류가 발생했습니다.`)
    }
    }
  }

  const pwdReset = async () => {
    confirmAlert({
      title: '초기화',
      message: '정말 비밀번호를 초기화 하시겠습니까?',
      buttons: [
        {
          label: '네',
          onClick: async () => {
            try {
              const result = await resetMutation()
              console.log(result)
              if (result?.data?.resetPwd?.rsltCd === 'OK') {
                toast.success('비밀번호 초기화 하였습니다.')
                resetInfo()
              } else {
                toast.error('오류가 발생했습니다.')
              }
            } catch (err) {
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

  //#########################################################//

  return (
    <Page className={classes.page} title="가입자 관리">
      <Container maxWidth={false} className={classes.gridContainer}>
        {/* ################# SEARCH UI  #################### */}
        <Box className={classes.searchBox}>
          <Card className={media.w490 ? classes.searchCard : classes.w490searchCard}>
            <form onSubmit={srchSubmit(onSubmitSrch)}>
              <Grid container spacing={1} style={{ width: media.w490 ? '70%' : null }}>
                <Grid item lg={3} xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="아이디"
                    variant="outlined"
                    type="text"
                    name="USR_ID"
                    inputRef={srchRegister}
                    size="small"
                  />
                </Grid>
                <Grid item lg={3} xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="이름"
                    variant="outlined"
                    type="text"
                    name="USR_NM"
                    inputRef={srchRegister}
                    size="small"
                  />
                </Grid>

                <Grid item lg={3} xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="HP"
                    variant="outlined"
                    type="number"
                    name="HP"
                    inputRef={srchRegister}
                    size="small"
                  />
                </Grid>

                <Grid item lg={3} xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="EMAIL"
                    variant="outlined"
                    type="text"
                    name="EML"
                    inputRef={srchRegister}
                    size="small"
                  />
                </Grid>

                <Grid item lg={3} xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="닉네임"
                    variant="outlined"
                    type="text"
                    name="NIC_NM"
                    inputRef={srchRegister}
                    size="small"
                  />
                </Grid>
                <Grid item lg={3} xs={12}>
                  <TextField
                    style={{ width: '100%' }}
                    label="홈샵"
                    variant="outlined"
                    type="text"
                    name="HME_SHP_NM"
                    inputRef={srchRegister}
                    size="small"
                  />
                </Grid>
                <Grid item lg={6} xs={12}>
                  <MultiSelect
                    options={
                      svcCd !== undefined
                        ? svcCd?.getCode.map(item => ({
                            label: item.COM_CD_NM,
                            value: item.COM_CD,
                          }))
                        : []
                    }
                    value={mltSelect}
                    onChange={setMltSelect}
                    hasSelectAll={false}
                    disableSearch={true}
                    overrideStrings={{
                      selectSomeItems: <span style={{ color: '#546E7A' }}>서비스</span>,
                      allItemsAreSelected: svcCd?.getCode.map(item => `${item.COM_CD_NM}, `),
                    }}
                  />
                </Grid>
              </Grid>
              <Box>
                <Button
                  onClick={() => resetInfo()}
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
        {/* ################################################ */}

        {/* ################# GRID UI  #################### */}
        <Box mt={1}>
          <Card>
            {/* TopBar 박스 */}
            <Box className={classes.TopBarBox}>
              <div>
                <h3>
                  총
                  {LOAD_JOIN_USER_DATA?.getUser?.length > 0 ? (
                    <span>{LOAD_JOIN_USER_DATA?.getUser?.length}</span>
                  ) : (
                    <span>0</span>
                  )}
                  건
                </h3>
              </div>
            </Box>
            {/* TopBar 박스 */}

            {/* Ag그리드 박스 */}
            <Box>
              <div className="ag-theme-alpine" style={{ position: 'relative', height: '550px', width: '100%' }}>
                <AgGridReact
                  headerHeight={35}
                  onRowClicked={onRowClickd}
                  onGridReady={ev => SET_GRID_API(ev.api)}
                  rowSelection="multiple"
                  rowData={LOAD_JOIN_USER_DATA?.getSvcUser || []}
                  defaultColDef={defaultColDef}
                  localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                  columnDefs={JoinUserCloumns}
                  pagination={true}
                  paginationPageSize={10}
                  gridOptions={{ rowHeight: 40 }}
                />
              </div>
            </Box>
            {/* Ag그리드 박스 */}
          </Card>
        </Box>
        {/* ######################################### */}

        {/* ############ DETAIL UI ###############*/}
        <Box mt={1}>
          <Card>
            <form onSubmit={dtlSubmit(onSubmitDtl)}>
              <Box className={media.w490 ? classes.detailHeader : null}>
                <h5> 가입자 정보 상세</h5>
                {/*  버튼 박스 */}
                <Box className={media.w525 ? classes.detailsBtnBox : classes.w525detailsBtnBox}>
                  <Button
                    className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                    style={{ width: media.w525 ? '140px' : null }}
                    onClick={pwdReset}
                    variant="contained"
                    color="primary"
                    disabled={UI_INFO?.ADD_FLAG === false ? false : true}
                  >
                    비밀번호 초기화
                  </Button>

                  <Button
                    className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                    style={{ marginLeft: media.w490 ? '0.5em' : null }}
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
                      marginLeft: media.w490 ? '0.5em' : null,
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
              <CardContent className={media.w800 ? classes.inputCardContent : classes.w800inputCardContent}>
                {/* 디테일 인풋폼 그리드 컨테이너 */}
                <Grid style={{ width: '100%' }} container spacing={1}>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      label="아이디"
                      variant="outlined"
                      name="USR_ID"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      label="이름"
                      variant="outlined"
                      name="USR_NM"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      label="닉네임"
                      variant="outlined"
                      name="NIC_NM"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      label="홈샵"
                      variant="outlined"
                      name="HME_SHP_NM"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      label="최근 로그인 시간"
                      variant="outlined"
                      name="LST_LGN_DT"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      label="HP"
                      variant="outlined"
                      name="HP"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>

                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      label="EMAIL"
                      variant="outlined"
                      name="EML"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      label="유료 만료일"
                      variant="outlined"
                      name="PAID_EXP_DT"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>

                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <FormControl
                      style={{ width: media.w665 ? (media.w750 ? '220px' : '188px') : '100%' }}
                      size="small"
                      variant="outlined"
                    >
                      <InputLabel>회원유형</InputLabel>
                      <Select
                        label="회원유형"
                        onChange={ev => SET_DTL_DATA(props => ({ ...props, SVC_USE_TP_CD: ev.target.value }))}
                        value={DTL_DATA.SVC_USE_TP_CD || ''}
                        inputProps={{
                          readOnly: true,
                        }}
                      >
                        {svcUseTpCd?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        )) || []}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      label="서비스"
                      variant="outlined"
                      name="USE_SVC_CD_LST"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '106px' : '100%' }}
                      label="국가"
                      variant="outlined"
                      name="NAT_CD"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '106px' : '100%' }}
                      label="언어"
                      variant="outlined"
                      name="LANG_CD"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      label="게임 크레딧"
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      variant="outlined"
                      name="GME_CRD"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={{
                        readOnly: true,
                        startAdornment: <div></div>,
                      }}
                    />
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <TextField
                      style={{ width: media.w750 ? '220px' : '100%' }}
                      error={validate(errors?.PRM_CRD, getValues('PRM_CRD')) ? true : false}
                      helperText={validate(errors?.PRM_CRD, getValues('PRM_CRD')) ? '프로모션크레딧을 입력해주세요.' : false}
                      label="프로모션크레딧 *"
                      focused={UI_INFO.INPUT_READ_ONLY ? true : null}
                      variant="outlined"
                      name="PRM_CRD"
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

                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        style={{ width: media.w750 ? '220px' : '100%', borderColor: 'red' }}
                        error={DTL_DATA.MBSHPValue === 'Invalid date' ? true : false}
                        helperText={DTL_DATA.MBSHPValue === 'Invalid date' ? '회원만료일을 선택해주세요.' : null}
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        label="회원만료일 *"
                        format="yyyy-MM-dd"
                        focused={UI_INFO.INPUT_READ_ONLY ? true : null}
                        onChange={ev => SET_DTL_DATA(props => ({ ...props, MBSHPValue: Moment(ev).format('YYYY.MM.DD') }))}
                        value={DTL_DATA.MBSHPValue || null}
                        name="MBSHP_EXP_DT"
                        size="small"
                        disabled={UI_INFO.INPUT_READ_ONLY ? false : true}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid style={{ width: media.w665 ? null : '100%' }} item>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        error={DTL_DATA.PWDValue === 'Invalid date' ? true : false}
                        helperText={DTL_DATA.PWDValue === 'Invalid date' ? '비밀번호만료일을 선택해주세요.' : null}
                        style={{ width: media.w750 ? '220px' : '100%', borderColor: 'red' }}
                        autoOk
                        variant="inline"
                        focused={UI_INFO.INPUT_READ_ONLY ? true : null}
                        inputVariant="outlined"
                        label="비밀번호만료일 *"
                        format="yyyy-MM-dd"
                        onChange={ev => SET_DTL_DATA(props => ({ ...props, PWDValue: Moment(ev).format('YYYY-MM-DD') }))}
                        value={DTL_DATA.PWDValue || null}
                        name="PWD_EXP_DT"
                        size="small"
                        disabled={UI_INFO.INPUT_READ_ONLY ? false : true}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
                <Box width={media.w800 ? '530px' : '100%'} marginTop={media.w800 ? 0 : '1em'} marginLeft={media.w800 ? '1em' : 0}>
                  <DetailTable tableData={tableData} />
                </Box>
                {/* 디테일 인풋폼 그리드 컨테이너 */}
              </CardContent>
            </form>
          </Card>
        </Box>
        {/* ######################################### */}
      </Container>
    </Page>
  )
}

export default JoinUserView
const MultiSelect = styled(MultiSelects)`
  position: relative;
  z-index: 99;

  font-size: 12px;
  .dropdown-container {
    --rmsc-main: #4285f4;
    --rmsc-hover: #f1f3f5;
    --rmsc-selected: #e2e6ea;
    --rmsc-border: #ccc;
    --rmsc-gray: #aaa;
    --rmsc-bg: #fff;
    --rmsc-p: 10px; /* Spacing */
    --rmsc-radius: 4px; /* Radius */
    --rmsc-h: 34px; /* Height */
  }
`
