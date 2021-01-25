import React, {  useRef, useState } from 'react'
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
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { ArrowDropDownOutlined } from '@material-ui/icons'
//################################################//

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useQuery } from '@apollo/react-hooks'
import { SVC_CD_CODE, GET_GME_BOK_DATA, GET_AREA_TREE, GET_SHOP } from './GmeBokQuery'
//###################################################//

//############### AG-GRID IMPORT #######################//
import { AgGridReact } from '@ag-grid-community/react'
import { InfiniteRowModelModule } from '@ag-grid-community/infinite-row-model'
import { CsvExportModule } from '@ag-grid-community/csv-export'

//######################################################//

//############# react-hook-form IMPORT ################//
import { useForm } from 'react-hook-form'
//###################################################//

//############## SRC IMPORT   ##################//
import { ver } from 'src/components/Utils'
import { netError } from 'src/components/netErrorHendle'
import useMedia from 'src/components/useMedia'
import { TreeItem, TreeView } from '@material-ui/lab'
import { toast } from 'react-toastify'
import Axios from 'axios'
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
    width: '100%',
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
    width: '70%',
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

const GmeBokView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)
  const [areaOpen, setAreaOpen] = useState(false)
  const anchorRef = useRef(null)

  const GmeBokCloumns = [
    {
      headerName: 'BOOK 아이디',
      field: 'BOK_DAT_ID',
    },
    {
      headerName: '게임시작시간',
      field: 'GME_STRT_DT',
    },
    {
      headerName: '게임종료시간',
      field: 'GME_END_DT',
    },
    {
      headerName: '서비스',
      field: 'SVC_NM',
    },
    {
      headerName: '게임',
      field: 'GME_NM',
      width: 100,
    },
    {
      headerName: '샵',
      field: 'SHP_NM',
      width: 100,
    },
    {
      headerName: '아이디',
      field: 'SHP_ID',
      width: 100,
    },
    {
      headerName: '사용크레딧',
      field: 'USE_CRD',
    },
    {
      headerName: '지역',
      field: 'AREA_NM',
    },

    {
      headerName: '점수',
      field: 'SCRE_VAL',
    },
    {
      headerName: 'CCR/PPD',
      field: 'CCR_VAL',
      minWidth: 150,
    },
    {
      headerName: 'SAR',
      field: 'SAR_VAL',
    },
    {
      headerName: 'HCT',
      field: 'HCT_VAL',
    },
    {
      headerName: 'WIN/LOSE',
      field: 'OTCM_VAL',
    },
  ]

  //##############################################//

  //################ SHOP_MGT STATE ################/
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    USR_ID: '',
    USR_NM: '',
    NIC_NM: '',
    HP: '',
    EML: '',
    SVC_CD: '',
    AREA_IDS: undefined,
    SHP_ID: '',
  })

  //#######################################/

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { register: srchRegister, handleSubmit: srchSubmit, setValue: srchSetValue } = useForm()

  //#################################################################//

  //############### 공통함수 #################//

  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: svc_code } = useQuery(SVC_CD_CODE)
  const { data: TreeData } = useQuery(GET_AREA_TREE, {
    variables: { AREA_NM: '', ver },
  })
  const { data: LOAD_SHOP_DATA } = useQuery(GET_SHOP, {
    variables: { param: {}, ver },
  })
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//

  // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
  const [LOAD_GME_BOK, { data: LOAD_GME_BOK_DATA }] = useLazyQuery(GET_GME_BOK_DATA, {
    variables: { param: SRCH_DATA, ver },
    fetchPolicy: 'network-only',
  })

  //#############################################################//


  //##############  SRCH_EVENT   ##################//
  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_GME_BOK useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = async (datas, colId, sortId) => {
    SET_SRCH_DATA(props => ({ ...props, ...datas, AREA_ID: undefined }))
    LOAD_GME_BOK()
    onServerData()
  }

  /**
   * search 지역 선택시 실행되는 onAreaToggle(),areaTreeClose(),areaClick()이벤트
   */
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
    SET_SRCH_DATA(props => ({
      ...props,
      AREA_IDS: ev?.id === '1' ? [] : ev?.id,
    }))
    srchSetValue('AREA_ID', ev?.name)
  }
  //###################################################//

  /**
   * sorting 클릭시 colId,sortId 가져온후 server grid 리패치하는 이벤트
   */
  const onSorting = ev => {
    const colClick = ev.columnApi.columnController.allDisplayedColumns.filter(item => item.sort !== undefined)
    const colId = colClick[0].colId
    const sortId = colClick[0].sort
    onServerData(colId, sortId)
  }

  //##################### infinite scroll ########################//
  /**
   * GRID Server Side 실행시 useQuery등 사용이 불가하여 쿼리문 함수내에서 작성후
   * Axios를 사용해 데이터를 가져옴.
   * @param {String} colId 컬럼 정렬 클릭시 해당 컬럼ID가져옴
   *  @param {String} sortID 컬럼 정렬 클릭시 해당 sort 값가져옴
   */
  const onServerData = async (colId, sortId) => {
    const query = ` 
  query getBookGame($param: BookGameQParam, $ver: String!) {
    getBookGame(param: $param, ver: $ver) {
      RET_LIST{
        BOK_DAT_ID
        GME_DAT_ID
        GME_STRT_DT
        GME_END_DT
        PRT_DT
        SVC_NM
        SVC_CD
        GME_ID
        GME_NM
        SHP_NM
        AREA_ID
        AREA_NM
        SHP_ID
        USE_CRD
        GME_CRD
        USE_CRD_TP_CD
        PY_MD
        EVT_CD_NO
        SALE_CD_NO
        USR_ID
        USR_NM
        NIC_NM
        SCRE_VAL
        CCR_VAL
        SAR_VAL
        HCT_VAL
        OTCM_VAL
        }   
   }
 }`

    /**
     * Axios사용해 받아온 데이터 배열의 length를 startRow,endRow 비교하여 서버랜더링하는 이벤트
     * @param {Array} data GRID 데이터
     */
    const updateData = data => {
      const dataSource = {
        rowCount: null,
        getRows: function(params) {
          setTimeout(function() {
            let rowsThisPage = data.slice(params.startRow, params.endRow)
            let lastRow = -1
            if (data.length <= params.endRow) {
              lastRow = data.length
            }
            params.successCallback(rowsThisPage, lastRow)
          }, 500)
        },
      }
      GRID_API.setDatasource(dataSource)
    }
    try {
      const result = await Axios.post(
        `${process.env.REACT_APP_API_GW_URL}/api/v1/graphql`,
        { operationName: 'getBookGame', query, variables: { param: { ...SRCH_DATA, SORT: sortId, ORDER_COL: colId }, ver } },
        { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` || null }, withCredentials: true },
      )
      updateData(result?.data?.data?.getBookGame.RET_LIST)
    } catch (err) {
      if (err?.response?.status === 401) {
        const result = netError(err?.response?.status)
        result.then(res => (res === 'OK' ? refetch() : toast.error('오류 발생 했습니다.')))
      } else {
        toast.error('오류 발생 했습니다.')
      }
    }
    /**
     * try/catch 실행중 토큰인증 오류 401 리턴시 겟토큰후 리패치하는 이벤트
     */
    const refetch = async () => {
      try {
        const result = await Axios.post(
          `${process.env.REACT_APP_API_GW_URL}/api/v1/graphql`,
          { operationName: 'getBookGame', query, variables: { param: { ...SRCH_DATA, SORT: sortId, ORDER_COL: colId }, ver } },
          { headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` || null }, withCredentials: true },
        )
        updateData(result?.data?.data?.getBookGame.RET_LIST)
      } catch (err) {
        toast.error('오류 발생 했습니다.')
      }
    }
  }
  //######################################################//
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
                      <TextField
                        style={{ width: '100%' }}
                        label="아이디"
                        variant="outlined"
                        type="text"
                        name="USR_ID"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label="이름"
                        variant="outlined"
                        type="text"
                        name="USR_NM"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label="닉네임"
                        variant="outlined"
                        type="text"
                        name="NIC_NM"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label="HP"
                        variant="outlined"
                        type="text"
                        name="HP"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label="EMAIL"
                        variant="outlined"
                        type="text"
                        name="EML"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>

                    <Grid lg={4} xs={12} item>
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
                    <Grid lg={4} xs={12} item>
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
                              <span
                                style={{
                                  width: '50px',
                                  position: 'absolute',
                                  left: '10px',
                                }}
                              >
                                {SRCH_DATA.AREA_IDS !== undefined ? '' : '지역'}
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
                        <InputLabel>플레이샵</InputLabel>
                        <Select
                          label="플레이샵"
                          name="SHP_ID"
                          value={SRCH_DATA.MCN_ST_CD || ''}
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, SHP_ID: ev.target.value })) || ''}
                        >
                          <MenuItem value={''}>전체</MenuItem>
                          {LOAD_SHOP_DATA?.getShop?.map(option => (
                            <MenuItem key={option.SHP_ID} value={option.SHP_ID}>
                              {option.SHP_NM}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
                    {LOAD_GME_BOK_DATA?.getBookGame?.RET_LIST?.length > 0 ? (
                      <span>{LOAD_GME_BOK_DATA?.getBookGame?.RET_LIST?.length}</span>
                    ) : (
                      <span>0</span>
                    )}
                    건
                  </h3>
                </Box>
                <Box>
                  <Button
                    className={classes.tableBtn}
                    onClick={() => GRID_API.exportDataAsCsv()}
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{ backgroundColor: 'green' }}
                  >
                    엑셀다운
                  </Button>
                </Box>
              </Box>
              {/* TopBar 박스 */}

              {/* Ag그리드 박스 */}
              <Box>
                <div
                  className="ag-theme-alpine"
                  style={{
                    position: 'relative',
                    height: '660px',
                    width: '100%',
                  }}
                >
                  <AgGridReact
                    modules={[InfiniteRowModelModule, CsvExportModule]}
                    defaultColDef={{
                      flex: 1,
                      resizable: true,
                      minWidth: 160,
                      sortable: true,
                    }}
                    components={{
                      loadingRenderer: function(params) {
                        if (params.value !== undefined) {
                          return params.value
                        } else {
                          return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/images/loading.gif">'
                        }
                      },
                    }}
                    onCellClicked={ev => console.log(ev)}
                    cacheBlockSize={30}
                    rowBuffer={0}
                    onSortChanged={onSorting}
                    rowSelection={'multiple'}
                    rowModelType={'infinite'}
                    cacheOverflowSize={2}
                    maxConcurrentDatasourceRequests={1}
                    infiniteInitialRowCount={1000}
                    maxBlocksInCache={10}
                    onGridReady={param => SET_GRID_API(param.api)}
                    columnDefs={GmeBokCloumns}
                    gridOptions={{ rowHeight: 40 }}
                  ></AgGridReact>
                </div>
              </Box>
              {/* Ag그리드 박스 */}
            </Card>
          </Box>
        </Box>
      </Container>
    </Page>
  )
}

export default React.memo(GmeBokView)
