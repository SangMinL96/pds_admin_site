import React, { useEffect, useState } from 'react'
//###########Material-UI IMPORT ################//
import Page from 'src/components/Page'
import { Box, Button, Card, TextField, Grid, Container, makeStyles, CardContent } from '@material-ui/core'

//################################################//

//############# APOLLO IMPORT #######################//
import { useMutation, useQuery } from '@apollo/react-hooks'
import { GET_STT_DATA, ADD_STT, EDIT_STT, DEL_STT } from './AreaCityQuery'
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
    '& Button': {
      width: '100px',
      marginLeft: '1em',
    },
  },
  inputCardContent: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: '1.5em',
    marginTop: '1.5em',
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

const SttAreaView = ({ STT_URP_ID, SET_URP_CD }) => {
  const classes = useStyles()
  const [media] = useMedia()
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)

  const AreaCityCloumns = [
    {
      headerName: '시도ID',
      field: 'AREA_ID',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: '시도명',
      field: 'AREA_NM',
    },
    {
      headerName: '등록일',
      field: 'REG_DT',
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
  const [DTL_DATA, SET_DTL_DATA] = useState({
    AREA_ID: '',
    AREA_NM: '',
  })
  const [UI_INFO, SET_UI_INFO] = useState({
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    DEL_AREA_ID: [],
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
  })
  //#######################################/
  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { register, handleSubmit, reset, errors, setValue, getValues } = useForm()
  //#################################################################//

  //############### 공통함수 #################//
  const resetInfo = () => {
    SET_UI_INFO(props => ({ ...props, ADD_FLAG: false, EDIT_FLAG: false, INPUT_READ_ONLY: false, INPUT_VARIDATE: false }))
  }
  const resetDtl = () => {
    SET_DTL_DATA(props => ({ ...props, AREA_ID: '', AREA_NM: '' }))
    SET_URP_CD(props => ({ ...props, COUNTY_URP_ID: undefined }))
    reset()
  }
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//
  // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
  const { data: LOAD_STT_DATA, refetch } = useQuery(GET_STT_DATA, {
    // 데이터 삭제시 그리드 테이블 리프레쉬
    fetchPolicy: 'network-only',
    skip: STT_URP_ID === undefined,
    variables: { param: { AREA_TP_CD: '002', UPR_AREA_ID: STT_URP_ID }, ver },
  })

  const [addMutation] = useMutation(ADD_STT, {
    //신규 추가 뮤테이션
    variables: {
      param: { ...DTL_DATA, UPR_AREA_ID: STT_URP_ID, AREA_TP_CD: '002' },
      ver,
    },
  })
  const [editMutation] = useMutation(EDIT_STT, {
    //데이터 수정 뮤테이션
    variables: {
      param: { ...DTL_DATA, UPR_AREA_ID: STT_URP_ID, AREA_TP_CD: '002' },
      ver,
    },
  })

  const [delMutation] = useMutation(DEL_STT, { variables: { param: { AREA_IDS: UI_INFO.DEL_AREA_ID }, ver } })
  //#############################################################//

  //################# useEffect ####################//
  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node => node.setSelected(node.data.AREA_ID === DTL_DATA.AREA_ID))
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }
    if (STT_URP_ID === undefined) {
      resetDtl()
      resetInfo()
    }
 

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UI_INFO.SEL_FOCUS, GRID_API, STT_URP_ID, DTL_DATA.AREA_ID, LOAD_STT_DATA])
  //#################################################//

  //##################   GRID_EVENT    ##################//

  /**
   * 그리드 데이터 선택 함수.
   * 디스패치 실행시켜 Detail컴포넌트에게 클릭한 데이터를 보냄
   * @param {object} ev 데이터 선택시 해당 공지사항 데이터를 받아옴.
   */
  const onRowClickd = ev => {
    setValue('AREA_ID', ev?.data?.AREA_ID)
    setValue('AREA_NM', ev?.data?.AREA_NM)
    SET_URP_CD(props => ({ ...props, COUNTY_URP_ID: ev?.data?.AREA_ID }))
    resetInfo()
  }

  /**
   * onRowClickd함수에서 ChackBox클릭시 row 데이터를 받아오지 못하는 오류가 발생.
   * 그래서 row선택이 되면 전체를 인지하고 데이터를 받아올수있는 함수추가.
   * 이함수는 다수의 데이터를 클릭하여 삭제하는 이벤트와 수정시 해당 데이터를 포커싱하는 이벤트을 담당
   * @param {object} ev 선택된 데이터의 데이터 값
   */
  const onRowSelected = ev => {
    const clickNtcData = GRID_API.getSelectedRows().map(data => data.AREA_ID)
    SET_UI_INFO(props => ({ ...props, DEL_AREA_ID: clickNtcData }))
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
              if (result.data.delArea.rsltCd === 'OK') {
                toast.success('정상적으로 삭제 되었습니다.')
                resetDtl()
                refetch()
              } else {
                toast.error('오류가 발생했습니다.')
              }
            }catch (err) {
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
    if (STT_URP_ID !== undefined) {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, ADD_FLAG: true, EDIT_FLAG: false }))
      resetDtl()
      GRID_API.deselectAll()
    } else {
      toast.error(`국가 코드를 선택해주세요.`)
    }
  }

  /**
   * 수정 클릭시 useState이용한 상태 변경 함수
   */
  const editClick = () => {
    if (getValues('AREA_ID') !== '') {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, EDIT_FLAG: true, ADD_FLAG: false }))
    } else {
      toast.error(`수정을 원하는 도시를 클릭해주세요.`)
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
      if (LOAD_STT_DATA?.getArea?.map(item => item.AREA_ID).some(id => id === datas.AREA_ID)) {
        toast.error('중복된 시도ID가 존재합니다.')
      } else {
        try {
          const result = await addMutation()
          console.log(result)
          if (result.data.saveArea.rsltCd === 'OK') {
            toast.success('성공적으로 추가 되었습니다.')
            refetch()
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
    }
    if (UI_INFO?.EDIT_FLAG === true) {
      //수정 subMit 실행 함수
      try {
        const result = await editMutation()
        console.log(result)
        if (result.data.saveArea.rsltCd === 'OK') {
          toast.success('성공적으로 수정 되었습니다.')
          refetch()
          SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
          resetInfo()
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

  //#########################################################//

  return (
    <Page className={classes.root}>
      <Container maxWidth={false}>
        <Box mt={1}>
          <Card>
            {/* TopBar 박스 */}
            <Box className={classes.TopBarBox}>
              <div>
                <h3>총{LOAD_STT_DATA?.getArea?.length > 0 ? <span>{LOAD_STT_DATA?.getArea?.length}</span> : <span>0</span>}건</h3>
              </div>
              <div>
                <Button
                  className={classes.tableBtn}
                  onClick={onRemove}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={UI_INFO?.DEL_AREA_ID?.length > 0 ? false : true}
                >
                  삭제
                </Button>
              </div>
            </Box>
            {/* TopBar 박스 */}

            {/* Ag그리드 박스 */}
            <Box>
              <div className="ag-theme-alpine" style={{ position: 'relative', height: '575px', width: '100%' }}>
                <AgGridReact
                  headerHeight={35}
                  onRowClicked={onRowClickd}
                  onRowSelected={onRowSelected}
                  onGridReady={ev => SET_GRID_API(ev.api)}
                  rowSelection="multiple"
                  rowData={LOAD_STT_DATA?.getArea || []}
                  defaultColDef={defaultColDef}
                  localeText={{ noRowsToShow: '국가코드를 클릭해주세요.' }}
                  columnDefs={AreaCityCloumns}
                  pagination={true}
                  paginationPageSize={10}
                  gridOptions={{ rowHeight: 40 }}
                />
              </div>
            </Box>
            {/* Ag그리드 박스 */}
          </Card>
        </Box>
        <Box mt={1}>
          <Card>
            <form onSubmit={handleSubmit(onSubmitDtl)}>
              <Box className={media.w525 ? classes.detailsHeader : null}>
                <h5 className={classes.detailsHeaderTitle}>코드 정보</h5>

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
                  <Grid item lg={6} xs={12}>
                    <TextField
                      error={validate(errors?.AREA_ID, getValues('AREA_ID')) ? true : false}
                      helperText={validate(errors?.AREA_ID, getValues('AREA_ID')) ? '시도 ID를 입력해주세요.' : false}
                      style={{ width: '100%' }}
                      label="시도 ID *"
                      fullWidth
                      variant="outlined"
                      name="AREA_ID"
                      inputRef={register({ required: true })}
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
                  <Grid item lg={6} xs={12}>
                    <TextField
                      error={validate(errors?.AREA_NM, getValues('AREA_NM')) ? true : false}
                      helperText={validate(errors?.AREA_NM, getValues('AREA_NM')) ? '시도명을 입력해주세요.' : false}
                      style={{ width: '100%' }}
                      label="시도명 *"
                      fullWidth
                      variant="outlined"
                      name="AREA_NM"
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
                {/* 디테일 인풋폼 그리드 컨테이너 */}
              </CardContent>
            </form>
          </Card>
        </Box>
      </Container>
    </Page>
  )
}

export default React.memo(SttAreaView)
