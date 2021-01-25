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
  FormHelperText,
} from '@material-ui/core'
//################################################//

//########### Material-UI Date Pickers IMPORT #######//
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import Moment from 'moment'
//#####################################################//

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
//###################################################//

//############## SRC IMPORT   ##################//
import { GET_AREA, GET_DEALER_DATA, SHP_CTG_CD_DATA, GET_SHOP, SHOP_DEL, SHOP_ADD, SHOP_EDIT } from './ShopQuery'
import { disabledHandler2, ver } from 'src/components/Utils'
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
  //########## SEARCH CSS #############//
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
  formInputWidth: {
    width: '160px',
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
  //##################################//

  //############ GRID CSS #############//
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
  dtlBtn: theme.detailBtn,
  w525dtlBtn: {
    marginTop: '0.5em',
  },
  //#####################################//

  //############### DTL CSS ##############//
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
  w525detailsBtnBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    padding: '1em',
  },
}))
//#########################################//

const ShopView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //########## SHOP_MGT STATE ##############/
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    NAT_ID: '',
    STE_ID: '',
    CTY_ID: '',
    SHP_CTG_CD: '',
    SHP_NM: '',
    STRT_REG_DT: null,
    END_REG_DT: null,
  })
  const [DTL_DATA, SET_DTL_DATA] = useState({
    SHP_ID: '',
    SHP_NM: '',
    SHP_CTG_CD: '',
    DLR_ID: '',
    SHP_ADDR: '',
    NAT_ID: '',
    STE_ID: '',
    CTY_ID: '',
  })
  const [UI_INFO, SET_UI_INFO] = useState({
    SRCH_STT_URP: '',
    SRCH_CTY_URP: '',
    DTL_STE_URP: '',
    DTL_CTY_URP: '',
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    DEL_SHOP_ID: [],
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
    ON_ROW_CLIKC: false,
  })
  //#######################################/

  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)
  const shopCloumns = [
    {
      headerName: '샵 ID',
      field: 'SHP_ID',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: '샵 명',
      field: 'SHP_NM',
    },
    {
      headerName: '샵 카테고리',
      field: 'SHP_CTG_NM',
    },
    {
      headerName: '국가',
      field: 'NAT_NM',
    },
    {
      headerName: '시도',
      field: 'STE_NM',
    },
    {
      headerName: '시군구',
      field: 'CTY_NM',
    },
    {
      headerName: '주소',
      field: 'SHP_ADDR',
    },
    {
      headerName: '딜러유형',
      field: 'DLR_TP_NM',
    },
    {
      headerName: '아이디',
      field: 'DLR_ID',
    },
    {
      headerName: '이름',
      field: 'USR_NM',
    },
    {
      headerName: '머신수',
      field: 'MCM_CNT',
    },
    {
      headerName: '등록일',
      field: 'REG_DT',
    },
  ]
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    width: 153,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }
  //##############################################//

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { register: srchRegister, handleSubmit: srchSubmit } = useForm()
  const { register: dtlRegister, handleSubmit: dtlSubmit, reset, setValue, getValues } = useForm()
  //#################################################################//

  //########## 공동코드 및 함수 ###############//
  const variables = param => ({ fetchPolicy: 'network-only', variables: { param, ver } })
  const areaVariables = (AREA_TP_CD, urpId) => ({
    skip: urpId === '' || urpId === undefined,
    variables: {
      param: {
        AREA_TP_CD,
        UPR_AREA_ID: urpId,
      },
      ver,
    },
  })
  const resetInfo = () => {
    SET_UI_INFO(props => ({ ...props, ADD_FLAG: false, EDIT_FLAG: false, INPUT_READ_ONLY: false, INPUT_VARIDATE: false }))
  }
  const resetDtl = () => {
    SET_DTL_DATA(props => ({
      ...props,
      SHP_ID: '',
      SHP_NM: '',
      SHP_CTG_CD: '',
      DLR_ID: '',
      SHP_ADDR: '',
      NAT_ID: '',
      STE_ID: '',
      CTY_ID: '',
    }))
    reset()
  }
  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: NAT_CD } = useQuery(GET_AREA, variables({ AREA_TP_CD: '001' }))
  const { data: SRCH_STT_CD } = useQuery(GET_AREA, areaVariables('002', UI_INFO.SRCH_STT_URP))
  const { data: SRCH_CTY_CD } = useQuery(GET_AREA, areaVariables('003', UI_INFO.SRCH_CTY_URP))
  const { data: DLR_DATA } = useQuery(GET_DEALER_DATA, variables({ DLR_TP_CD: '' }))
  const { data: SHP_CTG_CD } = useQuery(SHP_CTG_CD_DATA)
  const { data: cityCode } = useQuery(GET_AREA, areaVariables('002', UI_INFO.DTL_STE_URP))
  const { data: countyCode } = useQuery(GET_AREA, areaVariables('003', UI_INFO.DTL_CTY_URP))
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//
  const [LOAD_SHOP, { data: LOAD_SHOP_DATA }] = useLazyQuery(GET_SHOP, {
    variables: { param: SRCH_DATA, ver },
    fetchPolicy: 'network-only',
  })
  const [addMutation] = useMutation(SHOP_ADD, { variables: { param: DTL_DATA, ver } })
  const [editMutation] = useMutation(SHOP_EDIT, { variables: { param: DTL_DATA, ver } })
  const [delMutation] = useMutation(SHOP_DEL, { variables: { param: { SHP_IDS: UI_INFO.DEL_SHOP_ID }, ver } })
  //###########################################################//

  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node => node.setSelected(node.data.SHP_ID === DTL_DATA?.SHP_ID))
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }

  }, [UI_INFO.SEL_FOCUS, LOAD_SHOP_DATA, GRID_API, DTL_DATA.SHP_ID, LOAD_SHOP])

  //##############  SRCH_EVENT   ##################//

  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_SHOP useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    SET_SRCH_DATA(props => ({ ...props, ...datas }))
    LOAD_SHOP()
    resetInfo()
    resetDtl()
  }
  /**
   * 국가,시도 선택시 입력함수
   * @param {object} event 국가,시도 선택된 Value값
   */
  const onChangeSrchSelect = event => {
    const { name, value } = event.target
    SET_SRCH_DATA(props => ({ ...props, [name]: value }))
    if (name === 'NAT_ID') {
      SET_UI_INFO(props => ({ ...props, SRCH_STT_URP: value }))
      SET_UI_INFO(props => ({ ...props, SRCH_CTY_URP: value }))
      SET_SRCH_DATA(props => ({ ...props, STE_ID: '' }))
      SET_SRCH_DATA(props => ({ ...props, CTY_ID: '' }))
    }
    if (name === 'STE_ID') {
      SET_UI_INFO(props => ({ ...props, SRCH_CTY_URP: value }))
      SET_SRCH_DATA(props => ({ ...props, CTY_ID: '' }))
    }
  }
  //###################################################//

  //##################   GRID_EVENT    ##################//

  /**
   * 그리드 데이터 선택 함수.
   * 디스패치 실행시켜 Detail컴포넌트에게 클릭한 데이터를 보냄
   * @param {object} ev 데이터 선택시 해당 공지사항 데이터를 받아옴.
   */
  const onRowClickd = ev => {
    setValue('SHP_ID', ev.data.SHP_ID)
    setValue('SHP_NM', ev.data.SHP_NM)
    setValue('SHP_ADDR', ev.data.SHP_ADDR)
    SET_DTL_DATA(props => ({
      ...props,
      SHP_CTG_CD: ev.data.SHP_CTG_CD,
      DLR_ID: ev.data.DLR_ID,
      NAT_ID: ev.data.NAT_ID,
      STE_ID: ev.data.STE_ID,
      CTY_ID: ev.data.CTY_ID,
    }))
    SET_UI_INFO(props => ({ ...props, DTL_STE_URP: ev.data.NAT_ID, DTL_CTY_URP: ev.data.STE_ID }))
    resetInfo()
  }

  /**
   * onRowClickd함수에서 ChackBox클릭시 row 데이터를 받아오지 못하는 오류가 발생.
   * 그래서 row선택이 되면 전체를 인지하고 데이터를 받아올수있는 함수추가.
   * 이함수는 다수의 데이터를 클릭하여 삭제하는 이벤트와 수정시 해당 데이터를 포커싱하는 이벤트을 담당
   * @param {object} ev 선택된 데이터의 데이터 값
   */
  const onRowSelected = ev => {
    const clickNtcData = GRID_API.getSelectedRows().map(data => data.SHP_ID)
    SET_UI_INFO(props => ({ ...props, DEL_SHOP_ID: clickNtcData }))
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
              if (result.data.delShop.rsltCd === 'OK') {
                toast.success('정상적으로 삭제 되었습니다.')
                resetDtl()
                LOAD_SHOP()
              } else {
                toast.error('다시 시도해주세요.')
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
   * 신규 클릭시 디스패치 이용한 상태 변경 함수
   */
  const inputReset = () => {
    SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, ADD_FLAG: true }))
    resetDtl()
    GRID_API.deselectAll()
  }

  /**
   * 수정 클릭시 디스패치 이용한 상태 변경 함수
   */
  const editClick = () => {
    if (getValues('SHP_ID') !== '') {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, EDIT_FLAG: true }))
    } else {
      toast.error(`수정을 원하는 샵을 클릭해주세요.`)
    }
  }

  /**
   * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시
   * submit Flag의 따라 실행되는 함수.
   * @param {object} data 인풋 데이터
   */
  const onSubmitDtl = async datas => {
    await SET_DTL_DATA(props => ({ ...props, ...datas })) //subMit인풋 데이터
    if (datas.SHP_ID === '' || datas.SHP_NM === '' || DTL_DATA.DLR_ID === '') {
      SET_UI_INFO(props => ({ ...props, INPUT_VARIDATE: true }))
      toast.error('빈칸을 입력 및 선택해주세요.')
    } else {
      if (UI_INFO?.ADD_FLAG === true) {
        //신규 subMit 실행 함수
        if (LOAD_SHOP_DATA?.getShop?.map(item => item.SHP_ID).some(id => id === datas.SHP_ID)) {
          toast.error('중복된 ID가 존재합니다.')
        } else {
          try {
            const result = await addMutation()
            console.log(result)
            if (result.data.saveShop.rsltCd === 'OK') {
              toast.success('성공적으로 추가 되었습니다.')
              resetDtl()
              resetInfo()
              LOAD_SHOP()
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
          console.log(result)
          if (result.data.saveShop.rsltCd === 'OK') {
            toast.success('성공적으로 수정 되었습니다.')
            resetInfo()
            SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
            LOAD_SHOP()
          }
        } catch (err) {
          resetInfo()
          toast.error(`${err} 오류가 발생했습니다.`)
        }
      }
    }
  }

  const onChangeDtlSelect = ev => {
    const { name, value } = ev.target
    SET_DTL_DATA(props => ({ ...props, [name]: value }))
    if (name === 'NAT_ID') {
      SET_UI_INFO(props => ({ ...props, DTL_STE_URP: value }))
      SET_UI_INFO(props => ({ ...props, DTL_CTY_URP: value }))
      SET_DTL_DATA(props => ({ ...props, STE_ID: '' }))
      SET_DTL_DATA(props => ({ ...props, CTY_ID: '' }))
    }
    if (name === 'STE_ID') {
      SET_UI_INFO(props => ({ ...props, DTL_CTY_URP: value }))
      SET_DTL_DATA(props => ({ ...props, CTY_ID: '' }))
    }
  }
  //#########################################################//

  return (
    <Page className={classes.page} title="샵 관리">
      <Container maxWidth={false} className={classes.gridContainer}>
        {/* ################# SEARCH UI  #################### */}
        <Box className={classes.searchBox}>
          <Card className={media.w490 ? classes.searchCard : classes.w490searchCard}>
            <form onSubmit={srchSubmit(onSubmitSrch)}>
              <Box className={media.w490 ? classes.formBox : null}>
                <Grid container spacing={1}>
                  <Grid style={{ width: media.w490 ? null : '100%' }} item>
                    <FormControl
                      size="small"
                      variant="outlined"
                      className={classes.formInputWidth}
                      style={{ width: media.w490 ? null : '100%' }}
                    >
                      <InputLabel>국가</InputLabel>
                      <Select
                        label="국가"
                        name="NAT_ID"
                        onChange={onChangeSrchSelect}
                        value={SRCH_DATA.NAT_ID !== '' ? SRCH_DATA.NAT_ID : ''}
                      >
                        <MenuItem value={''}>전체</MenuItem>
                        {NAT_CD?.getArea?.map(option => (
                          <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                            {option.AREA_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid style={{ width: media.w490 ? null : '100%' }} item>
                    <FormControl
                      size="small"
                      variant="outlined"
                      className={classes.formInputWidth}
                      style={{ width: media.w490 ? null : '100%' }}
                    >
                      <InputLabel>시도</InputLabel>
                      <Select
                        label="시도"
                        name="STE_ID"
                        value={SRCH_DATA.STE_ID !== '' ? SRCH_DATA.STE_ID : ''}
                        onChange={onChangeSrchSelect}
                      >
                        <MenuItem value={''}>전체</MenuItem>
                        {SRCH_STT_CD?.getArea?.map(option => (
                          <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                            {option.AREA_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid style={{ width: media.w490 ? null : '100%' }} item>
                    <FormControl
                      size="small"
                      variant="outlined"
                      className={classes.formInputWidth}
                      style={{ width: media.w490 ? null : '100%' }}
                    >
                      <InputLabel>시군구</InputLabel>
                      <Select
                        label="시군구"
                        name="CTY_ID"
                        value={SRCH_DATA.CTY_ID !== '' ? SRCH_DATA.CTY_ID : ''}
                        onChange={onChangeSrchSelect}
                      >
                        <MenuItem value={''}>전체</MenuItem>
                        {SRCH_CTY_CD?.getArea?.map(option => (
                          <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                            {option.AREA_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid style={{ width: media.w490 ? null : '100%' }} item>
                    <FormControl
                      size="small"
                      variant="outlined"
                      className={classes.formInputWidth}
                      style={{ width: media.w490 ? null : '100%' }}
                    >
                      <InputLabel>샵 카테고리</InputLabel>
                      <Select
                        label="샵 카테고리"
                        name="SHP_CTG_CD"
                        value={SRCH_DATA.SHP_CTG_CD || ''}
                        onChange={onChangeSrchSelect}
                      >
                        <MenuItem value={''}>전체</MenuItem>
                        {SHP_CTG_CD?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid style={{ width: media.w490 ? null : '100%' }} item>
                    <TextField
                      className={classes.formInputWidth}
                      style={{ width: media.w490 ? null : '100%' }}
                      label="샵 명"
                      variant="outlined"
                      type="text"
                      name="SHP_NM"
                      inputRef={srchRegister}
                      size="small"
                    />
                  </Grid>
                  <Grid style={{ width: media.w490 ? null : '100%' }} item>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        invalidDateMessage={false}
                        style={{ width: media.w490 ? null : '100%' }}
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        label="시작일"
                        format="yyyy-MM-dd"
                        onChange={ev =>
                          SET_SRCH_DATA(props => ({
                            ...props,
                            STRT_REG_DT:
                              Moment(ev).format('YYYY.MM.DD') === 'Invalid date' ? '' : Moment(ev).format('YYYY.MM.DD'),
                          }))
                        }
                        value={SRCH_DATA.STRT_REG_DT}
                        size="small"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid style={{ width: media.w490 ? null : '100%' }} item>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        invalidDateMessage={false}
                        style={{ width: media.w490 ? null : '100%' }}
                        autoOk
                        variant="inline"
                        inputVariant="outlined"
                        label="마지막일"
                        format="yyyy-MM-dd"
                        onChange={ev =>
                          SET_SRCH_DATA(props => ({
                            ...props,
                            END_REG_DT: Moment(ev).format('YYYY.MM.DD') === 'Invalid date' ? '' : Moment(ev).format('YYYY.MM.DD'),
                          }))
                        }
                        value={SRCH_DATA.END_REG_DT}
                        size="small"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Button
                  onClick={() => SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: false }))}
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
                  총{LOAD_SHOP_DATA?.getShop?.length > 0 ? <span>{LOAD_SHOP_DATA?.getShop?.length}</span> : <span>0</span>}건
                </h3>
              </div>
              <div>
                <Button
                  className={classes.tableBtn}
                  onClick={onRemove}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={UI_INFO?.DEL_SHOP_ID?.length > 0 ? false : true}
                >
                  삭제
                </Button>
              </div>
            </Box>
            {/* TopBar 박스 */}

            {/* Ag그리드 박스 */}
            <Box>
              <div className="ag-theme-alpine" style={{ position: 'relative', height: '550px', width: '100%' }}>
                <AgGridReact
                  headerHeight={35}
                  onRowClicked={onRowClickd}
                  onRowSelected={onRowSelected}
                  onGridReady={ev => SET_GRID_API(ev.api)}
                  rowSelection="multiple"
                  rowData={LOAD_SHOP_DATA?.getShop || []}
                  defaultColDef={defaultColDef}
                  localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                  columnDefs={shopCloumns}
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
              <Box className={media.w525 ? classes.detailsHeader : null}>
                <h5 className={classes.detailsHeaderTitle}>샵 정보 상세</h5>

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
              <CardContent className={media.w800 ? classes.inputCardContent : classes.w800inputCardContent}>
                {/* 디테일 인풋폼 그리드 컨테이너 */}
                <Grid container spacing={2}>
                  <Grid item lg={3} xs={12}>
                    <TextField
                      error={UI_INFO.INPUT_VARIDATE ? true : false}
                      helperText={UI_INFO.INPUT_VARIDATE ? '샵 ID를 입력해주세요.' : false}
                      style={{ width: '100%' }}
                      label="샵 ID"
                      variant="outlined"
                      name="SHP_ID"
                      inputRef={dtlRegister}
                      size="small"
                      InputProps={
                        UI_INFO.ADD_FLAG
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
                      error={UI_INFO.INPUT_VARIDATE ? true : false}
                      helperText={UI_INFO.INPUT_VARIDATE ? '샵 명을 입력해주세요.' : false}
                      style={{ width: '100%' }}
                      label="샵 명"
                      variant="outlined"
                      name="SHP_NM"
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
                    <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                      <InputLabel>샵 카테고리</InputLabel>
                      <Select
                        label="샵 카테고리"
                        name="SHP_CTG_CD"
                        onChange={onChangeDtlSelect}
                        value={DTL_DATA?.SHP_CTG_CD || ''}
                        readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                      >
                        {SHP_CTG_CD?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <FormControl style={{ width: '100%' }} size="small" variant="outlined" error={UI_INFO.INPUT_VARIDATE}>
                      <InputLabel>딜러유형/아이디/이름</InputLabel>
                      <Select
                        label="딜러유형/아이디/이름"
                        name="DLR_ID"
                        onChange={onChangeDtlSelect}
                        value={DLR_DATA?.getDealerTree !== undefined ? DTL_DATA?.DLR_ID || '' : ''}
                        readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                      >
                        {DLR_DATA?.getDealerTree?.map(option => (
                          <MenuItem key={option.DLR_ID} value={option.DLR_ID}>
                            {`${option.DLR_TP_NM} / ${option.DLR_ID} / ${option.USR_NM} `}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{UI_INFO.INPUT_VARIDATE ? '딜러를 선택해주세요.' : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <TextField
                      style={{ width: '100%' }}
                      label="주소"
                      variant="outlined"
                      name="SHP_ADDR"
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
                    <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                      <InputLabel>국가</InputLabel>
                      <Select
                        label="국가"
                        name="NAT_ID"
                        onChange={onChangeDtlSelect}
                        value={DTL_DATA.NAT_ID}
                        readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                      >
                        {NAT_CD?.getArea?.map(option => (
                          <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                            {option.AREA_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                      <InputLabel>시도</InputLabel>
                      <Select
                        label="시도"
                        name="STE_ID"
                        onChange={onChangeDtlSelect}
                        value={cityCode?.getArea !== undefined ? DTL_DATA?.STE_ID || '' : ''}
                        readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                      >
                        {cityCode?.getArea?.map(option => (
                          <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                            {option.AREA_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                      <InputLabel>시군구</InputLabel>
                      <Select
                        label="시군구"
                        name="CTY_ID"
                        onChange={onChangeDtlSelect}
                        value={countyCode?.getArea !== undefined ? DTL_DATA?.CTY_ID || '' : ''}
                        readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                      >
                        {countyCode?.getArea?.map(option => (
                          <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                            {option.AREA_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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

export default ShopView
