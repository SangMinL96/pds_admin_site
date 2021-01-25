import React, { useEffect, useState } from 'react'
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

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
//###################################################//

//############## SRC IMPORT   ##################//
import { disabledHandler2, validate, ver } from 'src/components/Utils'
//##############################################//
import useMedia from 'src/components/useMedia'

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

import { SVC_CD, GET_SCRN, EDIT_SCRN, ADD_SCRN, DEL_SCRN, GET_SCREEN_API, GET_API, SAVE_SCRN_API } from './ScrnQuery'
import { useCallback } from 'react'
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
  //############### SEARCH CSS #################//
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
    width: '90%',
  },

  srchBtn: theme.searchBtn,
  w490searchCard: {
    padding: '0.8em',
    overflow: 'visible',
  },
  w490srchBtn: {
    width: '100%',
    marginTop: '1em',
  },
  //######################################//

  //############## GRID CSS ##################//
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
  //###########################################//

  //############## DTL CSS ####################//
  dtlBtn: theme.detailBtn,
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
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  w525dtlBtn: {
    marginTop: '0.5em',
    width: '100%',
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

const AdminUserView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)
  const [DTL_GRID_API, SET_DTL_GRID_API] = useState(null)
  const ScrnColumns = [
    {
      headerName: 'ID',
      field: 'SCRN_ID',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: 'SCRN 명',
      field: 'SCRN_NM',
    },
    {
      headerName: '링크경로',
      field: 'SCRN_LNK_PTH',
    },
    {
      headerName: '서비스',
      field: 'SVC_NM',
    },
    {
      headerName: '화면 설명',
      field: 'SCRN_DESC',
    },
  ]
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    width: 200,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }

  const ApiColumns = [
    {
      headerName: 'ID',
      field: 'API_ID',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: 'API 명',
      field: 'API_NM',
    },
    {
      headerName: '버전',
      field: 'API_VER',
    },
    {
      headerName: '모듈',
      field: 'MDLE_CD',
    },
    {
      headerName: 'ENDPOINT',
      field: 'API_EPT_PTH',
    },
    {
      headerName: '기능',
      field: 'FUNC_CD',
    },
  ]
  //##############################################//

  //########## SHOP_MGT STATE ##############/
  const [FORM_DATA, SET_FORM_DATA] = useState({
    SCRN_NM: '',
    SVC_CD: '',
  })
  const [DTL_DATA, SET_DTL_DATA] = useState({
    SCRN_ID: '',
    SCRN_NM: '',
    SCRN_LNK_PTH: '',
    SCRN_DESC: '',
    SVC_CD: '',
  })
  const [API_FORM_DATA, SET_API_FORM_DATA] = useState({
    SCRN_ID: '',
    API_IDS: undefined,
  })
  const [UI_INFO, SET_UI_INFO] = useState({
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    DEL_SCRN_ID: [],
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
    ON_GRID_CLICKED: false,
  })
  //#######################################/

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { register: srchRegister, handleSubmit: srchSubmit } = useForm()
  const { register: dtlRegister, handleSubmit: dtlSubmit, reset, errors, setValue, getValues } = useForm()
  //#################################################################//

  //########## 공통 스크립트 함수 ###############//
  /**
   * 조회,저장등 이벤트 실행시 submitFlag,인풋 readOnly, 인풋 유효성 검사등 상태를 초기화 시키는 이벤트
   */
  const resetInfo = () => {
    SET_UI_INFO(props => ({
      ...props,
      ADD_FLAG: false,
      EDIT_FLAG: false,
      INPUT_READ_ONLY: false,
      INPUT_VARIDATE: false,
      ON_GRID_CLICKED: false,
    }))
  }
  /**
   * 디테일 인풋값을 공백으로 초기화 시키는 이벤트
   */
  const resetDtl = () => {
    SET_DTL_DATA(props => ({ ...props, SCRN_ID: '', SCRN_NM: '', SCRN_LNK_PTH: '', SCRN_DESC: '', SVC_CD: '' }))
    reset()
  }
  //#######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: svc_cd } = useQuery(SVC_CD)
  //######################################/

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//
  const [LOAD_SCRN, { data: LOAD_SCRN_DATA }] = useLazyQuery(GET_SCRN, {
    variables: { param: FORM_DATA, ver },
    fetchPolicy: 'network-only',
  })
  const { data: gridApiData } = useQuery(GET_API, {
    fetchPolicy: 'network-only',
    skip: UI_INFO.ADD_FLAG ? false : getValues('SCRN_ID') === '',
    variables: { param: {}, ver },
  })
  const { data: LOAD_SCN_API_DATA, refetch: fetchScnApi } = useQuery(GET_SCREEN_API, {
    fetchPolicy: 'network-only',
    skip: getValues('SCRN_ID') === '' || getValues('SCRN_ID') === undefined,
    variables: { param: getValues('SCRN_ID'), ver },
  })
  const [addApiMutation] = useMutation(SAVE_SCRN_API, {
    variables: {
      param: API_FORM_DATA,
      ver,
    },
  })
  const [delMutation] = useMutation(DEL_SCRN, { variables: { param: { SCRN_IDS: UI_INFO.DEL_SCRN_ID }, ver } })
  const [addMutation] = useMutation(ADD_SCRN, { variables: { param: { ...DTL_DATA }, ver } })
  const [editMutation] = useMutation(EDIT_SCRN, { variables: { param: { ...DTL_DATA }, ver } })
  //###########################################################//

  //##################### useEffect ###########################//
  const checkScreenApis = useCallback(
    screenApis => {
      DTL_GRID_API.forEachNode(node => {
        const arr = screenApis.map(api => (api.API_ID === node.data.API_ID ? true : false))
        node.setSelected(arr.includes(true))
      })
    },
    [DTL_GRID_API],
  )
 
  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node => node.setSelected(node.data.SCRN_ID === DTL_DATA?.SCRN_ID))
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }
    if (UI_INFO.ON_GRID_CLICKED === false) {
      if (LOAD_SCN_API_DATA !== undefined) {
        checkScreenApis(LOAD_SCN_API_DATA?.getScreenApi)
      }
    }

  }, [
    UI_INFO.SEL_FOCUS,
    GRID_API,
    DTL_DATA.SCRN_ID,
    LOAD_SCRN,
    UI_INFO.ON_GRID_CLICKED,
    LOAD_SCRN_DATA,
    LOAD_SCN_API_DATA,
    checkScreenApis
  ])
  //###########################################################//

  //##############  SRCH_EVENT   ##################//
  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_SCRN useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    SET_FORM_DATA(props => ({ ...props, ...datas }))
    LOAD_SCRN()
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
    setValue('SCRN_ID', ev?.data?.SCRN_ID)
    setValue('SCRN_NM', ev?.data?.SCRN_NM)
    setValue('SCRN_DESC', ev?.data?.SCRN_DESC)
    setValue('SCRN_LNK_PTH', ev?.data?.SCRN_LNK_PTH)
    SET_DTL_DATA(props => ({ ...props, SVC_CD: ev.data.SVC_CD }))
    resetInfo()
  }

  /**
   * onRowClickd함수에서 ChackBox클릭시 row 데이터를 받아오지 못하는 오류가 발생.
   * 그래서 row선택이 되면 전체를 인지하고 데이터를 받아올수있는 함수추가.
   * 이함수는 다수의 데이터를 클릭하여 삭제하는 이벤트와 수정시 해당 데이터를 포커싱하는 이벤트을 담당
   * @param {object} ev 선택된 데이터의 데이터 값
   */
  const onRowSelected = ev => {
    const clickNtcData = GRID_API.getSelectedRows().map(data => data.SCRN_ID)
    SET_UI_INFO(props => ({ ...props, DEL_SCRN_ID: clickNtcData }))
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
              console.log(result)
              if (result.data.delScreen.rsltCd === 'OK') {
                toast.success('정상적으로 삭제 되었습니다.')
                resetDtl()
                LOAD_SCRN()
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

  //###################################################//

  //##############   DTL_EVENT    ##################//
  /**
   * 신규 클릭시 useState이용한 상태 변경 함수
   */
  const inputReset = () => {
    SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, ADD_FLAG: true, EDIT_FLAG: false, ON_GRID_CLICKED: true }))
    resetDtl()
    GRID_API.deselectAll()
    DTL_GRID_API.deselectAll()
  }

  /**
   * 수정 클릭시 useState이용한 상태 변경 함수
   */
  const editClick = () => {
    if (getValues('SCRN_ID') !== '') {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, EDIT_FLAG: true, ADD_FLAG: false, ON_GRID_CLICKED: true }))
    } else {
      toast.error(`수정을 원하는 화면을 클릭해주세요.`)
    }
  }

  /**
   * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시
   * submit Flag의 따라 실행되는 함수.
   * @param {object} data 인풋 데이터
   */
  const onSubmitDtl = async datas => {
    SET_DTL_DATA(props => ({ ...props, ...datas })) //subMit인풋 데이터
    await SET_API_FORM_DATA(props => ({ ...props, SCRN_ID: datas.SCRN_ID }))
    if (API_FORM_DATA.API_IDS.length === 0) {
      toast.error('화면의 해당하는 API를 선택해주세요.')
    } else {
      if (UI_INFO?.ADD_FLAG === true) {
        //신규 subMit 실행 함수
        if (LOAD_SCRN_DATA?.getScreen?.map(item => item.SCRN_ID).some(id => id === datas.SCRN_ID)) {
          toast.error('중복된 ID가 존재합니다.')
        } else {
          try {
            const result = await addMutation()
            const apiResult = await addApiMutation()

            if (result.data.saveScreen.rsltCd === 'OK' && apiResult.data.saveScreenApi.rsltCd === 'OK') {
              toast.success('성공적으로 추가 되었습니다.')
              resetDtl()
              resetInfo()
              LOAD_SCRN()
            } else {
              toast.error('오류가 발생했습니다.')
            }
          }  catch (err) {
            resetInfo()
            toast.error(`${err} 오류가 발생했습니다.`)
        }
        }
      }
      if (UI_INFO?.EDIT_FLAG === true) {
        //수정 subMit 실행 함수
        try {
          const result = await editMutation()
          const apiResult = await addApiMutation()
          if (result.data.saveScreen.rsltCd === 'OK' && apiResult.data.saveScreenApi.rsltCd === 'OK') {
            toast.success('성공적으로 수정 되었습니다.')
            resetInfo()
            SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
            LOAD_SCRN()
            fetchScnApi()
          } else {
            toast.error('오류가 발생했습니다.')
          }
        } catch (err) {
          resetInfo()
          toast.error(`${err} 오류가 발생했습니다.`)
      }
      }
    }
  }

  const onRowSelectedApi = () => {
    const clickData = DTL_GRID_API.getSelectedRows().map(data => data.API_ID)
    SET_API_FORM_DATA(props => ({ ...props, API_IDS: clickData }))
  }

  //#########################################################//

  return (
    <Page className={classes.page} title="화면 관리">
      <Container maxWidth={false} className={classes.gridContainer}>
        {/* ################# SEARCH UI  #################### */}
        <Box className={classes.searchBox}>
          <Card className={media.w490 ? classes.searchCard : classes.w490searchCard}>
            <form onSubmit={srchSubmit(onSubmitSrch)}>
              <Box className={media.w490 ? classes.formBox : null}>
                <Grid container spacing={1} style={{ width: media.w490 ? '50%' : null }}>
                  <Grid item lg={6} xs={12}>
                    <TextField
                      style={{ width: '100%' }}
                      label="화면명"
                      variant="outlined"
                      type="text"
                      name="SCRN_NM"
                      inputRef={srchRegister}
                      size="small"
                    />
                  </Grid>

                  <Grid item lg={6} xs={12}>
                    <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                      <InputLabel>서비스</InputLabel>
                      <Select
                        label="서비스"
                        value={FORM_DATA?.USR_TP_CD || ''}
                        onChange={ev => SET_FORM_DATA(props => ({ ...props, SVC_CD: ev.target.value }))}
                      >
                        <MenuItem value={''}>전체</MenuItem>
                        {svc_cd?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
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
        <Box mt={2}>
          <Grid container spacing={1}>
            <Grid item lg={6} xs={12}>
              <Card>
                {/* TopBar 박스 */}
                <Box className={classes.TopBarBox}>
                  <div>
                    <h3>
                      총{LOAD_SCRN_DATA?.getUser?.length > 0 ? <span>{LOAD_SCRN_DATA?.getUser?.length}</span> : <span>0</span>}건
                    </h3>
                  </div>
                  <div>
                    <Button
                      className={classes.tableBtn}
                      onClick={onRemove}
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={UI_INFO?.DEL_SCRN_ID?.length > 0 ? false : true}
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
                      rowData={LOAD_SCRN_DATA?.getScreen || []}
                      defaultColDef={defaultColDef}
                      localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                      columnDefs={ScrnColumns}
                      pagination={true}
                      paginationPageSize={10}
                      gridOptions={{ rowHeight: 40 }}
                    />
                  </div>
                </Box>
                {/* Ag그리드 박스 */}
              </Card>
            </Grid>
            <Grid item lg={6} xs={12}>
              <Card style={{ overflow: 'visible' }}>
                <form onSubmit={dtlSubmit(onSubmitDtl)}>
                  <Box className={media.w525 ? classes.detailsHeader : null}>
                    <h5 className={classes.detailsHeaderTitle}>화면 정보 상세</h5>

                    {/*  버튼 박스 */}
                    <Box className={media.w525 ? classes.detailsBtnBox : classes.w525detailsBtnBox}>
                      <Button
                        className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                        onClick={inputReset}
                        variant="contained"
                        color="primary"
                        disabled={UI_INFO?.ADD_FLAG === false ? false : true}
                      >
                        신규
                      </Button>
                      <Button
                        className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                        onClick={editClick}
                        variant="contained"
                        color="primary"
                        disabled={disabledHandler2(UI_INFO) ? false : true}
                      >
                        수정
                      </Button>
                      <Button
                        className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                        style={{ backgroundColor: disabledHandler2(UI_INFO) ? '#E0E0E0' : 'red' }}
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
                    <Grid container spacing={1}>
                      <Grid item lg={6} xs={12}>
                        <TextField
                          error={validate(errors?.SCRN_ID, getValues('SCRN_ID')) ? true : false}
                          helperText={validate(errors?.SCRN_ID, getValues('SCRN_ID')) ? '아이디를 입력해 주세요.' : false}
                          style={{ width: '100%' }}
                          label="아이디 *"
                          variant="outlined"
                          name="SCRN_ID"
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
                      <Grid item lg={6} xs={12}>
                        <TextField
                          error={validate(errors?.SCRN_NM, getValues('SCRN_NM')) ? true : false}
                          helperText={validate(errors?.SCRN_NM, getValues('SCRN_NM')) ? '이름를 입력해주세요.' : false}
                          style={{ width: '100%' }}
                          label="이름 *"
                          variant="outlined"
                          name="SCRN_NM"
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
                      <Grid item lg={6} xs={12}>
                        <FormControl size="small" variant="outlined" style={{ width: '100%' }}>
                          <InputLabel>서비스</InputLabel>
                          <Select
                            label="서비스"
                            value={DTL_DATA.SVC_CD || ''}
                            onChange={ev => SET_DTL_DATA(props => ({ ...props, SVC_CD: ev.target.value }))}
                            readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                          >
                            {svc_cd?.getCode?.map(option => (
                              <MenuItem key={option.COM_CD} value={option.COM_CD}>
                                {option.COM_CD_NM}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item lg={6} xs={12}>
                        <TextField
                          error={validate(errors?.SCRN_LNK_PTH, getValues('SCRN_LNK_PTH')) ? true : false}
                          helperText={validate(errors?.SCRN_LNK_PTH, getValues('SCRN_LNK_PTH')) ? '링크 경로를 입력해주세요.' : false}
                          style={{ width: '100%' }}
                          label="링크 경로 *"
                          variant="outlined"
                          name="SCRN_LNK_PTH"
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
                          label="설명"
                          variant="outlined"
                          name="SCRN_DESC"
                          inputRef={dtlRegister({ required: false })}
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
                      <Grid item xs={12}>
                                 <Box className="ag-theme-alpine" style={{ position: 'relative', height: '530px', width: '100%' }}>
                          <AgGridReact
                            headerHeight={35}
                            onGridReady={ev => SET_DTL_GRID_API(ev.api)}
                            rowSelection="multiple"
                            rowData={gridApiData?.getApi || []}
                            defaultColDef={{
                              ...defaultColDef,
                              cellStyle: () => (UI_INFO.INPUT_READ_ONLY ? null : { 'pointer-events': 'none' }),
                            }}
                            localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                            columnDefs={ApiColumns}
                            // onRowClicked={onRowClickd}
                            rowMultiSelectWithClick={true}
                            suppressRowClickSelection={UI_INFO.INPUT_READ_ONLY ? false : true}
                            onRowSelected={onRowSelectedApi}
                            gridOptions={{ rowHeight: 38 }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </form>
              </Card>
            </Grid>
          </Grid>
        </Box>
        {/* ######################################### */}
      </Container>
    </Page>
  )
}

export default AdminUserView
