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
import { GET_API, MDLE_CD, ADD_API, EDI_API, DEL_API } from './ApiQuery'
//###################################################//

//############## SRC IMPORT   ##################//
import { disabledHandler2, validate, ver } from 'src/components/Utils'
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
import useMedia from 'src/components/useMedia'

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
  //############ SEARCH CSS #############//
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
    marginRight: '5em',
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
  //###############################//

  //############# GRID CSS ############//
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
  //######################################//

  //############# DTAIL CSS ################//
  detailBtn: theme.detailBtn,
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
  w525detailBtn: {
    marginTop: '0.5em',
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

const ApiView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)
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
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    width: 200,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }
  //##############################################//

  //########## SHOP_MGT STATE ##############/
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    API_NM: '',
    API_VER: '',
    MDLE_CD: '',
  })
  const [DTL_DATA, SET_DTL_DATA] = useState({
    API_ID: '',
    API_NM: '',
    API_VER: '',
    API_EPT_PTH: '',
    FUNC_CD: '',
    API_DESC: '',
    MDLE_CD: '',
  })
  const [UI_INFO, SET_UI_INFO] = useState({
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    DEL_API_ID: [],
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
    ON_ROW_CLIKC: false,
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
    SET_UI_INFO(props => ({ ...props, ADD_FLAG: false, EDIT_FLAG: false, INPUT_READ_ONLY: false, INPUT_VARIDATE: false }))
  }

  /**
   * 디테일 인풋값을 공백으로 초기화 시키는 이벤트
   */
  const resetDtl = () => {
    SET_DTL_DATA(props => ({ ...props, API_ID: '', API_NM: '', API_VER: '', API_EPT_PTH: '', FUNC_CD: '', API_DESC: '', MDLE_CD: '' }))
    reset()
  }
  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: mdleType} = useQuery(MDLE_CD)
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//
  const [LOAD_API, { data: LOAD_API_DATA }] = useLazyQuery(GET_API, {
    variables: { param: SRCH_DATA, ver },
    fetchPolicy: 'network-only',
  })
  const [addMutation] = useMutation(ADD_API, { variables: { param: DTL_DATA, ver } })
  const [editMutation] = useMutation(EDI_API, { variables: { param: DTL_DATA, ver } })
  const [delMutation] = useMutation(DEL_API, { variables: { param: { API_IDS: UI_INFO.DEL_API_ID }, ver } })
  //###########################################################//

  //#################### useEffect ###############//
  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node => node.setSelected(node.data.API_ID === DTL_DATA?.API_ID))
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }
 
  }, [UI_INFO.SEL_FOCUS, GRID_API, DTL_DATA.API_ID, LOAD_API, LOAD_API_DATA])
  //##############################################//

  //##############  SRCH_EVENT   ##################//
  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_API useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    SET_SRCH_DATA(props => ({ ...props, ...datas }))
    LOAD_API()
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
    setValue('API_ID', ev?.data?.API_ID)
    setValue('API_NM', ev?.data?.API_NM)
    setValue('API_DESC', ev?.data?.API_DESC)
    setValue('API_VER', ev?.data?.API_VER)
    setValue('API_EPT_PTH', ev?.data?.API_EPT_PTH)
    setValue('FUNC_CD', ev?.data?.FUNC_CD)
    SET_DTL_DATA(props => ({ ...props, MDLE_CD: ev.data.MDLE_CD }))
    resetInfo()
  }

  /**
   * onRowClickd함수에서 ChackBox클릭시 row 데이터를 받아오지 못하는 오류가 발생.
   * 그래서 row선택이 되면 전체를 인지하고 데이터를 받아올수있는 함수추가.
   * 이함수는 다수의 데이터를 클릭하여 삭제하는 이벤트와 수정시 해당 데이터를 포커싱하는 이벤트을 담당
   * @param {object} ev 선택된 데이터의 데이터 값
   */
  const onRowSelected = ev => {
    const clickData = GRID_API.getSelectedRows().map(data => data.API_ID)
    SET_UI_INFO(props => ({ ...props, DEL_API_ID: clickData }))
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
              if (result.data.delApi.rsltCd === 'OK') {
                toast.success('정상적으로 삭제 되었습니다.')
                resetDtl()
                LOAD_API()
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

  //###################################################//

  //##############   DTL_EVENT    ##################//
  /**
   * 신규 클릭시 useState이용한 상태 변경 함수
   */
  const inputReset = () => {
    SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, ADD_FLAG: true, EDIT_FLAG: false }))
    resetDtl()
    GRID_API.deselectAll()
  }

  /**
   * 수정 클릭시 useState이용한 상태 변경 함수
   */
  const editClick = () => {
    if (getValues('API_ID') !== '') {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, EDIT_FLAG: true, ADD_FLAG: false }))
    } else {
      toast.error(`수정을 원하는 API를 클릭해주세요.`)
    }
  }

  /**
   * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시
   * submit Flag의 따라 실행되는 함수.
   * @param {object} data 인풋 데이터
   */
  const onSubmitDtl = async datas => {
    SET_DTL_DATA(props => ({ ...props, ...datas })) //subMit인풋 데이터
    if (UI_INFO?.ADD_FLAG === true) {
      //신규 subMit 실행 함수
      if (LOAD_API?.getApi?.map(item => item.API_ID).some(id => id === datas.API_ID)) {
        toast.error('중복된 ID가 존재합니다.')
      } else {
        try {
          const result = await addMutation()
          console.log(result)
          if (result.data.saveApi.rsltCd === 'OK') {
            toast.success('성공적으로 추가 되었습니다.')
            resetDtl()
            resetInfo()
            LOAD_API()
          }
        }catch (err) {
          resetInfo()
          toast.error(`${err} 오류가 발생했습니다.`)
      }
      }
    }
    if (UI_INFO?.EDIT_FLAG === true) {
      //수정 subMit 실행 함수
      try {
        const result = await editMutation()
        console.log(result)
        if (result.data.saveApi.rsltCd === 'OK') {
          toast.success('성공적으로 수정 되었습니다.')
          resetInfo()
          SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
          LOAD_API()
        }
      } catch (err) {
        resetInfo()
        toast.error(`${err} 오류가 발생했습니다.`)
    }
    }
  }
  //#########################################################//
  return (
    <Page className={classes.page} title="API 관리">
      <Container maxWidth={false} className={classes.gridContainer}>
        {/* ################# SEARCH UI  #################### */}
        <Box className={classes.searchBox}>
          <Card className={media.w490 ? classes.searchCard : classes.w490searchCard}>
            <form onSubmit={srchSubmit(onSubmitSrch)}>
              <Box className={media.w490 ? classes.formBox : null}>
                <Grid container spacing={1} style={{ width: media.w490 ? '60%' : null }}>
                  <Grid item lg={4} xs={12}>
                    <TextField
                      style={{ width: '100%' }}
                      label="API명"
                      variant="outlined"
                      type="text"
                      name="API_NM"
                      inputRef={srchRegister}
                      size="small"
                    />
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <TextField
                      style={{ width: '100%' }}
                      label="버전"
                      variant="outlined"
                      type="text"
                      name="API_VER"
                      inputRef={srchRegister}
                      size="small"
                    />
                  </Grid>

                  <Grid item lg={4} xs={12}>
                    <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                      <InputLabel>모듈</InputLabel>
                      <Select
                        label="모듈"
                        value={SRCH_DATA.MDLE_CD}
                        onChange={ev => SET_SRCH_DATA(props => ({ ...props, MDLE_CD: ev.target.value }))}
                      >
                        <MenuItem value={''}>전체</MenuItem>
                        {mdleType?.getCode?.map(option => (
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
        {/* ################################################ */}

        {/* ################# GRID UI  #################### */}
        <Box mt={1}>
          <Card>
            {/* TopBar 박스 */}
            <Box className={classes.TopBarBox}>
              <div>
                <h3>총{LOAD_API_DATA?.getUser?.length > 0 ? <span>{LOAD_API_DATA?.getUser?.length}</span> : <span>0</span>}건</h3>
              </div>
              <div>
                <Button
                  className={classes.tableBtn}
                  onClick={onRemove}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={UI_INFO?.DEL_API_ID?.length > 0 ? false : true}
                >
                  삭제
                </Button>
              </div>
            </Box>
            {/* TopBar 박스 */}

            {/* Ag그리드 박스 */}
            <Box>
              <div className="ag-theme-alpine" style={{ position: 'relative', height: '500px', width: '100%' }}>
                <AgGridReact
                  headerHeight={35}
                  onRowClicked={onRowClickd}
                  onRowSelected={onRowSelected}
                  onGridReady={ev => SET_GRID_API(ev.api)}
                  rowSelection="multiple"
                  rowData={LOAD_API_DATA?.getApi || []}
                  defaultColDef={defaultColDef}
                  localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                  columnDefs={ApiColumns}
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
          <Card style={{ overflow: 'visible' }}>
            <form onSubmit={dtlSubmit(onSubmitDtl)}>
              <Box className={media.w525 ? classes.detailsHeader : null}>
                <h5 className={classes.detailsHeaderTitle}>운영자 정보 상세</h5>

                {/*  버튼 박스 */}
                <Box className={media.w525 ? classes.detailsBtnBox : classes.w525detailsBtnBox}>
                  <Button
                    className={media.w525 ? classes.detailBtn : classes.w525detailBtn}
                    onClick={inputReset}
                    variant="contained"
                    color="primary"
                    disabled={UI_INFO?.ADD_FLAG === false ? false : true}
                  >
                    신규
                  </Button>
                  <Button
                    className={media.w525 ? classes.detailBtn : classes.w525detailBtn}
                    onClick={editClick}
                    variant="contained"
                    color="primary"
                    disabled={disabledHandler2(UI_INFO) ? false : true}
                  >
                    수정
                  </Button>
                  <Button
                    className={media.w525 ? classes.detailBtn : classes.w525detailBtn}
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
                {/* 디테일 인풋폼 그리드 컨테이너 */}
                <Grid style={{ marginBottom: '1.5em', marginTop: '0.5em' }} container spacing={1}>
                  <Grid item lg={3} xs={12}>
                    <TextField
                      error={validate(errors?.API_ID, getValues('API_ID')) ? true : false}
                      helperText={validate(errors?.API_ID, getValues('API_ID')) ? '아이디를 입력해 주세요.' : false}
                      style={{ width: '100%' }}
                      label="아이디 *"
                      variant="outlined"
                      name="API_ID"
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
                  <Grid item lg={3} xs={12}>
                    <TextField
                      error={validate(errors?.API_NM, getValues('API_NM')) ? true : false}
                      helperText={validate(errors?.API_NM, getValues('API_NM')) ? '이름를 입력해주세요.' : false}
                      style={{ width: '100%' }}
                      label="이름 *"
                      variant="outlined"
                      name="API_NM"
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
                  <Grid item lg={3} xs={12}>
                    <FormControl size="small" variant="outlined" style={{ width: '100%' }}>
                      <InputLabel>모듈</InputLabel>
                      <Select
                        label="모듈"
                        value={DTL_DATA.MDLE_CD || ''}
                        onChange={ev => SET_DTL_DATA(props => ({ ...props, MDLE_CD: ev.target.value }))}
                        readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                      >
                        {mdleType?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item lg={3} xs={12}>
                    <TextField
                      style={{ width: '100%' }}
                      label="버전 *"
                      variant="outlined"
                      name="API_VER"
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
                      style={{ width: '100%' }}
                      label="END POINT *"
                      variant="outlined"
                      name="API_EPT_PTH"
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
                      error={errors?.FUNC_CD ? true : false}
                      helperText={errors?.FUNC_CD ? 'C, R, U, D 중 하나를 입력하세요.' : false}
                      style={{ width: '100%' }}
                      label="기능(C, R, U, D) *"
                      variant="outlined"
                      name="FUNC_CD"
                      inputRef={dtlRegister({ required: true, pattern: /[CRUD]{1}/, maxLength: 1 })}
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
                      style={{ width: '100%' }}
                      label="설명"
                      variant="outlined"
                      name="API_DESC"
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
                </Grid>
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

export default ApiView
