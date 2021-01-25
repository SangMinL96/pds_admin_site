import React, { useCallback, useEffect, useState } from 'react'
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
} from '@material-ui/core'
//################################################//

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import { GME_CTG_CODE, GET_GAME_DATA, MCN_MDL_CODE, SVC_CD_CODE, ADD_GAME, EDIT_GAME, DEL_GAME } from './GameQuery'
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
    width: '50%',
  },
  detail: {
    width: '48%',
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
    width: '40%',
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
    height: '655px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  w980inputCardContent: {
    width: '100%',
    height: '655px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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

const GameView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)
  const [DTL_GRID_API, SET_DTL_GRID_API] = useState(null)
  const gameCloumns = [
    {
      headerName: '서비스',
      field: 'SVC_NM',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: '게임아이디',
      field: 'GME_ID',
    },
    {
      headerName: '게임명',
      field: 'GME_NM',
    },
    {
      headerName: '게임설명',
      field: 'GME_DESC',
    },
  ]
  const dtlGameCloumns = [
    {
      headerName: '모델 코드',
      field: 'COM_CD',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: '모델 명',
      field: 'COM_CD_NM',
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
  const dtlDefaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    width: 153,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
    cellStyle: () => (UI_INFO.INPUT_READ_ONLY ? null : { 'pointer-events': 'none' }),
  }
  //##############################################//

  //################ SHOP_MGT STATE ################/
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    SVC_CD: '',
    GME_NM: '',
  })
  const [DTL_DATA, SET_DTL_DATA] = useState({
    GME_ID: '',
    GME_NM: '',
    GME_CRD: '',
    GME_RND_VAL: '',
    SVC_CD: '',
    GME_CTG_CD: '',
    HNDI_YN: '',
    GME_DESC: '',
    MCN_MDL_CD_LST: '',
  })
  const [UI_INFO, SET_UI_INFO] = useState({
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    DEL_GME_ID: [],
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
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
    }))
  }
  const resetDtl = () => {
    SET_DTL_DATA(props => ({
      ...props,
      GME_ID: '',
      GME_NM: '',
      GME_CRD: '',
      GME_RND_VAL: '',
      GME_DESC: '',
      SVC_CD: '',
      GME_CTG_CD: '',
      HNDI_YN: '',
      MCN_MDL_CD_LST: '',
    }))
    DTL_GRID_API.deselectAll()
    reset()
  }
  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: svc_code } = useQuery(SVC_CD_CODE)
  const { data: gme_ctg_code } = useQuery(GME_CTG_CODE)
  const { data: mcn_mdl_code } = useQuery(MCN_MDL_CODE)
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//

  // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
  const [LOAD_GAME, { data: LOAD_GAME_DATA }] = useLazyQuery(GET_GAME_DATA, {
    variables: { param: SRCH_DATA, ver },
    fetchPolicy: 'network-only',
  })
  const [addMutation] = useMutation(ADD_GAME, {
    //신규 추가 뮤테이션
    variables: {
      param: { ...DTL_DATA },
      ver,
    },
  })
  const [editMutation] = useMutation(EDIT_GAME, {
    //데이터 수정 뮤테이션
    variables: {
      param: { ...DTL_DATA },
      ver,
    },
  })

  const [delMutation] = useMutation(DEL_GAME, {
    variables: { param: { GME_IDS: UI_INFO.DEL_GME_ID }, ver },
  })
  //#############################################################//

  //################# useEffect ####################//
  
  const checkMcnMdl = useCallback(
    MCN_MDL_CD_LST => {
      DTL_GRID_API.forEachNode(node => {
        const arr = MCN_MDL_CD_LST !== '' ? MCN_MDL_CD_LST.split(',').map(item => (item === node.data.COM_CD ? true : false)) : []
        node.setSelected(arr.includes(true))
      })
    },
    [DTL_GRID_API],
  )

  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node => node.setSelected(node.data.GME_ID === DTL_DATA.GME_ID))
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }
    if (DTL_DATA.MCN_MDL_CD_LST !== '') {
      checkMcnMdl(DTL_DATA.MCN_MDL_CD_LST)
    }

  }, [
    UI_INFO.SEL_FOCUS,
    GRID_API,
    LOAD_GAME,
    DTL_DATA.MCN_MDL_CD_LST,
    checkMcnMdl,
    DTL_DATA.GME_ID,
    LOAD_GAME_DATA,
  ])
  //#################################################//

  //##############  SRCH_EVENT   ##################//
  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_GAME useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    SET_SRCH_DATA(props => ({ ...props, ...datas }))
    LOAD_GAME()
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
    setValue('GME_ID', ev?.data?.GME_ID)
    setValue('GME_NM', ev?.data?.GME_NM)
    setValue('GME_CRD', ev?.data?.GME_CRD)
    setValue('GME_RND_VAL', ev?.data?.GME_RND_VAL)
    setValue('GME_DESC', ev?.data?.GME_DESC)
    SET_DTL_DATA(props => ({
      ...props,
      SVC_CD: ev?.data?.SVC_CD,
      GME_CTG_CD: ev?.data?.GME_CTG_CD,
      HNDI_YN: ev?.data?.HNDI_YN,
      MCN_MDL_CD_LST: ev?.data?.MCN_MDL_CD_LST,
    }))
    resetInfo()
  }

  /**
   * onRowClickd함수에서 ChackBox클릭시 row 데이터를 받아오지 못하는 오류가 발생.
   * 그래서 row선택이 되면 전체를 인지하고 데이터를 받아올수있는 함수추가.
   * 이함수는 다수의 데이터를 클릭하여 삭제하는 이벤트와 수정시 해당 데이터를 포커싱하는 이벤트을 담당
   * @param {object} ev 선택된 데이터의 데이터 값
   */
  const onRowSelected = ev => {
    const clickNtcData = GRID_API.getSelectedRows().map(data => data.GME_ID)
    SET_UI_INFO(props => ({ ...props, DEL_GME_ID: clickNtcData }))
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
              const result = await delMutation()
              if (result.data.delGame.rsltCd === 'OK') {
                toast.success('정상적으로 삭제 되었습니다.')
                resetDtl()
                resetInfo()
                LOAD_GAME()
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
  //#################################################//

  //##############   DTL_EVENT    ##################//
  const inputReset = () => {
    SET_UI_INFO(props => ({
      ...props,
      INPUT_READ_ONLY: true,
      ADD_FLAG: true,
      EDIT_FLAG: false,
    }))
    resetDtl()
    GRID_API.deselectAll()
  }

  /**
   * 수정 클릭시 useState이용한 상태 변경 함수
   */
  const editClick = () => {
    if (getValues('GME_ID') !== '') {
      SET_UI_INFO(props => ({
        ...props,
        INPUT_READ_ONLY: true,
        EDIT_FLAG: true,
        ADD_FLAG: false,
      }))
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
    await SET_DTL_DATA(props => ({ ...props, ...datas })) //subMit인풋 데이터
    if (DTL_DATA.MCN_MDL_CD_LST === '') {
      toast.error('게임의 해당하는 머신을 선택해주세요.')
    } else {
      if (UI_INFO?.ADD_FLAG === true) {
        //신규 subMit 실행 함수
        try {
          const result = await addMutation()
          console.log(result)
          if (result.data.saveGame.rsltCd === 'OK') {
            toast.success('성공적으로 추가 되었습니다.')
            LOAD_GAME()
            resetDtl()
            resetInfo()
          } else {
            toast.error('오류가 발생했습니다.')
            resetDtl()
            resetInfo()
          }
        } catch (err) {
          resetInfo()
          toast.error(`${err} 오류가 발생했습니다.`)
        }
      }

      if (UI_INFO?.EDIT_FLAG === true) {
        //수정 subMit 실행 함수
        try {
          const result = await editMutation()
          console.log(result)
          if (result.data.saveGame.rsltCd === 'OK') {
            toast.success('성공적으로 수정 되었습니다.')
            LOAD_GAME()
            resetInfo()
            SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
          } else {
            resetInfo()
            toast.error('오류가 발생했습니다.')
          }
        } catch (err) {
          resetInfo()
          toast.error(`${err} 오류가 발생했습니다.`)
        }
      }
    }
  }

  const onDtlRowSelected = ev => {
    const clickData = DTL_GRID_API.getSelectedRows().map(data => data.COM_CD)
    SET_DTL_DATA(props => ({
      ...props,
      MCN_MDL_CD_LST: clickData?.toString(),
    }))
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
                    <Grid lg={6} xs={12} item>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>서비스</InputLabel>
                        <Select
                          label="서비스"
                          name="SVC_CD"
                          value={SRCH_DATA.SVC_CD || ''}
                          onChange={ev =>
                            SET_SRCH_DATA(props => ({
                              ...props,
                              SVC_CD: ev.target.value,
                            })) || ''
                          }
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
                    <Grid lg={6} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label="게임 명"
                        variant="outlined"
                        type="text"
                        name="GME_NM"
                        inputRef={srchRegister}
                        size="small"
                      />
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
                    총{LOAD_GAME_DATA?.getArea?.length > 0 ? <span>{LOAD_GAME_DATA?.getArea?.length}</span> : <span>0</span>}건
                  </h3>
                </div>
                <div>
                  <Button
                    className={classes.tableBtn}
                    onClick={onRemove}
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={UI_INFO?.DEL_GME_ID?.length > 0 ? false : true}
                  >
                    삭제
                  </Button>
                </div>
              </Box>
              {/* TopBar 박스 */}

              {/* Ag그리드 박스 */}
              <Box>
                <div
                  className="ag-theme-alpine"
                  style={{
                    position: 'relative',
                    height: '650px',
                    width: '100%',
                  }}
                >
                  <AgGridReact
                    headerHeight={35}
                    onRowClicked={onRowClickd}
                    onRowSelected={onRowSelected}
                    onGridReady={ev => SET_GRID_API(ev.api)}
                    rowSelection="multiple"
                    rowData={LOAD_GAME_DATA?.getGame || []}
                    defaultColDef={defaultColDef}
                    localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                    columnDefs={gameCloumns}
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
            <Card>
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
                  <Grid container spacing={2} style={media.w500 ? { width: '50%', marginRight: '1em' } : { marginBottom: '1em' }}>
                    <Grid item lg={12} xs={12}>
                      <TextField
                        style={{ width: '100%' }}
                        label="게임 아이디"
                        variant="outlined"
                        name="GME_ID"
                        inputRef={dtlRegister}
                        size="small"
                        InputProps={{
                          readOnly: true,
                          startAdornment: <div></div>,
                        }}
                      />
                    </Grid>
                    <Grid item lg={12} xs={12}>
                      <TextField
                        error={validate(errors?.GME_NM, getValues('GME_NM')) ? true : false}
                        helperText={validate(errors?.GME_NM, getValues('GME_NM')) ? '게임명을 입력해주세요.' : false}
                        style={{ width: '100%' }}
                        label="게임명 *"
                        variant="outlined"
                        name="GME_NM"
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
                    <Grid item lg={12} xs={12}>
                      <TextField
                        style={{ width: '100%' }}
                        label="게임 크레딧"
                        variant="outlined"
                        name="GME_CRD"
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
                    <Grid item lg={12} xs={12}>
                      <TextField
                        style={{ width: '100%' }}
                        label="게임 라운드"
                        variant="outlined"
                        name="GME_RND_VAL"
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
                    <Grid item lg={12} xs={12}>
                      <FormControl
                        style={{ width: '100%' }}
                        size="small"
                        variant="outlined"
                        error={UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.SVC_CD === undefined ? true : false) : false}
                      >
                        <InputLabel>서비스</InputLabel>
                        <Select
                          label="서비스"
                          name="SVC_CD"
                          value={DTL_DATA.SVC_CD || ''}
                          onChange={ev =>
                            SET_DTL_DATA(props => ({
                              ...props,
                              SVC_CD: ev.target.value,
                            })) || ''
                          }
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
                    <Grid item lg={12} xs={12}>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>게임카테고리</InputLabel>
                        <Select
                          label="게임카테고리"
                          name="GME_CTG_CD"
                          value={DTL_DATA.GME_CTG_CD || ''}
                          onChange={ev =>
                            SET_DTL_DATA(props => ({
                              ...props,
                              GME_CTG_CD: ev.target.value,
                            })) || ''
                          }
                          readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                        >
                          {gme_ctg_code?.getCode?.map(option => (
                            <MenuItem key={option.COM_CD} value={option.COM_CD}>
                              {option.COM_CD_NM}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={12} xs={12}>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>핸디캡 적용여부</InputLabel>
                        <Select
                          label="핸디캡 적용여부"
                          name="HNDI_YN"
                          value={DTL_DATA.HNDI_YN || ''}
                          onChange={ev =>
                            SET_DTL_DATA(props => ({
                              ...props,
                              HNDI_YN: ev.target.value,
                            })) || ''
                          }
                          readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                        >
                          <MenuItem value={'Y'}>Y</MenuItem>
                          <MenuItem value={'N'}>N</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item lg={12} xs={12}>
                      <TextField
                        style={{ width: '100%' }}
                        label="게임 설명"
                        multiline
                        rows={6}
                        name="GME_DESC"
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
                  </Grid>
                  <Box width={media.w490 ? '45%' : null}>
                    <div
                      className="ag-theme-alpine"
                      style={{
                        position: 'relative',
                        height: '510px',
                        width: '100%',
                      }}
                    >
                      <AgGridReact
                        headerHeight={35}
                        onRowSelected={onDtlRowSelected}
                        rowMultiSelectWithClick={true}
                        suppressRowClickSelection={UI_INFO.INPUT_READ_ONLY ? false : true}
                        onGridReady={ev => SET_DTL_GRID_API(ev.api)}
                        rowSelection="multiple"
                        rowData={
                          getValues('GME_ID') !== '' ? mcn_mdl_code?.getCode : UI_INFO.ADD_FLAG ? mcn_mdl_code?.getCode : []
                        }
                        defaultColDef={dtlDefaultColDef}
                        localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                        columnDefs={dtlGameCloumns}
                        gridOptions={{ rowHeight: 40 }}
                      />
                    </div>
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

export default React.memo(GameView)
