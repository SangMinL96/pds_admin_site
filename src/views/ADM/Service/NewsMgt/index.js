import React, {  useEffect, useRef, useState } from 'react'
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
  FormControlLabel,
  Checkbox,
  Chip,
} from '@material-ui/core'
import Moment from 'moment'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import { DropzoneAreaBase } from 'material-ui-dropzone'
//################################################//

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import { GET_AREA, GET_UPR_AREA, NTC_DATA, ADD_NTC, DEL_NTC, EDIT_NTC, SVC_CD } from './NewsQuery'
//###################################################//

//############# MultiSelect IMPORT ##############//
import MultiSelects from 'react-multi-select-component'
//##############################################//

//############# CK Editor IMPORT ###############//
import CKEditor from '@ckeditor/ckeditor5-react'
import classicEditor from '@ckeditor/ckeditor5-build-classic'
//#############################################//

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

//############### AreaTree Component IMPORT ##########//
import DetailTree from './DetailTree'
//####################################################//

//############## SRC IMPORT   ##################//
import { disabledHandler2, fileload, fileRemove, fileUpload, onFileAdd, serviceValue, validate, ver } from 'src/components/Utils'
import useMedia from 'src/components/useMedia'
import styled from 'styled-components'
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
  w525dtlBtn: {
    marginTop: '0.5em',
  },
  dtlBtn: theme.detailBtn,
  detailsHeader: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  detailsHeaderTitle: theme.detailTitle,
  detailsBtnBox: {
    width: '50%',
    marginTop: '0.5em',
    marginRight: '0.8em',
    display: 'flex',
    justifyContent: 'flex-end',
  },

  inputCardContent: {
    display: 'flex',
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
  },
  checkBox: {
    width: '120px',
    marginLeft: '0.6em',
  },
  inputWidth: {
    width: '200px',
  },

  fileContainer: {
    width: '30%',
  },
  editorBox: {
    width: '75%',
    display: 'flex',
    marginLeft: '1em',
    '& .MuiDropzoneArea-root': {
      width: '100%',
      minHeight: '100px',
      height: '15vh',
      overflowY: 'auto',
      border: '1px solid #CCCCCC',
    },
  },
  editorLayout: {
    width: '70%',
    position: 'relative',
    marginRight: '1em',
    zIndex: 70,
  },

  fileChipsCard: {
    overflowY: 'auto',
    padding: '12px',
    marginTop: '0.5em',
    height: '155px',
    border: '1px solid #e3e3e3',
  },
  fileChipsBox: {
    display: 'flex',
    justifyContent: 'center',
  },
  Chips: {
    margin: '5px',
    width: '220px',
    justifyContent: 'space-between',
  },

  TreeBox: {
    padding: '1em',
    height: '175px',
    marginTop: '1em',
    border: '1px solid #e3e3e3',
    overflowY: 'auto',
    '& h3': {
      marginLeft: '1.2em',
    },
  },
  w800inputCardContent: {
    position: 'relative',
  },
  w800editorBox: {
    marginTop: '1em',
    width: '100%',
    '& .MuiDropzoneArea-root': {
      width: '100%',
      minHeight: '100px',
      height: '15vh',
      overflowY: 'auto',
      border: '1px solid #CCCCCC',
    },
  },
  w800fileContainer: {
    marginTop: '1em',
  },
  w800editorContent: {
    height: '230px',
    padding: '5px',
    borderRadius: '3px',
    border: '1px solid #CCCCCC',
  },
  w800editorToolBar: {
    border: '1px solid #CCCCCC',
  },

  w525detailsBtnBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    padding: '1em',
  },
}))
//########################################//

