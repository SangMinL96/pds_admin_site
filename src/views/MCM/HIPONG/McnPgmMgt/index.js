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
import {
  GET_MCN_PGM_DATA,
  SVC_CD_CODE,
  MCN_MDL_CODE,
  GET_AREA,
  MCN_SW_DATA,
  ADD_MCN_PGM,
  EDIT_MCN_PGM,
  DEL_MCN_PGM,
} from './McnPgmQuery'
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
import { disabledHandler2, ver } from 'src/components/Utils'
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
    height: '605px',
    marginTop: '3em',
  },
  dtlGridBox: {
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

const McnPgmView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)
  const McnPgmCloumns = [
    {
      children: [
        { headerName: '서비스', field: 'SVC_NM', width: 120, checkboxSelection: true, headerCheckboxSelection: true },
        { headerName: '모델명', field: 'MCN_MDL_NM', width: 120 },
        { headerName: '국가', field: 'NAT_NM', width: 120 },
      ],
    },

    {
      headerName: '메인SW버전',
      headerClass: 'my-css-class',
      children: [
        { headerName: '활성화', field: 'MAN_SW_ATV_YN' },
        { headerName: 'Major', field: 'MAN_SW_MJR_VER' },
        { headerName: 'Minor', field: 'MAN_SW_MNR_VER' },
        { headerName: 'Build', field: 'MAN_SW_BLD_VER' },
      ],
    },
    {
      headerName: '서브SW버전',
      children: [
        { headerName: '활성화', field: 'SUB_SW_ATV_YN' },
        { headerName: 'Major', field: 'SUB_SW_MJR_VER' },
        { headerName: 'Minor', field: 'SUB_SW_MNR_VER' },
        { headerName: 'Build', field: 'SUB_SW_BLD_VER' },
      ],
    },
  ]

  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    width: 110,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }

  //##############################################//

  //################ SHOP_MGT STATE ################/
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    SVC_CD: '',
    MCN_MDL_CD: '',
    AREA_ID: '',
  })
  const [DTL_DATA, SET_DTL_DATA] = useState({
    SVC_CD: '',
    MCN_MDL_CD: '',
    NAT_ID: '',
    MAN_SW_MJR_VER: null,
    MAN_SW_MNR_VER: null,
    MAN_SW_BLD_VER: null,
    MAN_SW_ATV_YN: '',
    MAN_MCN_SW_REPO_ID: null,
    MAN_SW_REV: null,
    SUB_SW_MJR_VER: null,
    SUB_SW_MNR_VER: null,
    SUB_SW_BLD_VER: null,
    SUB_SW_ATV_YN: '',
    SUB_MCN_SW_REPO_ID: null,
    SUB_SW_REV: null,
  })
  const [UI_INFO, SET_UI_INFO] = useState({
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
    DEL_MCN_MDL_CD: {
      SVC_CD: '',
      MCN_MDL_CD: '',
      NAT_ID: '',
    },
  })
  //#######################################/

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { handleSubmit: srchSubmit } = useForm()
  const { register: dtlRegister, handleSubmit: dtlSubmit, reset, setValue, errors } = useForm()
  //#################################################################//

  //############### 공통함수 #################//
  const resetInfo = () => {
    SET_UI_INFO(props => ({ ...props, ADD_FLAG: false, EDIT_FLAG: false, INPUT_READ_ONLY: false, INPUT_VARIDATE: false }))
  }
  const resetDtl = () => {
    SET_DTL_DATA(props => ({
      ...props,
      SVC_CD: '',
      MCN_MDL_CD: '',
      NAT_ID: '',
      MAN_SW_MJR_VER: '',
      MAN_SW_MNR_VER: '',
      MAN_SW_BLD_VER: '',
      MAN_SW_ATV_YN: '',
      MAN_MCN_SW_REPO_ID: '',
      MAN_SW_REV: '',
      SUB_SW_MJR_VER: '',
      SUB_SW_MNR_VER: '',
      SUB_SW_BLD_VER: '',
      SUB_SW_ATV_YN: '',
      SUB_MCN_SW_REPO_ID: '',
      SUB_SW_REV: '',
    }))

    reset()
  }
  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: svc_code } = useQuery(SVC_CD_CODE)
  const { data: nat_code } = useQuery(GET_AREA, { variables: { param: { AREA_TP_CD: '001' }, ver } })
  const { data: mcn_mdl_code } = useQuery(MCN_MDL_CODE)
  const { data: LOAD_MCN_SW_DATA } = useQuery(MCN_SW_DATA, {
    variables: { SVC_CD: '', ver },
  })
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//

  // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
  const [LOAD_MCN_PGM, { data: LOAD_MCN_PGM_DATA }] = useLazyQuery(GET_MCN_PGM_DATA, {
    variables: { param: SRCH_DATA, ver },
    fetchPolicy: 'network-only',
  })

  const [addMutation] = useMutation(ADD_MCN_PGM, {
    //신규 추가 뮤테이션
    variables: {
      param: DTL_DATA,
      ver,
    },
  })
  const [editMutation] = useMutation(EDIT_MCN_PGM, {
    //데이터 수정 뮤테이션
    variables: {
      param: DTL_DATA,
      ver,
    },
  })
  const [delMutation] = useMutation(DEL_MCN_PGM, { variables: { ...UI_INFO.DEL_MCN_MDL_CD, ver } })
  //#############################################################//

  //################# useEffect ####################//
  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node =>
        node.setSelected(
          node.data.SVC_CD === DTL_DATA.SVC_CD &&
            node.data.MCN_MDL_CD === DTL_DATA.MCN_MDL_CD &&
            node.data.NAT_ID === DTL_DATA.NAT_ID,
        ),
      )
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }

  }, [
    UI_INFO.SEL_FOCUS,
    GRID_API,
    LOAD_MCN_PGM,
    DTL_DATA.MCN_MDL_CD_LST,
    DTL_DATA.SVC_CD,
    DTL_DATA.NAT_ID,
    DTL_DATA.MCN_MDL_CD,
    LOAD_MCN_PGM_DATA,
  ])
  //#################################################//

  //##############  SRCH_EVENT   ##################//
  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_MCN_PGM useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    SET_SRCH_DATA(props => ({ ...props, ...datas }))
    LOAD_MCN_PGM()
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
    const clickNtcData = GRID_API.getSelectedRows().map(data => ({
      SVC_CD: data.SVC_CD,
      MCN_MDL_CD: data.MCN_MDL_CD,
      NAT_ID: data.NAT_ID,
    }))
    setValue('MAN_SW_MJR_VER', ev?.data?.MAN_SW_MJR_VER)
    setValue('MAN_SW_MNR_VER', ev?.data?.MAN_SW_MNR_VER)
    setValue('MAN_SW_BLD_VER', ev?.data?.MAN_SW_BLD_VER)
    setValue('MAN_SW_REV', ev?.data?.MAN_SW_REV)
    setValue('SUB_SW_MJR_VER', ev?.data?.SUB_SW_MJR_VER)
    setValue('SUB_SW_MNR_VER', ev?.data?.SUB_SW_MNR_VER)
    setValue('SUB_SW_BLD_VER', ev?.data?.SUB_SW_BLD_VER)
    setValue('SUB_SW_REV', ev?.data?.SUB_SW_REV)
    SET_DTL_DATA(props => ({
      ...props,
      SVC_CD: ev?.data?.SVC_CD,
      MCN_MDL_CD: ev?.data?.MCN_MDL_CD,
      NAT_ID: ev?.data?.NAT_ID,
      MAN_SW_ATV_YN: ev?.data?.MAN_SW_ATV_YN,
      SUB_SW_ATV_YN: ev?.data?.SUB_SW_ATV_YN,
      MAN_MCN_SW_REPO_ID: ev?.data?.MAN_MCN_SW_REPO_ID,
      SUB_MCN_SW_REPO_ID: ev?.data?.SUB_MCN_SW_REPO_ID,
    }))

    SET_UI_INFO(props => ({ ...props, DEL_MCN_MDL_CD: clickNtcData[0] }))
    resetInfo()
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
              if (result.data.delMachinePgm.rsltCd === 'OK') {
                toast.success('정상적으로 삭제 되었습니다.')
                resetDtl()
                resetInfo()
                LOAD_MCN_PGM()
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
    if (DTL_DATA.SVC_CD !== '') {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, EDIT_FLAG: true, ADD_FLAG: false }))
    } else {
      toast.error(`수정을 원하는 프로그램을 클릭해주세요.`)
    }
  }

  /**
   * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시
   * submit Flag의 따라 실행되는 함수.
   * @param {object} data 인풋 데이터
   */
  const onSubmitDtl = async datas => {
    const numData = Object.keys(datas).reduce((prev, curr) => {
      prev[curr] = parseInt(datas[curr])
      return prev
    }, {})
    await SET_DTL_DATA(props => ({ ...props, ...numData })) //subMit인풋 데이터
    const { SVC_CD, MCN_MDL_CD, NAT_ID, MAN_SW_ATV_YN, MAN_MCN_SW_REPO_ID, SUB_SW_ATV_YN, SUB_MCN_SW_REPO_ID } = DTL_DATA

    if (
      SVC_CD === '' ||
      MCN_MDL_CD === '' ||
      NAT_ID === '' ||
      MAN_SW_ATV_YN === '' ||
      MAN_MCN_SW_REPO_ID === '' ||
      SUB_SW_ATV_YN === '' ||
      SUB_MCN_SW_REPO_ID === ''
    ) {
      toast.error('입력 및 선택하지 않은 항목이 존재합니다.')
      SET_UI_INFO(props => ({ ...props, INPUT_VARIDATE: true }))
    } else {
      if (UI_INFO?.ADD_FLAG === true) {
        //신규 subMit 실행 함수
        if (
          LOAD_MCN_PGM_DATA?.getMachinePgm.some(
            item => item.SVC_CD === SVC_CD && item.MCN_MDL_CD === MCN_MDL_CD && item.NAT_ID === NAT_ID,
          )
        ) {
          toast.error('중복된 서비스,모델명,국가에 해당하는 프로그램이 존재합니다.')
          SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
        } else {
          try {
            const result = await addMutation()
            console.log(result)
            if (result.data.saveMachinePgm.rsltCd === 'OK') {
              toast.success('성공적으로 추가 되었습니다.')
              LOAD_MCN_PGM()
              resetDtl()
              resetInfo()
            } else {
              toast.error('오류가 발생했습니다.')
              resetDtl()
              resetInfo()
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
          if (result.data.saveMachinePgm.rsltCd === 'OK') {
            toast.success('성공적으로 수정 되었습니다.')
            LOAD_MCN_PGM()
            resetInfo()
            SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
          } else {
            resetInfo()
            toast.error('오류가 발생했습니다.')
          }
        }catch (err) {
          resetInfo()
          toast.error(`${err} 오류가 발생했습니다.`)
      }
      }
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
                    <Grid lg={4} xs={12} item>
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
                    <Grid lg={4} xs={12} item>
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
                    <Grid lg={4} xs={12} item>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>국가</InputLabel>
                        <Select
                          label="국가"
                          name="AREA_ID"
                          value={SRCH_DATA.AREA_ID || ''}
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, AREA_ID: ev.target.value })) || ''}
                        >
                          <MenuItem value={''}>전체</MenuItem>
                          {nat_code?.getArea?.map(option => (
                            <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                              {option.AREA_NM}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                    {LOAD_MCN_PGM_DATA?.getMachinePgm?.length > 0 ? (
                      <span>{LOAD_MCN_PGM_DATA?.getMachinePgm?.length}</span>
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
                    disabled={UI_INFO?.DEL_MCN_MDL_CD?.SVC_CD !== '' ? false : true}
                  >
                    삭제
                  </Button>
                </div>
              </Box>
              {/* TopBar 박스 */}

              {/* Ag그리드 박스 */}
              <Box>
                <div className="ag-theme-alpine" style={{ position: 'relative', height: '650px', width: '100%' }}>
                  <AgGridReact
                    headerHeight={35}
                    onRowClicked={onRowClickd}
                    onGridReady={ev => SET_GRID_API(ev.api)}
                    rowSelection="single"
                    rowData={LOAD_MCN_PGM_DATA?.getMachinePgm || []}
                    defaultColDef={defaultColDef}
                    localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                    columnDefs={McnPgmCloumns}
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
                  <Grid container spacing={2}>
                    <Grid item lg={4} xs={12}>
                      <FormControl
                        style={{ width: '100%' }}
                        size="small"
                        variant="outlined"
                        error={UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.SVC_CD === '' ? true : false) : false}
                      >
                        <InputLabel>서비스</InputLabel>
                        <Select
                          label="서비스"
                          name="SVC_CD"
                          value={DTL_DATA.SVC_CD || ''}
                          onChange={ev => SET_DTL_DATA(props => ({ ...props, SVC_CD: ev.target.value })) || ''}
                          readOnly={UI_INFO.ADD_FLAG ? false : true}
                        >
                          {svc_code?.getCode?.map(option => (
                            <MenuItem key={option.COM_CD} value={option.COM_CD}>
                              {option.COM_CD_NM}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.SVC_CD === '' ? '서비스를 선택해주세요.' : false) : false}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <FormControl
                        style={{ width: '100%' }}
                        size="small"
                        variant="outlined"
                        error={UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.MCN_MDL_CD === '' ? true : false) : false}
                      >
                        <InputLabel>모델명</InputLabel>
                        <Select
                          label="모델명"
                          name="MCN_MDL_CD"
                          value={DTL_DATA.MCN_MDL_CD || ''}
                          onChange={ev => SET_DTL_DATA(props => ({ ...props, MCN_MDL_CD: ev.target.value })) || ''}
                          readOnly={UI_INFO.ADD_FLAG ? false : true}
                        >
                          {mcn_mdl_code?.getCode?.map(option => (
                            <MenuItem key={option.COM_CD} value={option.COM_CD}>
                              {option.COM_CD_NM}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.MCN_MDL_CD === '' ? '모델명을 선택해주세요.' : false) : false}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item lg={4} xs={12}>
                      <FormControl
                        style={{ width: '100%' }}
                        size="small"
                        variant="outlined"
                        error={UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.NAT_ID === '' ? true : false) : false}
                      >
                        <InputLabel>국가</InputLabel>
                        <Select
                          label="국가"
                          name="NAT_ID"
                          value={DTL_DATA.NAT_ID || ''}
                          onChange={ev => SET_DTL_DATA(props => ({ ...props, NAT_ID: ev.target.value })) || ''}
                          readOnly={UI_INFO.ADD_FLAG ? false : true}
                        >
                          {nat_code?.getArea?.map(option => (
                            <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                              {option.AREA_NM}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.NAT_ID === '' ? '국가를 선택해주세요.' : false) : false}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box mt={4} mb={2} className={media.w500 ? classes.dtlGridBox : null}>
                    <Box style={media.w500 ? { width: '50%', marginRight: '1em' } : { marginBottom: '1em' }}>
                      <h4 style={{ marginBottom: '1.5em' }}>메인SW버전</h4>
                      <Grid container spacing={3}>
                        <Grid item lg={6} xs={12}>
                          <TextField
                            error={errors?.MAN_SW_MJR_VER ? true : false}
                            helperText={errors?.MAN_SW_MJR_VER ? '3자리 까지만 입력해주세요.' : null}
                            style={{ width: '100%' }}
                            label="Major"
                            variant="outlined"
                            name="MAN_SW_MJR_VER"
                            inputRef={dtlRegister({ maxLength: 3 })}
                            type="number"
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
                            error={errors?.MAN_SW_MNR_VER ? true : false}
                            helperText={errors?.MAN_SW_MNR_VER ? '3자리 까지만 입력해주세요.' : null}
                            style={{ width: '100%' }}
                            label="Minor"
                            variant="outlined"
                            name="MAN_SW_MNR_VER"
                            inputRef={dtlRegister({ maxLength: 3 })}
                            type="number"
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
                            error={errors?.MAN_SW_BLD_VER ? true : false}
                            helperText={errors?.MAN_SW_BLD_VER ? '3자리 까지만 입력해주세요.' : null}
                            style={{ width: '100%' }}
                            label="Build"
                            variant="outlined"
                            name="MAN_SW_BLD_VER"
                            inputRef={dtlRegister({ maxLength: 3 })}
                            type="number"
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
                            error={errors?.MAN_SW_REV ? true : false}
                            helperText={errors?.MAN_SW_REV ? '3자리 까지만 입력해주세요.' : null}
                            style={{ width: '100%' }}
                            label="revision"
                            variant="outlined"
                            name="MAN_SW_REV"
                            inputRef={dtlRegister({ maxLength: 3 })}
                            type="number"
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
                            error={UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.MAN_SW_ATV_YN === '' ? true : false) : false}
                          >
                            <InputLabel>활성화 여부</InputLabel>
                            <Select
                              label="활성화 여부"
                              name="MAN_SW_ATV_YN"
                              value={DTL_DATA.MAN_SW_ATV_YN || ''}
                              onChange={ev => SET_DTL_DATA(props => ({ ...props, MAN_SW_ATV_YN: ev.target.value })) || ''}
                              readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                            >
                              <MenuItem value={'Y'}>{'Y'}</MenuItem>
                              <MenuItem value={'N'}>{'N'}</MenuItem>
                            </Select>
                            <FormHelperText>
                              {UI_INFO.INPUT_VARIDATE
                                ? DTL_DATA?.MAN_SW_ATV_YN === ''
                                  ? '활성화 여부를 선택해주세요.'
                                  : false
                                : false}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item lg={12} xs={12}>
                          <FormControl
                            style={{ width: '100%' }}
                            size="small"
                            variant="outlined"
                            error={UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.MAN_MCN_SW_REPO_ID === '' ? true : false) : false}
                          >
                            <InputLabel>저장소명</InputLabel>
                            <Select
                              label="저장소명"
                              name="MAN_MCN_SW_REPO_ID"
                              value={DTL_DATA.MAN_MCN_SW_REPO_ID || ''}
                              onChange={ev => SET_DTL_DATA(props => ({ ...props, MAN_MCN_SW_REPO_ID: ev.target.value })) || ''}
                              readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                            >
                              {LOAD_MCN_SW_DATA?.getMcnSwRepo?.map(option => (
                                <MenuItem key={option.MCN_SW_REPO_ID} value={option.MCN_SW_REPO_ID}>
                                  {option.MCN_SW_REPO_NM} / {option.SVN_ID} / {option.SVN_PTH}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {UI_INFO.INPUT_VARIDATE
                                ? DTL_DATA?.MAN_MCN_SW_REPO_ID === ''
                                  ? '저장소명을 선택해주세요.'
                                  : false
                                : false}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box style={media.w500 ? { width: '50%' } : { marginBottom: '1em' }}>
                      <h4 style={{ marginBottom: '1.5em' }}>서브SW버전</h4>
                      <Grid container spacing={3}>
                        <Grid item lg={6} xs={12}>
                          <TextField
                            error={errors?.SUB_SW_MJR_VER ? true : false}
                            helperText={errors?.SUB_SW_MJR_VER ? '3자리 까지만 입력해주세요.' : null}
                            style={{ width: '100%' }}
                            label="Major"
                            variant="outlined"
                            name="SUB_SW_MJR_VER"
                            inputRef={dtlRegister({ maxLength: 3 })}
                            type="number"
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
                            error={errors?.SUB_SW_MNR_VER ? true : false}
                            helperText={errors?.SUB_SW_MNR_VER ? '3자리 까지만 입력해주세요.' : null}
                            style={{ width: '100%' }}
                            label="Minor"
                            variant="outlined"
                            name="SUB_SW_MNR_VER"
                            inputRef={dtlRegister({ maxLength: 3 })}
                            type="number"
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
                            error={errors?.SUB_SW_BLD_VER ? true : false}
                            helperText={errors?.SUB_SW_BLD_VER ? '3자리 까지만 입력해주세요.' : null}
                            style={{ width: '100%' }}
                            label="Build"
                            variant="outlined"
                            name="SUB_SW_BLD_VER"
                            inputRef={dtlRegister({ maxLength: 3 })}
                            type="number"
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
                            error={errors?.SUB_SW_REV ? true : false}
                            helperText={errors?.SUB_SW_REV ? '3자리 까지만 입력해주세요.' : null}
                            style={{ width: '100%' }}
                            label="revision"
                            variant="outlined"
                            name="SUB_SW_REV"
                            inputRef={dtlRegister({ maxLength: 3 })}
                            type="number"
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
                            error={UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.SUB_SW_ATV_YN === '' ? true : false) : false}
                          >
                            <InputLabel>활성화 여부</InputLabel>
                            <Select
                              label="활성화 여부"
                              name="SUB_SW_ATV_YN"
                              value={DTL_DATA.SUB_SW_ATV_YN || ''}
                              onChange={ev => SET_DTL_DATA(props => ({ ...props, SUB_SW_ATV_YN: ev.target.value })) || ''}
                              readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                            >
                              <MenuItem value={'Y'}>{'Y'}</MenuItem>
                              <MenuItem value={'N'}>{'N'}</MenuItem>
                            </Select>
                            <FormHelperText>
                              {UI_INFO.INPUT_VARIDATE
                                ? DTL_DATA?.SUB_SW_ATV_YN === ''
                                  ? '활성화 여부를 선택해주세요.'
                                  : false
                                : false}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                        <Grid item lg={12} xs={12}>
                          <FormControl
                            style={{ width: '100%' }}
                            size="small"
                            variant="outlined"
                            error={UI_INFO.INPUT_VARIDATE ? (DTL_DATA?.SUB_MCN_SW_REPO_ID === '' ? true : false) : false}
                          >
                            <InputLabel>저장소명</InputLabel>
                            <Select
                              label="저장소명"
                              name="SUB_MCN_SW_REPO_ID"
                              value={DTL_DATA.SUB_MCN_SW_REPO_ID || ''}
                              onChange={ev => SET_DTL_DATA(props => ({ ...props, SUB_MCN_SW_REPO_ID: ev.target.value })) || ''}
                              readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                            >
                              {LOAD_MCN_SW_DATA?.getMcnSwRepo?.map(option => (
                                <MenuItem key={option.MCN_SW_REPO_ID} value={option.MCN_SW_REPO_ID}>
                                  {option.MCN_SW_REPO_NM} / {option.SVN_ID} / {option.SVN_PTH}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>
                              {UI_INFO.INPUT_VARIDATE
                                ? DTL_DATA?.SUB_MCN_SW_REPO_ID === ''
                                  ? '저장소명을 선택해주세요.'
                                  : false
                                : false}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
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

export default React.memo(McnPgmView)
