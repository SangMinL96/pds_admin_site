import React, { useEffect, useState, forwardRef } from 'react'
//###########Material-UI IMPORT ################//
import Page from 'src/components/Page'
import { Box, Button, Container, makeStyles, Typography } from '@material-ui/core'
import { AddBox, Check, Clear, DeleteOutline, Edit } from '@material-ui/icons'
import MaterialTable, { MTableEditField } from 'material-table'
//################################################//

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
//###################################################//

//############## SRC IMPORT   ##################//
import {
  GET_AUTHORIZATION,
  GET_MENU,
  GET_API,
  GET_AUTR_MENU,
  GET_AUTR_API,
  DEL_AUTHORIZATION,
  SAVE_AUTHORIZATION,
  SAVE_AUTR_MENU,
  SAVE_AUTR_API,
} from './AuthorizationQuery'
import { ver } from 'src/components/Utils'
//##############################################//

//############ toast (알림창) 라이브러리 IMPORT #############//
import { toast } from 'react-toastify'
//#####################################################//

//############### AG-GRID IMPORT #######################//
import { AgGridReact } from 'ag-grid-react/lib/agGridReact'

import useMedia from '../../../../components/useMedia'

//######################################################//

//############### CSS ####################//
const useStyles = makeStyles(theme => ({
  page: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    display: 'flex',

    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'top',
  },
  boxColumn: {
    display: 'flex',
    width: '60%',
  },
  w1600boxColumn: {
    display: 'flex',
  },
}))
//#########################################//

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
}