const NewsView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)

  const NewsCloumns = [
    {
      headerName: '서비스',
      field: 'SVC_NM_LST',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      suppressSizeToFit: true,
    },
    {
      headerName: '아이디',

      field: 'NTC_ID',
    },
    {
      headerName: '제목',

      field: 'NTC_NM',
    },
    {
      headerName: '내용',

      field: 'NTC_CONT',
    },
    {
      headerName: '첨부파일수',
      field: 'FL_CNT',
    },

    {
      headerName: '국가',
      field: 'NAT_CD_LST',
    },
    {
      headerName: '시도',

      field: 'STT_CD_LST',
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
    width: 198,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }
  //##############################################//

  //################ SHOP_MGT STATE ################/
  const EDITOR_VALUE = useRef('')
  const [MLT_SELECT, SET_MLT_SELECT] = useState([])
  const [DTL_MLT_SELECT, SET_DTL_MLT_SELECT] = useState([])
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    REG_DT: '',
    NAT_CD: '',
    STT_CD: '',
  })
  const [DTL_DATA, SET_DTL_DATA] = useState({
    NAT_CD_LST: undefined,
    STT_CD_LST: undefined,
    NTC_CONT: '',
    NTC_ID: '',
    NTC_NM: '',
    FIX_YN: false,
  })

  const [UI_INFO, SET_UI_INFO] = useState({
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    DEL_NTC_ID: [],
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
    ADD_CLICK: false,
    FILE_CHIPS: {
      fileId: [],
      fileNm: [],
    },
    DROP_FILE: [],
  })
  //#######################################/

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { register: srchRegister, handleSubmit: srchSubmit } = useForm()
  const { register: dtlRegister, handleSubmit: dtlSubmit, reset, errors, setValue, getValues } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
  })
  //#################################################################//

  //############### 공통함수 #################//
  const resetInfo = () => {
    SET_UI_INFO(props => ({
      ...props,
      ADD_FLAG: false,
      EDIT_FLAG: false,
      INPUT_READ_ONLY: false,
      INPUT_VARIDATE: false,
      DROP_FILE: [],
    }))
  }

  const resetDtl = () => {
    SET_DTL_DATA(props => ({ ...props, NAT_CD_LST: '', STT_CD_LST: '', NTC_CONT: '', NTC_ID: '', NTC_NM: '', FIX_YN: false }))
    SET_UI_INFO(props => ({ ...props, DROP_FILE: [], FILE_CHIPS: { fileId: [], fileNm: [] } }))
    SET_DTL_MLT_SELECT([])
    reset()
  }
  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: areacode } = useQuery(GET_AREA, {
    variables: { param: { AREA_TP_CD: '001' }, ver },
  })
  const { data: svc_code } = useQuery(SVC_CD)
  // 국가 선택시 skip 값이 false로 바껴 쿼리 실행. 국가 선택에 따라 시도 선택 목록이 바뀜.
  const { data: uprAreaCode } = useQuery(GET_UPR_AREA, {
    skip: SRCH_DATA.NAT_CD === '',
    variables: {
      param: {
        AREA_TP_CD: '002',
        UPR_AREA_ID: SRCH_DATA?.NAT_CD,
      },
      ver,
    },
  })
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//

  // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
  const [LOAD_NEWS, { data: LOAD_NEWS_DATA }] = useLazyQuery(NTC_DATA, {
    variables: {
      param: {
        ...SRCH_DATA,
        SVC_CD_LST: MLT_SELECT?.map(item => item.value)
          .sort()
          .toString(),
      },
      ver,
    },
    fetchPolicy: 'network-only',
  })
  const [addMutation] = useMutation(ADD_NTC, {
    //신규 추가 뮤테이션
    variables: {
      param: {
        ...DTL_DATA,
        SVC_CD_LST: DTL_MLT_SELECT?.map(item => item.value).toString(),
        FIX_YN: DTL_DATA.FIX_YN ? 'Y' : 'N',
        AUTR_ID_LST: '',
        GET_LAST_ROW: 'Y',
      },
      ver,
    },
  })
  const [editMutation] = useMutation(EDIT_NTC, {
    //데이터 수정 뮤테이션
    variables: {
      param: {
        ...DTL_DATA,
        SVC_CD_LST: DTL_MLT_SELECT?.map(item => item.value).toString(),
        FIX_YN: DTL_DATA.FIX_YN ? 'Y' : 'N',
        AUTR_ID_LST: '',
      },
      ver,
    },
  })
  const [delMutation] = useMutation(DEL_NTC, { variables: { param: { NTC_IDS: UI_INFO.DEL_NTC_ID }, ver } })
  //#############################################################//

  //################# useEffect ####################//


  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node => node.setSelected(node.data.NTC_ID === DTL_DATA.NTC_ID))
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }
    if (SRCH_DATA.NAT_CD === '') {
      SET_SRCH_DATA(props => ({ ...props, STT_CD: '' }))
    }
  
  }, [
    UI_INFO.SEL_FOCUS,
    GRID_API,
    LOAD_NEWS,
    SRCH_DATA.NAT_CD,
    LOAD_NEWS_DATA,
    DTL_DATA.NTC_ID,
    SET_UI_INFO,
  
  ])
  //#################################################//

  //##############  SRCH_EVENT   ##################//

  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_NEWS useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    SET_SRCH_DATA(props => ({ ...props, ...datas }))
    LOAD_NEWS()
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
    setValue('NTC_NM', ev?.data?.NTC_NM)
    SET_DTL_MLT_SELECT(ev?.data?.SVC_CD_LST?.split(',').map(item => ({ label: serviceValue(item), value: item })))
    SET_DTL_DATA(props => ({
      ...props,
      NTC_ID: ev?.data?.NTC_ID,
      FIX_YN: ev?.data?.FIX_YN === 'Y' ? true : false,
      NTC_CONT: ev?.data?.NTC_CONT || '',
      NAT_CD_LST: ev?.data?.NAT_CD_LST,
      STT_CD_LST: ev?.data?.STT_CD_LST,
    }))
    SET_UI_INFO(props => ({
      ...props,
      FILE_CHIPS: {
        ...UI_INFO.FILE_CHIPS,
        fileId: ev?.data?.FL_ID_LST?.split(',') || [],
        fileNm: ev?.data?.FL_NM_LST?.split(',') || [],
      },
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
    if (UI_INFO.SEL_FOCUS) {
      setValue('NTC_NM', ev?.data?.NTC_NM)
      SET_DTL_MLT_SELECT(ev?.data?.SVC_CD_LST?.split(',').map(item => ({ label: serviceValue(item), value: item })))
      SET_DTL_DATA(props => ({
        ...props,
        NTC_ID: ev?.data?.NTC_ID,
        FIX_YN: ev?.data?.FIX_YN === 'Y' ? true : false,
        NTC_CONT: ev?.data?.NTC_CONT || '',
        NAT_CD_LST: ev?.data?.NAT_CD_LST,
        STT_CD_LST: ev?.data?.STT_CD_LST,
      }))
      SET_UI_INFO(props => ({
        ...props,
        FILE_CHIPS: {
          ...UI_INFO.FILE_CHIPS,
          fileId: ev?.data?.FL_ID_LST?.split(',') || [],
          fileNm: ev?.data?.FL_NM_LST?.split(',') || [],
        },
      }))
      resetInfo()
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }
    const clickNtcData = GRID_API.getSelectedRows().map(data => data.NTC_ID)
    SET_UI_INFO(props => ({ ...props, DEL_NTC_ID: clickNtcData }))
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
              if (result.data.delNotice.rsltCd === 'OK') {
                toast.success('정상적으로 삭제 되었습니다.')
                resetDtl()
                LOAD_NEWS()
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
    SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, ADD_FLAG: true, EDIT_FLAG: false, ADD_CLICK: true }))
    resetDtl()
    GRID_API.deselectAll()
  }

  /**
   * 수정 클릭시 useState이용한 상태 변경 함수
   */
  const editClick = () => {
    if (DTL_DATA.NTC_ID !== '') {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, EDIT_FLAG: true, ADD_FLAG: false }))
    } else {
      toast.error(`수정을 원하는 공지사항을 클릭해주세요.`)
    }
  }

  /**
   * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시
   * submit Flag의 따라 실행되는 함수.
   * @param {object} data 인풋 데이터
   */
  const onSubmitDtl = async datas => {
    await SET_DTL_DATA(props => ({ ...props, NTC_NM: datas.NTC_NM, NTC_CONT: EDITOR_VALUE.current })) //subMit인풋 데이터

    if (String(EDITOR_VALUE.current).length < 8) {
      toast.error('공지사항 내용을 입력해주세요.')
    } else if (DTL_DATA?.NAT_CD_LST === '') {
      toast.error('국가를 선택해주세요.')
    } else {
      if (UI_INFO?.ADD_FLAG === true) {
        //신규 subMit 실행 함수
        if (EDITOR_VALUE.current === '') {
          toast.error('공지사항 내용을 추가해주세요.')
        } else {
          try {
            const result = await addMutation()
            if (result.data.saveNotice.rsltCd === 'OK') {
              fileUpload(UI_INFO.DROP_FILE, result.data.saveNotice.rsltCont, LOAD_NEWS, null, toast)
              toast.success('성공적으로 추가 되었습니다.')
              resetDtl()
              resetInfo()
            } else {
              toast.error('다시 시도해주세요.')
            }
          } catch (err) {
            resetInfo()
            toast.error(`${err} 오류가 발생했습니다.`)
        }
        }
      }
      if (UI_INFO?.EDIT_FLAG === true) {
        //수정 subMit 실행 함수
        try {
          const result = await editMutation()
          if (result.data.saveNotice.rsltCd === 'OK') {
            toast.success('성공적으로 수정 되었습니다.')
            fileUpload(UI_INFO.DROP_FILE, DTL_DATA.NTC_ID, LOAD_NEWS, SET_UI_INFO, toast)
            resetInfo()
          }
        } catch (err) {
          resetInfo()
          toast.error(`${err} 오류가 발생했습니다.`)
      }
      }
    }
  }

  const onChangeEditor = (ev, editor) => {
    EDITOR_VALUE.current = editor.getData()
  }

  //#########################################################//

  return (
    <Page className={classes.root} title="공지사항 관리">
      <Container maxWidth={false}>
        <Box mt={1}>
          <Box className={classes.searchBox}>
            <Card className={media.w490 ? classes.searchCard : classes.w490searchCard}>
              <form onSubmit={srchSubmit(onSubmitSrch)}>
                <Box className={media.w490 ? classes.formBox : null}>
                  <Grid container spacing={1}>
                    <Grid style={{ width: media.w490 ? null : '100%' }} item>
                      <TextField
                        className={classes.formInputWidth}
                        style={{ width: media.w490 ? null : '100%' }}
                        label="제목"
                        variant="outlined"
                        type="text"
                        name="NTC_NM"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>

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
                          name="NAT_CD"
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, NAT_CD: ev.target.value }))}
                          value={SRCH_DATA.NAT_CD || ''}
                        >
                          <MenuItem value={''}>전체</MenuItem>
                          {areacode?.getArea?.map(option => (
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
                          name="STT_CD"
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, STT_CD: ev.target.value }))}
                          value={SRCH_DATA.STT_CD || ''}
                        >
                          <MenuItem value={''}>전체</MenuItem>
                          {uprAreaCode?.getArea?.map(option => (
                            <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                              {option.AREA_NM}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid style={{ width: media.w490 ? null : '100%' }} item>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          style={{ width: media.w490 ? null : '100%' }}
                          autoOk
                          variant="inline"
                          inputVariant="outlined"
                          label="등록일"
                          format="yyyy-MM-dd"
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, REG_DT: Moment(ev).format('YYYY.MM.DD') }))}
                          value={SRCH_DATA.REG_DT || null}
                          size="small"
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>

                    <Grid style={{ width: media.w490 ? null : '100%' }} item>
                      <SrchMultiSelect
                        options={
                          svc_code !== undefined
                            ? svc_code?.getCode.map(item => ({
                                label: item.COM_CD_NM,
                                value: item.COM_CD,
                              }))
                            : []
                        }
                        value={MLT_SELECT}
                        onChange={SET_MLT_SELECT}
                        hasSelectAll={false}
                        disableSearch={true}
                        overrideStrings={{
                          selectSomeItems: <span style={{ color: '#546E7A' }}>공지 대상</span>,
                          allItemsAreSelected: null,
                        }}
                      />
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
        </Box>
        <Box mt={1}>
          <Card>
            {/* TopBar 박스 */}
            <Box className={classes.TopBarBox}>
              <div>
                <h3>
                  총{LOAD_NEWS_DATA?.getNotice?.length > 0 ? <span>{LOAD_NEWS_DATA?.getNotice?.length}</span> : <span>0</span>}건
                </h3>
              </div>
              <div>
                <Button
                  className={classes.tableBtn}
                  onClick={onRemove}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={DTL_DATA?.NTC_ID?.length > 0 ? false : true}
                >
                  삭제
                </Button>
              </div>
            </Box>
            {/* TopBar 박스 */}

            {/* Ag그리드 박스 */}
            <Box>
              <div className="ag-theme-alpine" style={{ position: 'relative', height: '400px', width: '100%' }}>
                <AgGridReact
                  headerHeight={35}
                  onRowClicked={onRowClickd}
                  onRowSelected={onRowSelected}
                  onGridReady={ev => SET_GRID_API(ev.api)}
                  rowSelection="multiple"
                  rowData={LOAD_NEWS_DATA?.getNotice || []}
                  defaultColDef={defaultColDef}
                  localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                  columnDefs={NewsCloumns}
                  pagination={true}
                  paginationPageSize={10}
                  gridOptions={{ rowHeight: 32 }}
                />
              </div>
            </Box>
            {/* Ag그리드 박스 */}
          </Card>
        </Box>
        <Box mt={1}>
          <Card style={{ marginBottom: '1em' }}>
            <form onSubmit={dtlSubmit(onSubmitDtl)}>
              <Box className={media.w490 ? classes.detailsHeader : null}>
                <h5 className={classes.detailsHeaderTitle}>공지사항 상세</h5>

                {/*  버튼 박스 */}
                <Box className={media.w525 ? classes.detailsBtnBox : classes.w525detailsBtnBox}>
                  <Button
                    className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                    onClick={() => inputReset()}
                    variant="contained"
                    color="primary"
                    disabled={UI_INFO?.ADD_FLAG === false ? false : true}
                  >
                    신규
                  </Button>
                  <Button
                    className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                    style={{ marginLeft: media.w490 ? '0.5em' : null }}
                    onClick={() => editClick()}
                    variant="contained"
                    color="primary"
                    disabled={disabledHandler2(UI_INFO) ? false : true}
                  >
                    수정
                  </Button>
                  <Button
                    className={media.w525 ? classes.dtlBtn : classes.w525dtlBtn}
                    style={{ marginLeft: media.w490 ? '0.5em' : null, backgroundColor: disabledHandler2(UI_INFO) ? '#E0E0E0' : 'red' }}
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
                <Box maxWidth={355} mt={2}>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Box display="flex">
                        <TextField
                          className={classes.inputWidth}
                          error={validate(errors?.NTC_NM, getValues('NTC_NM')) ? true : false}
                          helperText={validate(errors?.NTC_NM, getValues('NTC_NM')) ? '제목를 입력해주세요.' : false}
                          label="제목"
                          variant="outlined"
                          type="text"
                          name="NTC_NM"
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
                        <FormControlLabel
                          className={classes.checkBox}
                          control={
                            <Checkbox
                              checked={DTL_DATA.FIX_YN !== undefined ? DTL_DATA.FIX_YN : false}
                              onChange={ev =>
                                UI_INFO.INPUT_READ_ONLY ? SET_DTL_DATA(props => ({ ...props, FIX_YN: ev.target.checked })) : null
                              }
                              color="primary"
                            />
                          }
                          label="고정 여부"
                        />
                      </Box>
                    </Grid>

                    <Grid item>
                      <DtlMultiSelect
                        options={
                          UI_INFO.INPUT_READ_ONLY
                            ? svc_code !== undefined
                              ? svc_code?.getCode.map(item => ({
                                  label: item.COM_CD_NM,
                                  value: item.COM_CD,
                                }))
                              : []
                            : []
                        }
                        value={DTL_MLT_SELECT}
                        onChange={SET_DTL_MLT_SELECT}
                        hasSelectAll={false}
                        disableSearch={true}
                        overrideStrings={{
                          selectSomeItems: <span style={{ color: '#546E7A' }}>공지 대상</span>,
                          allItemsAreSelected: svc_code?.getCode.map(item => `${item.COM_CD_NM},`),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Card className={classes.TreeBox}>
                    <h3>국가 및 도시</h3>
                    <DetailTree {...DTL_DATA} {...UI_INFO} SET_DTL_DATA={SET_DTL_DATA} DTL_DATA={DTL_DATA} SET_UI_INFO={SET_UI_INFO} />
                  </Card>
                </Box>
                <Box className={media.w800 ? classes.editorBox : classes.w800editorBox}>
                  <Box className={media.w800 ? classes.editorLayout : null}>
                    <CKEditor
                      onInit={editor => {
                        editor.editing.view.change(writer => {
                          writer.setStyle('height', '258px', editor.editing.view.document.getRoot())
                        })
                      }}
                      editor={classicEditor}
                      disabled={UI_INFO.INPUT_READ_ONLY ? false : true}
                      data={DTL_DATA?.NTC_CONT}
                      onChange={(ev, editor) => onChangeEditor(ev, editor)}
                    />
                  </Box>
                  <Box className={media.w800 ? classes.fileContainer : classes.w800fileContainer}>
                    <DropzoneAreaBase
                      dropzoneClass={media.w800 ? classes.dropBox : classes.w800dropBox}
                      fileObjects={UI_INFO.DROP_FILE}
                      onAdd={file => (UI_INFO.INPUT_READ_ONLY ? onFileAdd(file, UI_INFO, SET_UI_INFO) : null)}
                      getFileAddedMessage={ev =>
                        UI_INFO.INPUT_READ_ONLY ? `${ev}파일이 선택 되었습니다.` : '읽기 전용입니다. 초기화 및 수정을 클릭해주세요.'
                      }
                      onDelete={file =>
                        SET_UI_INFO(props => ({ ...props, DROP_FILE: props.DROP_FILE.filter(item => item.id !== file.id) }))
                      }
                      useChipsForPreview={true}
                      dropzoneText={''}
                    />
                    <Card className={classes.fileChipsCard}>
                      {UI_INFO.FILE_CHIPS.fileId.map(item => (
                        <Box className={classes.fileChipsBox} key={item}>
                          <Chip
                            className={classes.Chips}
                            style={{ width: media.w1430 ? null : '100px' }}
                            label={UI_INFO.FILE_CHIPS.fileNm[UI_INFO.FILE_CHIPS.fileId.indexOf(item)]}
                            id={item}
                            clickable
                            onClick={ev => fileload(ev)}
                            color="primary"
                            onDelete={ev => (UI_INFO.EDIT_FLAG ? fileRemove(ev, LOAD_NEWS, UI_INFO, SET_UI_INFO, resetInfo) : null)}
                          />
                        </Box>
                      ))}
                    </Card>
                  </Box>
                </Box>
                {/* 디테일 인풋폼 그리드 컨테이너 */}
              </CardContent>
            </form>
          </Card>
        </Box>
      </Container>
    </Page>
  )
}

export default React.memo(NewsView)

const SrchMultiSelect = styled(MultiSelects)`
  position: relative;
  z-index: 99;
  font-size: 14px;
  width: 240px;
  @media only screen and (max-width: 490px) {
    width: 100%;
  }
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

const DtlMultiSelect = styled(MultiSelects)`
  position: relative;
  z-index: 99;
  font-size: 14px;
  width: 320px;
  @media only screen and (max-width: 385px) {
    width: 310px;
  }
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
