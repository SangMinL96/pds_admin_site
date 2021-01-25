import React, { useState, forwardRef } from 'react'

//######### Material UI IMPORT ###############//
import {
  Box,
  Button,
  Card,
  Select,
  Container,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core'
import { AddBox, Check, Clear, DeleteOutline, Edit } from '@material-ui/icons'
import MaterialTable, { MTableEditField } from 'material-table'
import { blue } from '@material-ui/core/colors'
//###########################################//

//############# react hook form IMPORT ###########//
import { useForm } from 'react-hook-form'
//################################################//

//############Apollo IMPORT ####################//
import {
  GET_MACHINE_STT_DATA,
  SVC_CD_DATA,
  MCN_MDL_CD_DATA,
  ADD_MCN_STT,
  EDIT_MCN_STT,
  DEL_MCN_STT,
  GET_MACHINE_STT_ITM_DATA,
  ADD_MCN_STT_ITM,
  EDIT_MCN_STT_ITM,
  DEL_MCN_STT_ITM,
} from './MachineSttgQuery'
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
//#############################################//

//############# Script IMPORT ##################//
import Page from 'src/components/Page'
import { ver } from '../../../components/Utils'
import { toast } from 'react-toastify'
import useMedia from 'src/components/useMedia'
//#############################################//

//############## CSS #####################//
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    margin: '1em',
  },
  //############# SEARCH CSS ##############//
  searchBox: {
    position: 'relative',
    zIndex: 1,
    marginBottom: '1em',
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
    width: '200px',
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
  //####################################//

  //########### GRID CSS ###################//
  tableBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))
//########################################//

