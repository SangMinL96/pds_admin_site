import React, { useRef, useState } from 'react'
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
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  LinearProgress,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { ArrowDropDownOutlined } from '@material-ui/icons'
//################################################//

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
import {
  SVC_CD_CODE,
  GET_MCN_STS_DATA,
  GET_MCN_STS_ERR_DATA,
  HANDLE_RSSH,
  MCN_MDL_CODE,
  MCN_ST_CODE,
  GET_AREA_TREE,
} from './McnStsQuery'
//###################################################//

//############### AG-GRID IMPORT #######################//
import { AgGridReact } from 'ag-grid-react/lib/agGridReact'
import RsshBtn from './McnStsComponent/RsshBtn'

//######################################################//

//############# react-hook-form IMPORT ################//
import { useForm } from 'react-hook-form'
//###################################################//

//############## SRC IMPORT   ##################//
import { ver } from 'src/components/Utils'
import useMedia from 'src/components/useMedia'
import { TreeItem, TreeView } from '@material-ui/lab'
import { toast } from 'react-toastify'
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
    width: '70%',
  },
  detail: {
    width: '29%',
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
    width: '90%',
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
  rsshInfoBox: {
    width: '260px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: '0.5em',
    '& span': {
      fontSize: '0.75rem',
    },
  },
  //############################################//

  //################### Detail CSS ###############//
  inputCardContent: {
    width: '100%',
    height: '705px',
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'column',
  },
  errListBox: {
    width: '90px',
    padding: '4px',
    backgroundColor: '#ec0008',
    borderRadius: '50px',
    textAlign: 'center',
    fontSize: '0.8rem',
    fontWeight: '500',
    color: 'white',
  },
}))
//#########################################//

