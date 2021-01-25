import React, {   useState } from 'react'
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
} from '@material-ui/core'
//################################################//

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useQuery } from '@apollo/react-hooks'
import { SVC_CD_CODE, GET_AREA, GET_PGM_DL_DATA, SW_DL_ST_CODE } from './McnDLMgtQuery'
//###################################################//

//############### AG-GRID IMPORT #######################//
import { AgGridReact } from 'ag-grid-react/lib/agGridReact'
//######################################################//

//############# react-hook-form IMPORT ################//
import { useForm } from 'react-hook-form'
//###################################################//



//############## SRC IMPORT   ##################//
import { ver } from 'src/components/Utils'
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
}))
//#########################################//

const GmeRankView = () => {
  const classes = useStyles()
  const [media] = useMedia()

  //################# AG 그리드  ##################//
  const [GRID_API, SET_GRID_API] = useState(null)
  const GmeRankCloumns = [
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
      headerName: '국가',
      field: 'NAT_NM',
    },
    {
      headerName: 'MAC Address',
      field: 'MAC_ADDR',
      width: 100,
    },
    {
      headerName: 'SW 구분',
      field: 'SW_TP_NM',
      width: 150,
    },
    {
      headerName: '버전',
      field: 'SW_BLD_VER',
      width: 150,
    },
    {
      headerName: 'DL 상태',
      field: 'SW_DL_ST_NM',
    },
    {
      headerName: 'DL 일시',
      field: 'DL_DT',
    },
  ]
  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 150,
    flex: 1,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }
  //##############################################//

  //################ SHOP_MGT STATE ################/
  const [SRCH_DATA, SET_SRCH_DATA] = useState({
    SVC_CD: '',
    MCN_MDL_CD: '',
    AREA_ID: '',
    MAC_ADDR: '',
    MAN_SW_DL_ST: '',
    SUB_SW_DL_ST: '',
  })

  //#######################################/

  //### 인풋 폼 전송시 인풋 값 받는 함수 (react-hook-form 라이브러리) ###//
  const { register: srchRegister, handleSubmit: srchSubmit } = useForm()
  //#################################################################//

  //########## 공동코드 쿼리 ###############//
  const { data: svc_code } = useQuery(SVC_CD_CODE)
  const { data: sw_dl_st_cd } = useQuery(SW_DL_ST_CODE)
  const { data: nat_code } = useQuery(GET_AREA, {
    variables: { param: { AREA_TP_CD: '001' }, ver },
  })
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//

  // 조회시 Submit에서 데이터를 받아와 skip 값이 false로 바껴 쿼리 실행 (공지사항 데이터)
  const [LOAD_PGM_DL, { data: LOAD_PGM_DL_DATA }] = useLazyQuery(GET_PGM_DL_DATA, {
    variables: { param: SRCH_DATA, ver },
    fetchPolicy: 'network-only',
  })
  //#############################################################//



  //##############  SRCH_EVENT   ##################//
  /**
   * 조회시 인풋 값을 받아와 setParam저장시켜 LOAD_PGM_DL useQuery 실행 시킴.
   * @param {object} datas 인풋 Value 값
   */
  const onSubmitSrch = datas => {
    SET_SRCH_DATA(props => ({ ...props, SHP_NM: datas.SHP_NM, MCN_SR_NO: datas.MCN_SR_NO }))
    LOAD_PGM_DL()
  }
  //###################################################//

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
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>모델명</InputLabel>
                        <Select
                          label="모델명"
                          name="MCN_MDL_CD"
                          value={SRCH_DATA.MCN_MDL_CD || ''}
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, MCN_MDL_CD: ev.target.value })) || ''}
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
                    <Grid lg={2} xs={12} item>
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
                    <Grid lg={2} xs={12} item>
                      <TextField
                        style={{ width: '100%' }}
                        label="MAC Address"
                        variant="outlined"
                        type="text"
                        name="MAC_ADDR"
                        inputRef={srchRegister}
                        size="small"
                      />
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>메인SW DL상태</InputLabel>
                        <Select
                          label="메인SW DL상태"
                          name="MAN_SW_DL_ST"
                          value={SRCH_DATA.MAN_SW_DL_ST || ''}
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, MAN_SW_DL_ST: ev.target.value })) || ''}
                        >
                          <MenuItem value={''}>전체</MenuItem>
                          {sw_dl_st_cd?.getCode?.map(option => (
                            <MenuItem key={option.COM_CD} value={option.COM_CD}>
                              {option.COM_CD_NM}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid lg={2} xs={12} item>
                      <FormControl style={{ width: '100%' }} size="small" variant="outlined">
                        <InputLabel>서브SW DL상태</InputLabel>
                        <Select
                          label="서브SW DL상태"
                          name="SUB_SW_DL_ST"
                          value={SRCH_DATA.SUB_SW_DL_ST || ''}
                          onChange={ev => SET_SRCH_DATA(props => ({ ...props, SUB_SW_DL_ST: ev.target.value })) || ''}
                        >
                          <MenuItem value={''}>전체</MenuItem>
                          {sw_dl_st_cd?.getCode?.map(option => (
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
                    {LOAD_PGM_DL_DATA?.getMachinePgmDlHistory?.RET_LIST?.length > 0 ? (
                      <span>{LOAD_PGM_DL_DATA?.getMachinePgmDlHistory?.RET_LIST?.length}</span>
                    ) : (
                      <span>0</span>
                    )}
                    건
                  </h3>
                </Box>
                <Box>
                  <Button
                    className={classes.tableBtn}
                    style={{ backgroundColor: 'green' }}
                    onClick={() => GRID_API.exportDataAsCsv()}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    엑셀다운
                  </Button>
                </Box>
              </Box>
              {/* TopBar 박스 */}

              {/* Ag그리드 박스 */}
              <Box>
                <div className="ag-theme-alpine" style={{ position: 'relative', height: '660px', width: '100%' }}>
                  <AgGridReact
                    headerHeight={35}
                    onGridReady={ev => SET_GRID_API(ev.api)}
                    rowSelection="multiple"
                    rowData={LOAD_PGM_DL_DATA?.getMachinePgmDlHistory?.RET_LIST || []}
                    defaultColDef={defaultColDef}
                    localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
                    columnDefs={GmeRankCloumns}
                    pagination={true}
                    paginationPageSize={10}
                    gridOptions={{ rowHeight: 40 }}
                  />
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

export default React.memo(GmeRankView)
