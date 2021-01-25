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

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
//###################################################//

//############# MultiSelect IMPORT ##############//
import MultiSelects from 'react-multi-select-component'
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
//###################################################//

//############## SRC IMPORT   ##################//
import { disabledHandler2, serviceValue, validate, ver } from 'src/components/Utils'
import useMedia from 'src/components/useMedia'
import styled from 'styled-components'
import { MCN_SW_DATA, SVC_CD, SW_TP_CD, ADD_MCN_SW, EDIT_MCN_SW, DEL_MCN_SW } from './MachineSWQuery'
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

  detailBox: {
    width: '50%',
  },
  contentBox: {
    width: '40%',
    overflow: 'visible',
    marginRight: '5px',
  },
  W800detailBox: {
    marginBottom: '1em',
  },
  w800contentBox: {
    overflow: 'visible',
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

const MachineSWView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)

  const MachineSWCloumns = [
    {
      headerName: '서비스',
      field: 'SVC_CD',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      suppressSizeToFit: true,
      valueGetter: function(params) {
        return serviceValue(params.data.SVC_CD)
      },
    },
    {
      headerName: '저장소명',
      field: 'MCN_SW_REPO_NM',
    },
    {
      headerName: 'SW 구분',
      field: 'SW_TP_NM',
    },
    {
      headerName: 'SVN 경로',
      field: 'SVN_PTH',
    },
    {
      headerName: '아이디',
      field: 'SVN_ID',
    },
    {
      headerName: '비밀번호',
      field: 'SVN_PWD',
    },

    {
      headerName: '설명',
      field: 'SW_DESC',
    },
  ]

  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    width: 220,

    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }
  //##############################################//

  //################ SHOP_MGT STATE ################/
  const [MLT_SELECT, SET_MLT_SELECT] = useState([])
  const [DTL_MLT_SELECT, SET_DTL_MLT_SELECT] = useState([])
  const [DTL_DATA, SET_DTL_DATA] = useState({
    SVN_ID: '',
    SVN_PWD: '',
    SW_DESC: '',
    MCN_SW_REPO_NM: '',
    MCN_SW_REPO_ID: '',
    SVN_PTH: '',
    SW_TP_CD: '',
  })
  const [UI_INFO, SET_UI_INFO] = useState({
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    DEL_MCN_SW_REPO_IDS: [],
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
  })
  //#######################################//

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { handleSubmit: srchSubmit } = useForm()
  const { register, handleSubmit: dtlSubmit, reset, errors, setValue, getValues } = useForm()
  //#################################################################//

  //############### 공통함수 #################//
  const resetInfo = () => {
    SET_UI_INFO(props => ({ ...props, ADD_FLAG: false, EDIT_FLAG: false, INPUT_READ_ONLY: false, INPUT_VARIDATE: false }))
  }
  const resetDtl = () => {
    SET_DTL_DATA(props => ({ ...props, SVN_ID: '', SVN_PWD: '', SW_DESC: '', MCN_SW_REPO_NM: '', SVN_PTH: '', SW_TP_CD: '' }))
    SET_DTL_MLT_SELECT([])
    reset()
  }
  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: svc_code } = useQuery(SVC_CD)
  const { data: sw_tp_code } = useQuery(SW_TP_CD)
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//

  // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
  const [LOAD_MCN_SW, { data: LOAD_MCN_SW_DATA }] = useLazyQuery(MCN_SW_DATA, {
    variables: {
      SVC_CD: MLT_SELECT?.map(item => item.value)
        .sort()
        .toString(),
      ver,
    },
    fetchPolicy: 'network-only',
  })
  const [addMutation] = useMutation(ADD_MCN_SW, {
    //신규 추가 뮤테이션
    variables: {
      param: {
        ...DTL_DATA,
        SVC_CD: DTL_MLT_SELECT?.map(item => item.value)
          .sort()
          .toString(),
        MCN_SW_REPO_ID: undefined,
      },
      ver,
    },
  })
  const [editMutation] = useMutation(EDIT_MCN_SW, {
    //데이터 수정 뮤테이션
    variables: {
      param: {
        ...DTL_DATA,
        SVC_CD: DTL_MLT_SELECT?.map(item => item.value)
          .sort()
          .toString(),
      },
      ver,
    },
  })
  const [delMutation] = useMutation(DEL_MCN_SW, { variables: { param: { MCN_SW_REPO_IDS: UI_INFO.DEL_MCN_SW_REPO_IDS }, ver } })
  //#############################################################//

  //################# useEffect ####################//


  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node => node.setSelected(node.data.SVN_ID === DTL_DATA.SVN_ID))
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }

   
  }, [UI_INFO.SEL_FOCUS, GRID_API, LOAD_MCN_SW, DTL_DATA.SVN_ID, LOAD_MCN_SW_DATA])
  //#################################################//

  //##############  SRCH_EVENT   ##################//
  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_MCN_SW useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    LOAD_MCN_SW()
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
    setValue('SVN_ID', ev?.data?.SVN_ID)
    setValue('SVN_PWD', ev?.data?.SVN_PWD)
    setValue('SW_DESC', ev?.data?.SW_DESC)
    setValue('MCN_SW_REPO_NM', ev?.data?.MCN_SW_REPO_NM)
    setValue('SVN_PTH', ev?.data?.SVN_PTH)
    SET_DTL_MLT_SELECT(ev?.data?.SVC_CD?.split(',').map(item => ({ label: serviceValue(item), value: item })))
    SET_DTL_DATA(props => ({ ...props, SW_TP_CD: ev?.data?.SW_TP_CD, MCN_SW_REPO_ID: ev?.data?.MCN_SW_REPO_ID }))
    resetInfo()
  }

  /**
   * onRowClickd함수에서 ChackBox클릭시 row 데이터를 받아오지 못하는 오류가 발생.
   * 그래서 row선택이 되면 전체를 인지하고 데이터를 받아올수있는 함수추가.
   * 이함수는 다수의 데이터를 클릭하여 삭제하는 이벤트와 수정시 해당 데이터를 포커싱하는 이벤트을 담당
   * @param {object} ev 선택된 데이터의 데이터 값
   */
  const onRowSelected = ev => {
    const clickData = GRID_API.getSelectedRows().map(data => data.MCN_SW_REPO_ID)
    SET_UI_INFO(props => ({ ...props, DEL_MCN_SW_REPO_IDS: clickData }))
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
              if (result.data.delMcnSwRepo.rsltCd === 'OK') {
                toast.success('정상적으로 삭제 되었습니다.')
                resetDtl()
                LOAD_MCN_SW()
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
    SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, ADD_FLAG: true, EDIT_FLAG: false }))
    resetDtl()
    GRID_API.deselectAll()
  }

  /**
   * 수정 클릭시 useState이용한 상태 변경 함수
   */
  const editClick = () => {
    if (getValues('SVN_ID') !== '') {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, EDIT_FLAG: true, ADD_FLAG: false }))
    } else {
      toast.error(`수정을 원하는 머신SW를 클릭해주세요.`)
    }
  }

  /**
   * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시
   * submit Flag의 따라 실행되는 함수.
   * @param {object} data 인풋 데이터
   */
  const onSubmitDtl = async datas => {
    await SET_DTL_DATA(props => ({ ...props, ...datas })) //subMit인풋 데이터
    if (UI_INFO?.ADD_FLAG === true) {
      //신규 subMit 실행 함수
      try {
        const result = await addMutation()
        console.log(result)
        if (result.data.saveMcnSwRepo.rsltCd === 'OK') {
          toast.success('성공적으로 추가 되었습니다.')
          resetDtl()
          resetInfo()
          LOAD_MCN_SW()
        } else {
          toast.error('다시 시도해주세요.')
        }
      }catch (err) {
        resetInfo()
        toast.error(`${err} 오류가 발생했습니다.`)
    }
    }
    if (UI_INFO?.EDIT_FLAG === true) {
      //수정 subMit 실행 함수
      try {
        const result = await editMutation()
        console.log(result)
        if (result.data.saveMcnSwRepo.rsltCd === 'OK') {
          toast.success('성공적으로 수정 되었습니다.')
          LOAD_MCN_SW()
          SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
          resetInfo()
        }
      }catch (err) {
        resetInfo()
        toast.error(`${err} 오류가 발생했습니다.`)
    }
    }
  }

  //#########################################################//

  return (
    <Page className={classes.root} title="공지사항">
      <Container maxWidth={false}>
        <Box mt={1}>
          <Box className={classes.searchBox}>
            <Card className={media.w490 ? classes.searchCard : classes.w490searchCard}>
              <form onSubmit={srchSubmit(onSubmitSrch)}>
                <Box className={media.w490 ? classes.formBox : null}>
                  <Grid container spacing={1}>
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
                        onChange={ev => SET_MLT_SELECT(ev)}
                        hasSelectAll={false}
                        disableSearch={true}
                        overrideStrings={{
                          selectSomeItems: <span style={{ color: '#546E7A' }}>서비스 명</span>,
                          allItemsAreSelected: null,
                        }}
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
        <Box mt={1}>
          <Card>
            {/* TopBar 박스 */}
            <Box className={classes.TopBarBox}>
              <div>
                <h3>
                  총{LOAD_MCN_SW_DATA?.getNotice?.length > 0 ? <span>{LOAD_MCN_SW_DATA?.getNotice?.length}</span> : <span>0</span>}건
                </h3>
              </div>
              <div>
                <Button
                  className={classes.tableBtn}
                  onClick={onRemove}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={UI_INFO?.DEL_MCN_SW_REPO_IDS?.length > 0 ? false : true}
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
                  rowData={LOAD_MCN_SW_DATA?.getMcnSwRepo || []}
                  defaultColDef={defaultColDef}
                  localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                  columnDefs={MachineSWCloumns}
                  pagination={true}
                  paginationPageSize={10}
                  gridOptions={{ rowHeight: 30 }}
                />
              </div>
            </Box>
            {/* Ag그리드 박스 */}
          </Card>
        </Box>
        <Box mt={1}>
          <Card>
            <form onSubmit={dtlSubmit(onSubmitDtl)}>
              <Box className={media.w525 ? classes.detailsHeader : null}>
                <h5 className={classes.detailsHeaderTitle}>머신 SW 저장소</h5>

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
                <Grid container spacing={2} className={media.w800 ? classes.detailBox : classes.W800detailBox}>
                  <Grid item lg={6} xs={12}>
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
                      error={false && DTL_MLT_SELECT.length === 0 ? 'red' : null}
                      value={DTL_MLT_SELECT}
                      onChange={SET_DTL_MLT_SELECT}
                      hasSelectAll={false}
                      disableSearch={true}
                      overrideStrings={{
                        selectSomeItems: <span style={{ color: '#546E7A' }}>서비스</span>,
                        allItemsAreSelected: svc_code?.getCode.map(item => `${item.COM_CD_NM}, `),
                      }}
                    />
                    <FormHelperText style={{ color: 'red', marginLeft: '1em' }}>
                      {false && DTL_MLT_SELECT.length === 0 ? '서비스 유형을 선택해주세요' : null}
                    </FormHelperText>
                  </Grid>
                  <Grid item lg={6} xs={12}>
                    <FormControl style={{ width: '100%' }} size="small" variant="outlined" error={false && DTL_DATA.SW_TP_CD === ''}>
                      <InputLabel>SW구분</InputLabel>
                      <Select
                        label="SW구분"
                        value={DTL_DATA.SW_TP_CD || ''}
                        onChange={ev => SET_DTL_DATA(props => ({ ...props, SW_TP_CD: ev.target.value }))}
                        readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                      >
                        {sw_tp_code?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{false && DTL_DATA.SW_TP_CD === '' ? 'SW구분을 선택해주세요' : null}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={12} xs={12}>
                    <TextField
                      error={validate(errors?.MCN_SW_REPO_NM, getValues('MCN_SW_REPO_NM')) ? true : false}
                      helperText={validate(errors?.MCN_SW_REPO_NM, getValues('MCN_SW_REPO_NM')) ? '저장소 명를 입력해주세요.' : false}
                      style={{ width: '100%' }}
                      label="저장소 명 "
                      fullWidth
                      variant="outlined"
                      name="MCN_SW_REPO_NM"
                      inputRef={register({ required: true })}
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
                      error={validate(errors?.SVN_PTH, getValues('SVN_PTH')) ? true : false}
                      helperText={validate(errors?.SVN_PTH, getValues('SVN_PTH')) ? 'SVN 경로를 입력해주세요.' : false}
                      style={{ width: '100%' }}
                      label="SVN 경로"
                      fullWidth
                      variant="outlined"
                      name="SVN_PTH"
                      inputRef={register({ required: true })}
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
                      error={validate(errors?.SVN_ID, getValues('SVN_ID')) ? true : false}
                      helperText={validate(errors?.SVN_ID, getValues('SVN_ID')) ? '아이디를 입력해주세요.' : false}
                      style={{ width: '100%' }}
                      label="아이디 "
                      fullWidth
                      variant="outlined"
                      name="SVN_ID"
                      inputRef={register({ required: true })}
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
                      error={validate(errors?.SVN_PWD, getValues('SVN_PWD')) ? true : false}
                      helperText={validate(errors?.SVN_PWD, getValues('SVN_PWD')) ? '비밀번호를 입력해주세요.' : false}
                      style={{ width: '100%' }}
                      label="비밀번호 "
                      fullWidth
                      variant="outlined"
                      name="SVN_PWD"
                      inputRef={register({ required: true })}
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

                <Box className={media.w800 ? classes.contentBox : classes.w800contentBox}>
                  <TextField
                    error={validate(errors?.SW_DESC, getValues('SW_DESC')) ? true : false}
                    helperText={validate(errors?.SW_DESC, getValues('SW_DESC')) ? '설명를 입력해주세요.' : false}
                    style={{ width: '100%' }}
                    label="설명"
                    multiline
                    rows={10}
                    name="SW_DESC"
                    inputRef={register({ required: true })}
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

export default React.memo(MachineSWView)

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
  z-index: 99;
  position: relative;
  font-size: 14px;
  width: 100%;

  .dropdown-container {
    --rmsc-main: #4285f4;
    --rmsc-hover: #f1f3f5;
    --rmsc-selected: #e2e6ea;
    --rmsc-border: ${props => props.error};
    --rmsc-gray: #aaa;
    --rmsc-bg: #fff;
    --rmsc-p: 10px; /* Spacing */
    --rmsc-radius: 4px; /* Radius */
    --rmsc-h: 34px; /* Height */
  }
`
