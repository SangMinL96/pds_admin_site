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
  FormHelperText,
} from '@material-ui/core'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
//################################################//

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import {
  GET_DEALER_DATA,
  DLR_TP_CD,
  GET_AREA,
  GET_UPR_AREA,
  GET_AREA_TREE,
  USER_DATA,
  ADD_DLR,
  EDIT_DLR,
  DEL_DLR,
  GET_ALL_DLR_DATA,
} from './DealerQuery'
//###################################################//

//############## SRC IMPORT   ##################//
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
    display: 'flex',
    alignItems: 'center',
  },
  w630page: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    height: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  //########## SERCH TREE CSS ##################//
  treeContainer: {
    width: '250px',
    marginLeft: '2em',
    height: '90.5%',
  },
  w630treeContainer: {
    width: '92%',
    marginBottom: '1em',
    overflow: 'visible',
  },
  treeBox: {
    marginTop: '5px',
    '& .MuiTreeItem-label': {
      fontSize: '15px',
    },
  },
  gridContainer: {
    width: '100%',
    height: '91%',
  },
  //##############################################//

  //########## GRID TABLE CSS ##################//
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
  //#######################################//

  //############### DETIAL CSS ###############//
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
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)
  const DealerCloumns = [
    {
      headerName: '딜러유형',
      field: 'DLR_TP_NM',
      checkboxSelection: true,
      headerCheckboxSelection: true,
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
      headerName: 'HP',
      field: 'HP',
    },
    {
      headerName: 'EML',
      field: 'EML',
    },
    {
      headerName: 'PATH',
      field: 'PATH',
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

  //########## SHOP_MGT STATE ##############/
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    NAT_ID: '',
    STE_ID: '',
  })
  const [DTL_DATA, SET_DTL_DATA] = useState({
    DLR_ID: '',
    DLR_TP_CD: '',
    NAT_ID: '',
    STE_ID: '',
    CTY_ID: '',
  })
  const [UI_INFO, SET_UI_INFO] = useState({
    ADD_FLAG: false,
    EDIT_FLAG: false,
    INPUT_READ_ONLY: false,
    DEL_DLR_ID: [],
    SEL_FOCUS: false,
    INPUT_VARIDATE: false,
    DTL_STE_URP: '',
    DTL_CTY_URP: '',
  })
  //#######################################/

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { register, handleSubmit: dtlSubmit, reset, setValue } = useForm()
  //#################################################################//

  //########## 공동코드 및 함수 ###############//
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
    SET_DTL_DATA(props => ({ ...props, DLR_ID: '', DLR_TP_CD: '', NAT_ID: '', STE_ID: '', CTY_ID: '' }))
    reset()
  }
  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: TreeData } = useQuery(GET_AREA_TREE, {
    variables: { AREA_NM: '', ver },
  })
  const { data: DLR_USR_DATA } = useQuery(GET_ALL_DLR_DATA, { variables: { DLR_NM: '', ver } })
  const { data: getUser } = useQuery(USER_DATA, {
    variables: { param: { USR_ID: '', USR_TP_CD: 'U001' }, ver },
  })
  const { data: dlr_tp_cd } = useQuery(DLR_TP_CD)
  const { data: areacode } = useQuery(GET_AREA, { variables: { param: { AREA_TP_CD: '001' }, ver } })
  const { data: cityCode } = useQuery(GET_UPR_AREA, areaVariables('002', UI_INFO.DTL_STE_URP))
  const { data: countyCode } = useQuery(GET_UPR_AREA, areaVariables('003', UI_INFO.DTL_CTY_URP))

  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//

  const [LOAD_DLR, { data: LOAD_DLR_DATA }] = useLazyQuery(GET_DEALER_DATA, {
    fetchPolicy: 'network-only',
    variables: {
      param: SRCH_DATA,
      ver,
    },
  })
  const [addMutation] = useMutation(ADD_DLR, {
    //신규 추가 뮤테이션
    variables: {
      param: DTL_DATA,
      ver,
    },
  })
  const [editMutation] = useMutation(EDIT_DLR, {
    //데이터 수정 뮤테이션
    variables: {
      param: DTL_DATA,
      ver,
    },
  })
  const [delMutation] = useMutation(DEL_DLR, { variables: { param: { DLR_IDS: UI_INFO.DEL_DLR_ID }, ver } })
  //###########################################################//

  //##############  SRCH_EVENT   ##################//
  const data = {
    id: '1',
    name: TreeData?.getAreaTree?.name,
    children: TreeData?.getAreaTree?.children?.map(item => item),
  }
  const areaClick = ev => {
    const NAT_ID = ev.AREA_TP_CD === '001' ? ev.id : undefined
    const STE_ID = ev.AREA_TP_CD === '002' ? ev.id : undefined
    SET_SRCH_DATA({ NAT_ID, STE_ID })
    LOAD_DLR()
  }
  //###################################################//

  //############### useEffect #########################//\

  useEffect(() => {
    if (UI_INFO.SEL_FOCUS) {
      GRID_API.forEachNode(node => node.setSelected(node.data.DLR_ID === DTL_DATA.DLR_ID))
      setTimeout(() => SET_UI_INFO(props => ({ ...props, SEL_FOCUS: false })), 500)
    }
  }, [UI_INFO.SEL_FOCUS, GRID_API, LOAD_DLR, DTL_DATA.DLR_ID, LOAD_DLR_DATA])
  //###########################################//

  //##################   GRID_EVENT    ##################//

  /**
   * 그리드 데이터 선택 함수.
   * 디스패치 실행시켜 Detail컴포넌트에게 클릭한 데이터를 보냄
   * @param {object} ev 데이터 선택시 해당 공지사항 데이터를 받아옴.
   */
  const onRowClickd = ev => {
    setValue('HP', ev?.data?.HP)
    setValue('EML', ev?.data?.EML)
    SET_DTL_DATA(props => ({
      ...props,
      DLR_ID: ev?.data?.DLR_ID,
      DLR_TP_CD: ev?.data?.DLR_TP_CD,
      NAT_ID: ev?.data?.NAT_ID,
      STE_ID: ev?.data?.STE_ID,
      CTY_ID: ev?.data?.CTY_ID,
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
    const clickData = GRID_API.getSelectedRows().map(data => data.DLR_ID)
    SET_UI_INFO(props => ({ ...props, DEL_DLR_ID: clickData }))
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
              if (result.data.delDealer.rsltCd === 'OK') {
                toast.success('정상적으로 삭제 되었습니다.')
                resetDtl()
                LOAD_DLR()
              } else {
                toast.error('다시 시도해주세요.')
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
    if (DTL_DATA.DLR_ID !== '') {
      SET_UI_INFO(props => ({ ...props, INPUT_READ_ONLY: true, EDIT_FLAG: true }))
    } else {
      toast.error(`수정을 원하는 딜러를 클릭해주세요.`)
    }
  }

  /**
   * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시
   * submit Flag의 따라 실행되는 함수.
   * @param {object} data 인풋 데이터
   */
  const onSubmitDtl = async datas => {
    if (DTL_DATA.DLR_ID === '' || DTL_DATA.DLR_TP_CD === '' || DTL_DATA.NAT_ID === '') {
      SET_UI_INFO(props => ({ ...props, INPUT_VARIDATE: true }))
    } else {
      if (UI_INFO?.ADD_FLAG === true) {
        //신규 subMit 실행 함수

        try {
          const result = await addMutation()
          console.log(result)
          if (result.data.saveDealer.rsltCd === 'OK') {
            toast.success('성공적으로 추가 되었습니다.')
            resetDtl()
            resetInfo()
            LOAD_DLR()
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
        if (result.data.saveDealer.rsltCd === 'OK') {
          toast.success('성공적으로 수정 되었습니다.')
          resetInfo()
          LOAD_DLR()
          SET_UI_INFO(props => ({ ...props, SEL_FOCUS: true }))
        }
      } catch (err) {
        resetInfo()
        toast.error(`${err} 오류가 발생했습니다.`)
      }
    }
  }
  /**
   * 국가,시도 선택시 입력함수
   * @param {object} event 국가,시도 선택된 Value값
   */
  const onChangeDtlSelect = event => {
    const { name, value } = event.target
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

  const renderTree = nodes => (
    <TreeItem className={classes.treeBox} key={nodes.id} nodeId={nodes.id} label={nodes.name} onClick={() => areaClick(nodes)}>
      {Array.isArray(nodes.children) ? nodes.children.map(node => renderTree(node)) : null}
    </TreeItem>
  )
  return (
    <Page className={media.w630 ? classes.page : classes.w630page} title="딜러 관리">
      <Card className={media.w630 ? classes.treeContainer : classes.w630treeContainer}>
        <TreeView
          style={{ padding: '1em' }}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpanded={['1']}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          {renderTree(data)}
        </TreeView>
      </Card>
      <Container maxWidth={false} className={classes.gridContainer}>
        <Box>
          <Card>
            {/* TopBar 박스 */}
            <Box className={classes.TopBarBox}>
              <div>
                <h3>총{LOAD_DLR_DATA?.getArea?.length > 0 ? <span>{LOAD_DLR_DATA?.getArea?.length}</span> : <span>0</span>}건</h3>
              </div>
              <div>
                <Button
                  className={classes.tableBtn}
                  onClick={onRemove}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={UI_INFO?.DEL_DLR_ID?.length > 0 ? false : true}
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
                  rowData={LOAD_DLR_DATA?.getDealerTree || []}
                  defaultColDef={defaultColDef}
                  localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                  columnDefs={DealerCloumns}
                  pagination={true}
                  paginationPageSize={10}
                  gridOptions={{ rowHeight: 35 }}
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
                <h5 className={classes.detailsHeaderTitle}>딜러 정보 상세</h5>

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
              <CardContent className={media.w800 ? classes.inputCardContent : classes.w800inputCardContent}>
                {/* 디테일 인풋폼 그리드 컨테이너 */}
                <Grid container spacing={2}>
                  <Grid item lg={3} xs={12}>
                    <FormControl
                      style={{ width: '100%' }}
                      size="small"
                      variant="outlined"
                      error={UI_INFO.INPUT_VARIDATE && DTL_DATA.DLR_ID === '' ? true : false}
                    >
                      <InputLabel>유저 *</InputLabel>
                      <Select
                        label="유저 *"
                        name="DLR_ID"
                        onChange={ev =>
                          DLR_USR_DATA?.getDealer?.map(item => item.DLR_ID).some(comCd => comCd === ev.target.value)
                            ? toast.error('이미 딜러로 등록 되어있습니다.')
                            : SET_DTL_DATA(props => ({ ...props, DLR_ID: ev.target.value }))
                        }
                        value={DTL_DATA.DLR_ID || ''}
                        readOnly={UI_INFO.ADD_FLAG ? false : true}
                      >
                        {getUser?.getUser?.map(option => (
                          <MenuItem key={option.USR_ID} value={option.USR_ID}>
                            {`아이디:${option.USR_ID} 이름:${option.USR_NM}`}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {UI_INFO.INPUT_VARIDATE && DTL_DATA.DLR_ID === '' ? '딜러를 선택해주세요.' : false}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <TextField
                      style={{ width: '100%' }}
                      label="HP"
                      type="number"
                      variant="outlined"
                      name="HP"
                      inputRef={register}
                      size="small"
                      InputProps={{ readOnly: true, startAdornment: <div></div> }}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <TextField
                      style={{ width: '100%' }}
                      label="EML"
                      variant="outlined"
                      name="EML"
                      inputRef={register}
                      size="small"
                      InputProps={{ readOnly: true, startAdornment: <div></div> }}
                    />
                  </Grid>
                  <Grid item lg={3} xs={12}>
                    <FormControl
                      style={{ width: '100%' }}
                      size="small"
                      variant="outlined"
                      error={UI_INFO.INPUT_VARIDATE && DTL_DATA.DLR_TP_CD === '' ? true : false}
                    >
                      <InputLabel>딜러유형 *</InputLabel>
                      <Select
                        label="딜러유형 *"
                        name="DLR_TP_CD"
                        onChange={ev => SET_DTL_DATA(props => ({ ...props, DLR_TP_CD: ev.target.value }))}
                        value={DTL_DATA.DLR_TP_CD || ''}
                        readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                      >
                        {dlr_tp_cd?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {UI_INFO.INPUT_VARIDATE && DTL_DATA.DLR_TP_CD === '' ? '딜러 유형을 선택해주세요.' : false}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <FormControl
                      style={{ width: '100%' }}
                      size="small"
                      variant="outlined"
                      error={UI_INFO.INPUT_VARIDATE && DTL_DATA.NAT_ID === '' ? true : false}
                    >
                      <InputLabel>국가 *</InputLabel>
                      <Select
                        label="국가 *"
                        name="NAT_ID"
                        onChange={onChangeDtlSelect}
                        value={DTL_DATA.NAT_ID || ''}
                        readOnly={UI_INFO.INPUT_READ_ONLY ? false : true}
                      >
                        {areacode?.getArea?.map(option => (
                          <MenuItem key={option.AREA_ID} value={option.AREA_ID}>
                            {option.AREA_NM}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {UI_INFO.INPUT_VARIDATE && DTL_DATA.NAT_ID === '' ? '국가를 선택해주세요.' : false}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                      <InputLabel>시도</InputLabel>
                      <Select
                        label="시도"
                        name="STE_ID"
                        onChange={onChangeDtlSelect}
                        value={cityCode?.getArea !== undefined ? DTL_DATA.STE_ID || '' : ''}
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
                  <Grid item lg={4} xs={12}>
                    <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                      <InputLabel>시군구</InputLabel>
                      <Select
                        label="시군구"
                        name="CTY_ID"
                        onChange={onChangeDtlSelect}
                        value={countyCode?.getArea !== undefined ? DTL_DATA.CTY_ID || '' : ''}
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
      </Container>
    </Page>
  )
}

export default ShopView