const AuthorizationView = () => {
  const classes = useStyles()
  const [media] = useMedia()
  //########## Authorization_MGT STATE ##############/
  const [UI_INFO, SET_UI_INFO] = useState({
    DEL_IDS: [],
  })
  const [DTL_DATA, SET_DTL_DATA] = useState({
    AUTR_ID: '',
    AUTR_NM: '',
    AUTR_DESC: '',
  })
  const [AUTR_MENU_API_INPUT, SET_AUTR_MENU_API_INPUT] = useState({
    AUTR_ID: '',
    MNU_IDS: [],
    API_IDS: [],
  })
  //#######################################/

  //################# AG, TABLE  ##################//
  const [API_GRID_API, SET_API_GRID_API] = useState(null)
  const [MENU_GRID_API, SET_MENU_GRID_API] = useState(null)
  const autrColumns = [
    { title: '권한아이디', field: 'AUTR_ID', cellStyle: { textAlign: 'center' }, width: '20%' },
    { title: '권한명', field: 'AUTR_NM', cellStyle: { textAlign: 'center' }, width: '30%' },
    { title: '권한설명', field: 'AUTR_DESC', cellStyle: { textAlign: 'center' }, width: '50%' },
  ]
  const menuCloumns = [
    { headerName: '메뉴계층', field: 'PATH', checkboxSelection: true, headerCheckboxSelection: true, width: 200, minWidth: 100 },
    { headerName: '메뉴아이디', field: 'MNU_ID', width: 200, minWidth: 100 },
    { headerName: '메뉴 명', field: 'MNU_NM', width: 200, minWidth: 100 },
  ]
  const apiCloumns = [
    { headerName: 'API ID', field: 'API_ID', checkboxSelection: true, headerCheckboxSelection: true, width: 200, minWidth: 100 },
    { headerName: 'API 명', field: 'API_NM', width: 200, minWidth: 100 },
    { headerName: '버전', field: 'API_VER', width: 200, minWidth: 100 },
    { headerName: '엔드포인트', field: 'API_EPT_PTH', width: 200, minWidth: 100 },
    { headerName: '모듈', field: 'MDLE_NM', width: 200, minWidth: 100 },
  ]
  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    width: 153,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' },
  }
  //##############################################//

  //########## 공동코드 및 함수 ###############//
  const variables = param => ({ fetchPolicy: 'network-only', variables: { param, ver } })

  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: MENU_LST } = useQuery(GET_MENU, variables({}))
  const { data: API_LST} = useQuery(GET_API, variables({}))
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//
  const [LOAD_AUTHORIZATION, { loading, data: AUTHORIZATION_DATA }] = useLazyQuery(GET_AUTHORIZATION, {
    variables: { param: {}, ver },
    fetchPolicy: 'network-only',
  })
  const [LOAD_AUTR_MENU, { data: AUTR_MENU_DATA }] = useLazyQuery(GET_AUTR_MENU, {
    fetchPolicy: 'network-only',
  })
  const [LOAD_AUTR_API, { data: AUTR_API_DATA }] = useLazyQuery(GET_AUTR_API, {
    fetchPolicy: 'network-only',
  })
  const [delMutation] = useMutation(DEL_AUTHORIZATION, { variables: { param: { AUTR_IDS: UI_INFO.DEL_IDS }, ver } })
  const [saveMutation] = useMutation(SAVE_AUTHORIZATION, { variables: { param: DTL_DATA, ver } })
  const [saveAutrMenuMutation] = useMutation(SAVE_AUTR_MENU, { variables: { param: AUTR_MENU_API_INPUT, ver } })
  const [saveAutrApiMutation] = useMutation(SAVE_AUTR_API, { variables: { param: AUTR_MENU_API_INPUT, ver } })
  //###########################################################//

  //####################### useEffect ###################?/

  

  useEffect(() => {
    LOAD_AUTHORIZATION()
    if (AUTR_MENU_DATA?.getAutrMenu) {
      checkIds(MENU_GRID_API, AUTR_MENU_DATA.getAutrMenu, 'MENU')
    }
    if (AUTR_API_DATA?.getAutrApi) {
      checkIds(API_GRID_API, AUTR_API_DATA.getAutrApi, 'API')
    }

  }, [
    MENU_GRID_API,
    API_GRID_API,
    LOAD_AUTHORIZATION,
    AUTR_MENU_DATA,
    AUTR_API_DATA,
 
  ])
  //##################################################//

  //##################   TABLE_EVENT    ##################//
  /**
   * 테이블 row click 이벤트 처리 함수
   * @param {object} ev 이벤트
   * @param {object} rowData 선택된 데이터의 데이터 값
   */
  const onRowClicked = (ev, rowData) => {
    SET_DTL_DATA(props => ({ ...props, AUTR_ID: rowData.AUTR_ID }))
    SET_UI_INFO(props => ({ ...props, DEL_IDS: [rowData.AUTR_ID] }))
    LOAD_AUTR_MENU({ variables: { param: { AUTR_ID: rowData.AUTR_ID }, ver } })
    LOAD_AUTR_API({ variables: { param: { AUTR_ID: rowData.AUTR_ID }, ver } })
  }

  const checkIds = (gridCtrl, ids, type) => {
    gridCtrl.deselectAll()
    if (type === 'MENU') {
      gridCtrl.forEachNode(node => {
        const arr = ids.map(id => (id.MNU_ID === node.data.MNU_ID ? true : false))
        node.setSelected(arr.includes(true))
      })
    }
    if (type === 'API') {
      gridCtrl.forEachNode(node => {
        const arr = ids.map(id => (id.API_ID === node.data.API_ID ? true : false))
        node.setSelected(arr.includes(true))
      })
    }
  }

  /**
   * 데이터 삭제 함수
   */
  const onRemove = async oldData => {
    await SET_UI_INFO(props => ({ ...props, DEL_IDS: [oldData.AUTR_ID] }))
    try {
      const result = await delMutation()
      if (result.data.delAuthorization.rsltCd === 'OK') {
        toast.success('성공적으로 삭제 되었습니다.')
        LOAD_AUTHORIZATION()
      } else {
        toast.error('오류 발생 했습니다.')
      }
    } catch (err) {
      
      toast.error(`${err} 오류가 발생했습니다.`)
  }
  }
  /**
   * 데이터 추가 함수
   */
  const onAdd = async newData => {
    await SET_DTL_DATA(props => ({ ...props, AUTR_ID: newData.AUTR_ID, AUTR_NM: newData.AUTR_NM, AUTR_DESC: newData.AUTR_DESC }))
    try {
      const result = await saveMutation()
      if (result.data.saveAuthorization.rsltCd === 'OK') {
        toast.success('성공적으로 추가 되었습니다.')
        LOAD_AUTHORIZATION()
      } else {
        toast.error('오류 발생 했습니다.')
      }
    }catch (err) {
      
      toast.error(`${err} 오류가 발생했습니다.`)
  }
  }
  /**
   * 데이터 저장 함수
   */
  const onSave = async (newData, oldData) => {
    await SET_DTL_DATA(props => ({ ...props, AUTR_ID: newData.AUTR_ID, AUTR_NM: newData.AUTR_NM, AUTR_DESC: newData.AUTR_DESC }))
    try {
      const result = await saveMutation()
      if (result.data.saveAuthorization.rsltCd === 'OK') {
        toast.success('성공적으로 저장 되었습니다.')
        LOAD_AUTHORIZATION()
      } else {
        toast.error('오류 발생 했습니다.')
      }
    } catch (err) {
      
      toast.error(`${err} 오류가 발생했습니다.`)
  }
  }

  /**
   * 메뉴 저장
   */
  const onSaveAutrMenu = async () => {
    const selectedMenus = MENU_GRID_API.getSelectedRows()
    const MNU_IDS = selectedMenus.map(data => data.MNU_ID)
    await SET_AUTR_MENU_API_INPUT(props => ({ ...props, AUTR_ID: UI_INFO.DEL_IDS[0], MNU_IDS, API_IDS: [] }))
    if (DTL_DATA.AUTR_ID === '') {
      toast.error('사용자 권한을 선택해주세요.')
    } else {
      try {
        const result = await saveAutrMenuMutation()
        if (result.data.saveAutrMenu.rsltCd === 'OK') {
          toast.success('성공적으로 저장 되었습니다.')
        } else {
          toast.error('오류 발생 했습니다.')
        }
      } catch (err) {
        
        toast.error(`${err} 오류가 발생했습니다.`)
    }
    }
  }
  /**
   * API 저장
   */
  const onSaveAutrApi = async () => {
    const selectedApis = API_GRID_API.getSelectedRows()
    const API_IDS = selectedApis.map(data => data.API_ID)
    await SET_AUTR_MENU_API_INPUT(props => ({ ...props, AUTR_ID: UI_INFO.DEL_IDS[0], API_IDS, MNU_IDS: [] }))
    if (DTL_DATA.AUTR_ID === '') {
      toast.error('사용자 권한을 선택해주세요.')
    } else {
      try {
        const result = await saveAutrApiMutation()
        if (result.data.saveAutrApi.rsltCd === 'OK') {
          toast.success('성공적으로 저장 되었습니다.')
        } else {
          toast.error('오류 발생 했습니다.')
        }
      } catch (err) {
        
        toast.error(`${err} 오류가 발생했습니다.`)
    }
    }
  }

  //###################################################//
  return (
    <Page className={classes.page} title="">
      <Container className={media.w1600 ? classes.container : null} maxWidth={false}>
        <Box style={{ width: media.w1600 ? '40%' : null }}>
          <MaterialTable
            style={{ height: '800px' }}
            localization={{
              header: {
                actions: 'Edit',
                headerStyle: { textAlign: 'center' },
              },
              body: {
                emptyDataSourceMessage: '권한이 없습니다.',
                editRow: {
                  deleteText: '삭제 시 복구 할 수 없습니다. 정말 삭제하시겠습니까?',
                },
              },
            }}
            title={
              <Typography variant="h6" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <b>권한 목록</b>
              </Typography>
            }
            isLoading={loading}
            columns={autrColumns}
            components={{
              EditField: props => <MTableEditField {...props} fullWidth />,
            }}
            data={AUTHORIZATION_DATA?.getAuthorization?.map(item => ({ id: item.AUTR_ID, ...item }))}
            icons={tableIcons}
            options={{
              headerStyle: {
                position: 'sticky',
                top: 0,
                backgroundColor: '#348ceb',
                color: '#FFF',
                textAlign: 'center',
              },
              rowStyle: rowData => {
                if (rowData.AUTR_ID === UI_INFO.DEL_IDS[0]) {
                  return { backgroundColor: 'lightgreen', fontSize: '13px' }
                } else {
                  return { backgroundColor: 'white', fontSize: '13px' }
                }
              },
              actionsColumnIndex: -1,
              addRowPosition: 'first',
              maxBodyHeight: '800px',
              paging: false,
              sorting: false,
            }}
            editable={{
              onRowAdd: newRow => onAdd(newRow),
              onRowUpdate: (newData, oldData) => onSave(newData, oldData),
              onRowDelete: oldData => onRemove(oldData),
            }}
            onRowClick={(event, rowData) => onRowClicked(event, rowData)}
          />
        </Box>
        <Box style={{ width: media.w1600 ? '30%' : null }}>
          <Button
            className={classes.button}
            style={{ backgroundColor: 'red' }}
            onClick={onSaveAutrMenu}
            variant="contained"
            color="primary"
          >
            저장
          </Button>
          <div className="ag-theme-alpine" style={{ position: 'relative', height: '770px', width: '100%' }}>
            <AgGridReact
              headerHeight={35}
              onGridReady={ev => SET_MENU_GRID_API(ev.api)}
              rowSelection="multiple"
              rowData={MENU_LST?.getMenuTree || []}
              defaultColDef={defaultColDef}
              localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
              columnDefs={menuCloumns}
              rowMultiSelectWithClick={true}
              gridOptions={{ rowHeight: 40 }}
            />
          </div>
        </Box>
        <Box style={{ width: media.w1600 ? '25%' : null }}>
          <Button
            className={classes.button}
            style={{ backgroundColor: 'red' }}
            onClick={onSaveAutrApi}
            variant="contained"
            color="primary"
          >
            저장
          </Button>
          <div className="ag-theme-alpine" style={{ position: 'relative', height: '770px', width: '100%' }}>
            <AgGridReact
              headerHeight={35}
              onGridReady={ev => SET_API_GRID_API(ev.api)}
              rowSelection="multiple"
              rowData={API_LST?.getApi || []}
              defaultColDef={defaultColDef}
              localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
              columnDefs={apiCloumns}
              rowMultiSelectWithClick={true}
              gridOptions={{ rowHeight: 40 }}
            />
          </div>
        </Box>
      </Container>
    </Page>
  )
}

export default AuthorizationView