const McnStsView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //################# AG 그리드  ##################//

  const [areaOpen, setAreaOpen] = useState(false)
  const anchorRef = useRef(null)

  const McnStsCloumns = [
    {
      headerName: '서비스',
      field: 'SVC_NM',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: '모델명',
      field: 'MCN_MDL_NM',
    },
    {
      headerName: '시리얼번호',
      field: 'MCN_SR_NO',
    },
    {
      headerName: 'MAC 주소',
      field: 'MAC_ADDR',
    },
    {
      headerName: '국가',
      field: 'NAT_NM',
      width: 100,
    },
    {
      headerName: '시도',
      field: 'STE_NM',
      width: 100,
    },
    {
      headerName: '시군구',
      field: 'CTY_NM',
      width: 100,
    },
    {
      headerName: '샵 명',
      field: 'SHP_NM',
    },
    {
      headerName: '딜러명',
      field: 'DLR_NM',
    },
    {
      headerName: '머신상태',
      field: 'MCN_ST_NM',
      width: 100,
    },
    {
      headerName: '보고 일시',
      field: 'MCN_RPT_DT',
    },
    {
      headerName: 'PORT',
      field: 'SSH_PORT',
      minWidth: 150,
    },
    {
      headerName: 'RSSH',
      cellRenderer: 'RsshBtn',
      cellRendererParams: {
        clicked: (mac, svcCd, status) => startRSSH(mac, svcCd, status),
      },
    },
  ]
  const frameworkComponents = {
    RsshBtn: RsshBtn,
  }
  const dtlMcnStsCloumns = [
    {
      headerName: '발생일시',
      field: 'ERR_OCCR_DT',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    {
      headerName: '오류유형',
      field: 'MCN_ST_NM',
    },
    {
      headerName: '오류내용',
      field: 'MCN_ERR_CONT',
    },
  ]
  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    width: 150,

    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }
  const dtlDefaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    width: 153,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }
  //##############################################//

  //################ SHOP_MGT STATE ################/
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    SVC_CD: '',
    AREA_ID: undefined,
    MCN_ST_CD: '',
    MCN_MDL_CD: '',
    SHP_NM: '',
    MCN_SR_NO: '',
  })

  //#######################################/

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { register: srchRegister, handleSubmit: srchSubmit, setValue: srchSetValue } = useForm()
  const { register: dtlRegister, setValue } = useForm()
  //#################################################################//

  //############### 공통함수 #################//

  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: svc_code } = useQuery(SVC_CD_CODE)
  const { data: mcn_mdl_code } = useQuery(MCN_MDL_CODE)
  const { data: mcn_st_code } = useQuery(MCN_ST_CODE)
  const { data: TreeData } = useQuery(GET_AREA_TREE, { variables: { AREA_NM: '', ver } })
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//

  // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
  const [LOAD_MCN_STS, { data: LOAD_MCN_STS_DATA }] = useLazyQuery(GET_MCN_STS_DATA, {
    variables: { param: SRCH_DATA, ver },
    fetchPolicy: 'network-only',
  })
  const [LOAD_MCN_STS_ERR, { data: LOAD_MCN_STS_ERR_DATA }] = useLazyQuery(GET_MCN_STS_ERR_DATA)
  const [HANDLE_RSSH_MTT] = useMutation(HANDLE_RSSH)

  //#############################################################//

  const startRSSH = async (mac, svcCd, status) => {
    try {
      if (status === 'OFF') {
        const result = await HANDLE_RSSH_MTT({ variables: { param: { SVC_CD: svcCd, MAC_ADDR: mac, CMD: 'OPEN SSH' }, ver } })

        if (result.data.handleSSHPort.rsltCd === 'OK') {
          // toast.info('10초뒤 RSSH 연결됩니다. 잠시만 기다려주세요.', {
          //   autoClose: 10000,
          //   closeOnClick: false,
          //   pauseOnHover: false,
          //   pauseOnFocusLoss: false,
          // })
        
          // setTimeout(() => window.location.reload(), 10000)
        }
      }
      if (status === 'ON') {
        const result = await HANDLE_RSSH_MTT({ variables: { param: { SVC_CD: svcCd, MAC_ADDR: mac, CMD: 'CLOSE SSH' }, ver } })
        console.log(result)
        if (result.data.handleSSHPort.rsltCd === 'OK') {
          window.location.reload()
          console.log('STOP')
        }
      }
    } catch (err) {
      toast.error(`${err} 오류가 발생했습니다.`)
    }
  }

  //#################################################//

  //##############  SRCH_EVENT   ##################//
  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_MCN_STS useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    SET_SRCH_DATA(props => ({ ...props, SHP_NM: datas.SHP_NM, MCN_SR_NO: datas.MCN_SR_NO }))
    LOAD_MCN_STS()
  }

  const onAreaToggle = () => {
    setAreaOpen(prevOpen => !prevOpen)
  }

  const areaTreeClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setAreaOpen(false)
  }
  const areaClick = ev => {
    SET_SRCH_DATA(props => ({ ...props, AREA_ID: ev?.id === '1' ? '' : ev?.id }))
    srchSetValue('AREA_ID', ev?.name)
  }

  //###################################################//

  //##################   GRID_EVENT    ##################//

  /**
   * 그리드 데이터 선택 함수.
   * 디스패치 실행시켜 Detail컴포넌트에게 클릭한 데이터를 보냄
   * @param {object} ev 데이터 선택시 해당 공지사항 데이터를 받아옴.
   */
  const onRowClickd = ev => {
    LOAD_MCN_STS_ERR({
      variables: { MAC_ADDR: ev?.data?.MAC_ADDR, ver },
      fetchPolicy: 'network-only',
    })
    setValue('MCN_ERR_CONT', '')
  }
  const onDtlRowSelected = ev => {
    setValue('MCN_ERR_CONT', ev?.data?.MCN_ERR_CONT)
  }
  //#########################################################//

  const data = {
    id: '1',
    name: '전체',
    children: TreeData?.getAreaTree?.children?.map(item => item),
  }

  const renderTree = nodes => (
    <TreeItem className={classes.treeBox} key={nodes.id} nodeId={nodes.id} label={nodes.name} onClick={() => areaClick(nodes)}>
      {Array.isArray(nodes.children) ? nodes.children.map(node => renderTree(node)) : null}
    </TreeItem>
  )
  return (
    <Page className={classes.root}>
      <Container maxWidth={false}>
        <Box mt={1}>
          <Box className={classes.searchBox}>
            <Card className={media.w490 ? classes.searchCard : classes.w490searchCard}>
              <form onSubmit={srchSubmit(onSubmitSrch)}>
                <Box className={media.w490 ? classes.formBox : null}>
                  <Grid container spacing={1}>
                    <Grid lg={2} xs={12} item>
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
                    <Grid lg={2} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label={SRCH_DATA.AREA_ID !== undefined ? '지역' : ''}
                        variant="outlined"
                        type="select"
                        name="AREA_ID"
                        inputRef={srchRegister}
                        size="small"
                        ref={anchorRef}
                        aria-controls={areaOpen ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={onAreaToggle}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <>
                              <span style={{ width: '50px', position: 'absolute', left: '10px' }}>
                                {SRCH_DATA.AREA_ID !== undefined ? '' : '지역'}
                              </span>
                              <div style={{ position: 'absolute', right: '10px' }}>
                                <ArrowDropDownOutlined style={{ color: '#757575' }} />
                              </div>
                            </>
                          ),
                        }}
                      />
                      <Popper
                        open={areaOpen}
                        anchorEl={anchorRef.current}
                        role={undefined}
                        transition
                        disablePortal
                        style={{ zIndex: '99999' }}
                      >
                        {({ TransitionProps }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              width: '300px',
                            }}
                          >
                            <Paper>
                              <ClickAwayListener onClickAway={areaTreeClose}>
                                <MenuList autoFocusItem={areaOpen} id="menu-list-grow">
                                  <TreeView
                                    style={{ padding: '1em' }}
                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                    defaultExpanded={['1']}
                                    defaultExpandIcon={<ChevronRightIcon />}
                                  >
                                    {renderTree(data)}
                                  </TreeView>
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>머신 상태</InputLabel>
                        <Select
                          label="머신 상태"
                          name="MCN_ST_CD"
                          value={SRCH_DATA.MCN_ST_CD || ''}
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, MCN_ST_CD: ev.target.value })) || ''}
                        >
                          <MenuItem value={''}>전체</MenuItem>
                          {mcn_st_code?.getCode?.map(option => (
                            <MenuItem key={option.COM_CD} value={option.COM_CD}>
                              {option.COM_CD_NM}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>모델 명</InputLabel>
                        <Select
                          label="모델 명"
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
                    <Grid lg={2} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label="샵명"
                        variant="outlined"
                        type="text"
                        name="SHP_NM"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label="시리얼 번호"
                        variant="outlined"
                        type="text"
                        name="MCN_SR_NO"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
                <Box>
                  <Button
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
                <Box>
                  <h3>
                    총
                    {LOAD_MCN_STS_DATA?.getMachineStatus?.RET_LIST?.length > 0 ? (
                      <span>{LOAD_MCN_STS_DATA?.getMachineStatus?.RET_LIST?.length}</span>
                    ) : (
                      <span>0</span>
                    )}
                    건
                  </h3>
                </Box>
                <Box className={classes.rsshInfoBox}>
                  {LOAD_MCN_STS_DATA?.getMachineStatus?.RET_LIST?.filter(item => item.SSH_PORT !== '0').length > 0 ? (
                    <>
                      <h5>RSSH Serial : </h5>
                      <span>
                    
                        {LOAD_MCN_STS_DATA?.getMachineStatus?.RET_LIST?.filter(item => item.SSH_PORT !== '0')[0].MCN_SR_NO}
                      </span>
                      <LinearProgress style={{ width: '40px' }} />
                    </>
                  ) : null}
                </Box>
              </Box>
              {/* TopBar 박스 */}

              {/* Ag그리드 박스 */}
              <Box>
                <div className="ag-theme-alpine" style={{ position: 'relative', height: '660px', width: '100%' }}>
                  <AgGridReact
                    headerHeight={35}
                    onRowClicked={onRowClickd}
                    frameworkComponents={frameworkComponents}
                    
                    rowSelection="multiple"
                    rowData={LOAD_MCN_STS_DATA?.getMachineStatus?.RET_LIST || []}
                    defaultColDef={defaultColDef}
                    localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                    columnDefs={McnStsCloumns}
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
              <CardContent className={media.w500 ? classes.inputCardContent : null}>
                <Box className={classes.errListBox}>오류 이력</Box>
                {/* 디테일 인풋폼 그리드 컨테이너 */}
                <Box width={media.w490 ? '100%' : null}>
                  <div className="ag-theme-alpine" style={{ position: 'relative', height: '400px', width: '100%' }}>
                    <AgGridReact
                      headerHeight={35}
                      onRowSelected={onDtlRowSelected}
                      rowMultiSelectWithClick={true}
                      rowSelection="multiple"
                      rowData={LOAD_MCN_STS_ERR_DATA?.getMachineError || []}
                      defaultColDef={dtlDefaultColDef}
                      localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                      columnDefs={dtlMcnStsCloumns}
                      gridOptions={{ rowHeight: 40 }}
                    />
                  </div>
                </Box>
                <Box mt={media.w980 ? 0 : 3}>
                  <TextField
                    style={{ width: '100%' }}
                    label="오류 설명"
                    multiline
                    rows={10}
                    name="MCN_ERR_CONT"
                    inputRef={dtlRegister}
                    variant="outlined"
                    InputProps={{ startAdornment: <div></div>, readOnly: true }}
                  />
                </Box>
                {/* 디테일 인풋폼 그리드 컨테이너 */}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Page>
  )
}

export default React.memo(McnStsView)