const MachineSttgView = () => {
  const classes = useStyles()
  const { register, handleSubmit } = useForm()
  const [media] = useMedia()
  //########## SHOP_MGT STATE ##############/
  const [MCN_SRCH_DATA, SET_MCN_SRCH_DATA] = useState({
    MCN_STTG_NM: '',
    SVC_CD: '',
    MCN_MDL_CD: '',
  })
  const [MCN_UPR_ID, SET_MCN_URP_ID] = useState()
  //#######################################/

  //############## 공동코드 쿼리 ##############//
  const { data: SVC_CD } = useQuery(SVC_CD_DATA)
  const { data: MCN_MDL_CD } = useQuery(MCN_MDL_CD_DATA)
  //##########################################//

  //############# MCN_STT 쿼리 및 뮤테이션 ###########//
  const [LOAD_MCN_STT_DATA, { data: mcnSttData, loading }] = useLazyQuery(GET_MACHINE_STT_DATA, {
    variables: { param: MCN_SRCH_DATA, ver },
    fetchPolicy: 'network-only',
  })
  const [addMcnStt] = useMutation(ADD_MCN_STT)
  const [editMcnStt] = useMutation(EDIT_MCN_STT)
  const [delMcnStt] = useMutation(DEL_MCN_STT)
  //###############################################//

  //############# MCN_STT_ITM 쿼리 및 뮤테이션 ###########//
  const [LOAD_MCN_STT_ITM_DATA, { data: mcnSttItmData }] = useLazyQuery(GET_MACHINE_STT_ITM_DATA, {
    variables: { param: { MCN_STTG_ID: MCN_UPR_ID }, ver },
    fetchPolicy: 'network-only',
  })
  const [addMcnSttItem] = useMutation(ADD_MCN_STT_ITM)
  const [editMcnSttItem] = useMutation(EDIT_MCN_STT_ITM)
  const [delMcnSttItem] = useMutation(DEL_MCN_STT_ITM)
  //###############################################//

  

  //############## SRCH EVENT  #################//
  const onSubmit = datas => {
    SET_MCN_SRCH_DATA(props => ({ ...props, ...datas }))
    LOAD_MCN_STT_DATA()
  }
  const onChangeSrchSelect = event => {
    const { name, value } = event.target
    SET_MCN_SRCH_DATA(props => ({ ...props, [name]: value }))
  }
  const onSubmitReset = () => {
    SET_MCN_URP_ID('reset')
    LOAD_MCN_STT_ITM_DATA()
  }
  //###############################################//

  //############## MCN_STT EVENT  #################//
  const mcnSttIcon = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  }

  const onRowClick = rowData => {
    SET_MCN_URP_ID(rowData.MCN_STTG_ID)
    LOAD_MCN_STT_ITM_DATA({
      variables: { param: { MCN_STTG_ID: rowData.MCN_STTG_ID }, ver },
      fetchPolicy: 'network-only',
    })
  }

  const onAddMcnStt = async newRow => {
    if (newRow?.SVC_NM?.target?.value === undefined || newRow?.MCN_MDL_NM?.target?.value === undefined) {
      toast.error('빈칸을 입력 및 선택해주세요.')
    } else {
      try {
        const result = await addMcnStt({
          variables: {
            param: {
              SVC_CD: newRow?.SVC_NM?.target?.value,
              MCN_MDL_CD: newRow?.MCN_MDL_NM?.target?.value,
              MCN_STTG_NM: newRow?.MCN_STTG_NM,
            },
            ver,
          },
        })
        if (result.data.saveMachineSetting.rsltCd === 'OK') {
          toast.success('성공적으로 추가 되었습니다.')
          LOAD_MCN_STT_DATA()
        } else {
          toast.error('다시 시도해주세요.')
        }
      } catch (err) {
        toast.error(`${err} 오류가 발생했습니다.`)
      }
    }
  }
  const onEditMcnStt = async (newData, oldData) => {
    try {
      const result = await editMcnStt({
        variables: {
          param: {
            MCN_STTG_ID: newData?.MCN_STTG_ID,
            SVC_CD: newData?.SVC_NM?.target?.value || newData?.SVC_CD,
            MCN_MDL_CD: newData?.MCN_MDL_NM?.target?.value || newData?.MCN_MDL_CD,
            MCN_STTG_NM: newData?.MCN_STTG_NM,
          },
          ver,
        },
      })
      if (result.data.saveMachineSetting.rsltCd === 'OK') {
        toast.success('성공적으로 수정 되었습니다.')
        LOAD_MCN_STT_DATA()
      } else {
        toast.error('다시 시도해주세요.')
      }
    }  catch (err) {
      toast.error(`${err} 오류가 발생했습니다.`)
    }
  }
  const onDelMcnStt = async delData => {
    try {
      const result = await delMcnStt({
        variables: {
          param: {
            MCN_STTG_IDS: [delData?.MCN_STTG_ID],
          },
          ver,
        },
      })
      if (result.data.delMachineSetting.rsltCd === 'OK') {
        toast.success('성공적으로 삭제 되었습니다.')
        LOAD_MCN_STT_DATA()
        SET_MCN_URP_ID('reset')
        LOAD_MCN_STT_ITM_DATA()
      } else {
        toast.error('다시 시도해주세요.')
      }
    }  catch (err) {
      toast.error(`${err} 오류가 발생했습니다.`)
    }
  }
  //##################################################//

  //############## MCN_STT_ITM EVENT   ################//
  const mcnSttItemIcon = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  }

  const onAddMcnSttItem = async newRow => {
    if (MCN_UPR_ID === 'reset' || MCN_UPR_ID === undefined) {
      toast.error('상세정보를 입력할 머신을 선택해주세요.')
    } else {
      if (
        newRow?.MCN_STTG_ITM_ID === '' ||
        newRow?.MCN_STTG_ITM_NM === '' ||
        newRow?.MCN_STTG_ITM_ID === undefined ||
        newRow?.MCN_STTG_ITM_NM === undefined ||
        newRow?.MCN_LCL_UPD_YN?.target?.value === undefined
      ) {
        toast.error('빈칸을 입력 및 선택해주세요.')
      } else {
        try {
          const result = await addMcnSttItem({
            variables: {
              param: {
                MCN_STTG_ID: MCN_UPR_ID,
                MCN_STTG_ITM_ID: newRow?.MCN_STTG_ITM_ID,
                MCN_STTG_ITM_NM: newRow?.MCN_STTG_ITM_NM,
                MCN_STTG_ITM_VAL: newRow?.MCN_STTG_ITM_VAL,
                MCN_LCL_UPD_YN: newRow?.MCN_LCL_UPD_YN?.target?.value || newRow?.MCN_LCL_UPD_YN,
              },
              ver,
            },
          })
          if (result.data.saveMachineSettingItem.rsltCd === 'OK') {
            toast.success('성공적으로 추가 되었습니다.')
          } else {
            toast.error('다시 시도해주세요.')
          }
          LOAD_MCN_STT_ITM_DATA()
        } catch (err) {
          toast.error(`${err} 오류가 발생했습니다.`)
        }
      }
    }
  }

  const onEditMcnSttItem = async newData => {
    if (newData?.MCN_STTG_ITM_ID === '' || newData?.MCN_STTG_ITM_NM === '') {
      toast.error('빈칸을 입력 및 선택해주세요.')
    } else {
      try {
        const result = await editMcnSttItem({
          variables: {
            param: {
              MCN_STTG_ID: MCN_UPR_ID,
              MCN_STTG_ITM_ID: newData?.MCN_STTG_ITM_ID,
              MCN_STTG_ITM_NM: newData?.MCN_STTG_ITM_NM,
              MCN_STTG_ITM_VAL: newData?.MCN_STTG_ITM_VAL,
              MCN_LCL_UPD_YN: newData?.MCN_LCL_UPD_YN?.target?.value || newData?.MCN_LCL_UPD_YN,
            },
            ver,
          },
        })
        if (result.data.saveMachineSettingItem.rsltCd === 'OK') {
          toast.success('성공적으로 수정 되었습니다.')
        } else {
          toast.error('다시 시도해주세요.')
        }
        LOAD_MCN_STT_ITM_DATA()
      }  catch (err) {
    
        toast.error(`${err} 오류가 발생했습니다.`)
      }
    }
  }

  const onDelMcnSttItem = async delData => {
    try {
      const result = await delMcnSttItem({
        variables: {
          param: {
            MCN_STTG_IDS: [MCN_UPR_ID],
            MCN_STTG_ITM_IDS: [delData?.MCN_STTG_ITM_ID],
          },
          ver,
        },
      })
      if (result.data.delMachineSettingItem.rsltCd === 'OK') {
        toast.success('성공적으로 삭제 되었습니다.')
        LOAD_MCN_STT_ITM_DATA()
      } else {
        toast.error('다시 시도해주세요.')
      }
    }  catch (err) {
      toast.error(`${err} 오류가 발생했습니다.`)
    }
  }
  //#################################################//

  return (
    <Page className={classes.root} title="머신 설정 관리">
      {/* ################### SRCH UI #################### */}
      <Box className={classes.searchBox}>
        <Card className={media.w490 ? classes.searchCard : classes.w490searchCard}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w490 ? classes.formBox : null}>
              <Grid container spacing={1}>
                <Grid style={{ width: media.w490 ? null : '100%' }} item>
                  <FormControl
                    size="small"
                    variant="outlined"
                    className={classes.formInputWidth}
                    style={{ width: media.w490 ? null : '100%' }}
                  >
                    <InputLabel>서비스</InputLabel>
                    <Select
                      label="서비스"
                      name="SVC_CD"
                      value={SVC_CD?.getCode !== undefined ? MCN_SRCH_DATA.SVC_CD : ''}
                      onChange={onChangeSrchSelect}
                    >
                      <MenuItem value={''}>전체</MenuItem>
                      {SVC_CD?.getCode?.map(option => (
                        <MenuItem key={option.COM_CD} value={option.COM_CD}>
                          {option.COM_CD_NM}
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
                    <InputLabel>모델 명</InputLabel>
                    <Select
                      label="모델 명"
                      name="MCN_MDL_CD"
                      value={MCN_MDL_CD?.getCode !== undefined ? MCN_SRCH_DATA.MCN_MDL_CD : ''}
                      onChange={onChangeSrchSelect}
                    >
                      <MenuItem value={''}>전체</MenuItem>
                      {MCN_MDL_CD?.getCode?.map(option => (
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
                    label="머신 설정명"
                    variant="outlined"
                    type="text"
                    name="MCN_STTG_NM"
                    inputRef={register}
                    size="small"
                  />
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Button
                onClick={() => onSubmitReset()}
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
      {/* ########################################################*/}

      {/* ##################### MCN_STT UI ####################### */}
      <Box className={media.w1170 ? classes.tableBox : null}>
        <Box width={media.w1170 ? '48%' : '100%'}>
          <Container component="main" maxWidth={false} style={{ margin: 0, padding: 0 }}>
            <MaterialTable
              onRowClick={(ev, rowData) => onRowClick(rowData)}
              style={{ height: '80vh' }}
              localization={{
                header: {
                  actions: 'Edit',
                  headerStyle: { textAlign: 'center' },
                },
                body: {
                  emptyDataSourceMessage: '등록 샵이 없습니다.',
                  editRow: {
                    deleteText: '삭제 시 복구 할 수 없습니다. 정말 삭제하시겠습니까?',
                  },
                },
              }}
              title={
                <Typography
                  variant="h6"
                  style={{ whiteSpace: 'nowrap', display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  <div> 총{mcnSttData?.length > 0 ? <span>{mcnSttData?.length}</span> : <span>0</span>}건</div>
                </Typography>
              }
              isLoading={loading}
              columns={[
                {
                  title: '서비스',
                  field: 'SVC_NM',
                  cellStyle: { textAlign: 'center' },
                  width: '30%',
                  editComponent: props => (
                    <FormControl size="small" variant="outlined" style={{ width: media.w490 ? null : '100%' }}>
                      <Select
                        className={classes.formInputWidth}
                        value={props?.value?.target?.value || props?.rowData?.SVC_CD || ''}
                        onChange={props.onChange}
                      >
                        <MenuItem value={''}>전체</MenuItem>
                        {SVC_CD?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        )) || []}
                      </Select>
                    </FormControl>
                  ),
                },
                {
                  title: '모델명',
                  field: 'MCN_MDL_NM',
                  cellStyle: { textAlign: 'center' },
                  width: '30%',
                  editComponent: props => (
                    <FormControl size="small" variant="outlined">
                      <Select
                        className={classes.formInputWidth}
                        value={props?.value?.target?.value || props?.rowData?.MCN_MDL_CD || ''}
                        onChange={props.onChange}
                      >
                        <MenuItem value={''}>전체</MenuItem>
                        {MCN_MDL_CD?.getCode?.map(option => (
                          <MenuItem key={option.COM_CD} value={option.COM_CD}>
                            {option.COM_CD_NM}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ),
                },
                { title: '머신 설정 명', field: 'MCN_STTG_NM', cellStyle: { textAlign: 'center' }, width: '30%' },
              ]}
              components={{
                EditField: props => <MTableEditField {...props} fullWidth />,
              }}
              data={mcnSttData?.getMachineSetting?.map(item => ({ id: item.MCN_STTG_ID, ...item }))}
              icons={mcnSttIcon}
              options={{
                headerStyle: {
                  position: 'sticky',
                  top: 0,
                  backgroundColor: blue['800'],
                  color: '#FFF',
                  textAlign: 'center',
                },
                rowStyle: rowData => {
                  if (rowData.MCN_STTG_ID === MCN_UPR_ID) {
                    return { backgroundColor: 'lightgreen', fontSize: '13px' }
                  } else {
                    return { backgroundColor: 'white', fontSize: '13px' }
                  }
                },
                maxBodyHeight: '70vh',
                actionsColumnIndex: -1,
                addRowPosition: 'first',
                overflowY: 'auto',
                paging: false,
                search: false,
                sorting: false,
              }}
              editable={{
                onRowAdd: newRow => onAddMcnStt(newRow),
                onRowUpdate: (newData, oldData) => onEditMcnStt(newData, oldData),
                onRowDelete: delData => onDelMcnStt(delData),
              }}
            />
          </Container>
        </Box>
        {/* ######################################################## */}

        {/* ##################### MCN_STT_ITM ###################### */}
        <Box width={media.w1170 ? '48%' : '100%'} marginTop={media.w1170 ? '0em' : '1em'}>
          <Container component="main" maxWidth={false} style={{ margin: 0, padding: 0 }}>
            <MaterialTable
              onRowClick={(ev, rowData) => console.log(ev, rowData)}
              style={{ height: '80vh' }}
              localization={{
                header: {
                  actions: 'Edit',
                  headerStyle: { textAlign: 'center' },
                },
                body: {
                  emptyDataSourceMessage: '등록된 머신 설정 아이템이 없습니다.',
                  editRow: {
                    deleteText: '삭제 시 복구 할 수 없습니다. 정말 삭제하시겠습니까?',
                  },
                },
              }}
              title={
                <Typography
                  variant="h6"
                  style={{ whiteSpace: 'nowrap', display: 'flex', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  <div className={classes.detailsHeaderTitle}>머신 설정 상세</div>
                </Typography>
              }
              columns={[
                { title: '설정 ID', field: 'MCN_STTG_ITM_ID', cellStyle: { textAlign: 'center' }, width: '30%' },
                { title: '설정 항목명', field: 'MCN_STTG_ITM_NM', cellStyle: { textAlign: 'center' }, width: '30%' },
                { title: '설정 값', field: 'MCN_STTG_ITM_VAL', cellStyle: { textAlign: 'center' }, width: '50%' },
                {
                  title: '로컬 수정 여부',
                  field: 'MCN_LCL_UPD_YN',
                  cellStyle: { textAlign: 'center' },
                  width: '30%',
                  editComponent: props => (
                    <FormControl size="small" variant="outlined">
                      <Select
                        value={props?.value?.target?.value || props?.rowData?.MCN_LCL_UPD_YN || ''}
                        onChange={props.onChange}
                      >
                        <MenuItem value={'Y'}>Y</MenuItem>
                        <MenuItem value={'N'}>N</MenuItem>
                      </Select>
                    </FormControl>
                  ),
                },
              ]}
              components={{
                EditField: props => <MTableEditField {...props} fullWidth />,
              }}
              data={mcnSttItmData?.getMachineSettingItem?.map(item => ({ id: item.MCN_STTG_ITM_ID, ...item }))}
              icons={mcnSttItemIcon}
              options={{
                headerStyle: {
                  position: 'sticky',
                  top: 0,
                  backgroundColor: blue['800'],
                  color: '#FFF',
                  textAlign: 'center',
                },

                maxBodyHeight: '70vh',
                actionsColumnIndex: -1,
                addRowPosition: 'first',
                overflowY: 'auto',
                paging: false,
                search: false,
                sorting: false,
              }}
              editable={{
                onRowAdd: newRow => onAddMcnSttItem(newRow),
                onRowUpdate: newData => onEditMcnSttItem(newData),
                onRowDelete: delData => onDelMcnSttItem(delData),
              }}
            />
          </Container>
        </Box>
        {/* #################################################### */}
      </Box>
    </Page>
  )
}

export default MachineSttgView
