import React, { useEffect, useState, forwardRef } from 'react'
//###########Material-UI IMPORT ################//
import Page from 'src/components/Page'
import { Box, Container, makeStyles, useMediaQuery, Typography } from '@material-ui/core'
import { AddBox, Check, Clear, DeleteOutline, Edit } from '@material-ui/icons'
import MaterialTable, { MTableEditField } from 'material-table'
//################################################//

//############# APOLLO IMPORT #######################//
import { useLazyQuery, useMutation, useQuery } from '@apollo/react-hooks'
//###################################################//

//############## SRC IMPORT   ##################//
import {
  GET_MULTILANG,
  GET_MULTILANGMSG,
  DEL_MULTILANG,
  SAVE_MULTILANG,
  DEL_MULTILANGMSG,
  SAVE_MULTILANGMSG,
  GET_LOCALE_CD,
  GET_SVC_CD,
  GET_MLANG_MSG_TP_CD,
} from './MultiLangQuery'
import { ver } from 'src/components/Utils'
//##############################################//

//############ toast (알림창) 라이브러리 IMPORT #############//
import { toast } from 'react-toastify'
//#####################################################//

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

const MultiLangView = () => {
  const classes = useStyles()
  const media = {
    w1600: useMediaQuery('(min-width:1600px)'),
    w820: useMediaQuery('(min-width:820px)'),
    w800: useMediaQuery('(min-width:800px)'),
    w525: useMediaQuery('(min-width:525px)'),
    w490: useMediaQuery('(min-width:490px)'),
  }
  //########## Authorization_MGT STATE ##############/
  const [DTL_INPUT, SET_DTL_INPUT] = useState({
    MLANG_MSG_ID: '',
    MLANG_MSG_TP_CD: '',
    MLANG_MSG_TP_NM: '',
    MLANG_MSG_NM: '',
    MSG_CONT: '',
    LOCALE_CD: '',
    SVC_CD: '',
  })
  const [UI_INFO, SET_UI_INFO] = useState({
    SVC_CD_LOOKUP: {},
    LOCALE_CD_LOOKUP: {},
    MLANG_MSG_TP_CD_LOOKUP: {},
  })
  //#######################################/

  //########## 공동코드 및 함수 ###############//
  const variables = param => ({ fetchPolicy: 'network-only', variables: { param, ver } })
  //######################################//

  //########## 공동코드 쿼리 ###############//
  const { data: SVC_CD } = useQuery(GET_SVC_CD, variables({}))
  const { data: MLANG_MSG_TP_CD } = useQuery(GET_MLANG_MSG_TP_CD, variables({}))
  const { data: LOCALE_CD } = useQuery(GET_LOCALE_CD, variables({}))
  //######################################//

  //########## APOLLO 쿼리 및 뮤테이션 이용한 CRUD ##############//
  const { loading: mlangLoading, data: MULTILANG, LOAD_MTL_REFETCH } = useQuery(GET_MULTILANG, {
    variables: { param: {}, ver },
    fetchPolicy: 'network-only',
  })
  const [LOAD_MULTILANGMSG, { data: MULTILANGMSG }] = useLazyQuery(GET_MULTILANGMSG)
  const [delMlang] = useMutation(DEL_MULTILANG, {
    variables: { param: { SVC_CD: DTL_INPUT.SVC_CD, MLANG_MSG_ID: DTL_INPUT.MLANG_MSG_ID }, ver },
  })
  const [saveMlang] = useMutation(SAVE_MULTILANG, { variables: { param: DTL_INPUT, ver } })
  const [delMlangMsg] = useMutation(DEL_MULTILANGMSG, {
    variables: { param: { SVC_CD: DTL_INPUT.SVC_CD, MLANG_MSG_ID: DTL_INPUT.MLANG_MSG_ID, LOCALE_CD: DTL_INPUT.LOCALE_CD }, ver },
  })
  const [saveMlangMsg] = useMutation(SAVE_MULTILANGMSG, { variables: { param: DTL_INPUT, ver } })
  //###########################################################//

  //################# AG, TABLE  ##################//
  const mlangColumns = [
    { title: '다국어 아이디', field: 'MLANG_MSG_ID', cellStyle: { textAlign: 'center' }, width: '20%' },
    {
      title: '서비스',
      field: 'SVC_CD',
      cellStyle: { textAlign: 'center' },
      width: '20%',
      lookup: UI_INFO.SVC_CD_LOOKUP,
      initialEditValue: '',
    },
    {
      title: '메시지 유형',
      field: 'MLANG_MSG_TP_CD',
      cellStyle: { textAlign: 'center' },
      width: '20%',
      lookup: UI_INFO.MLANG_MSG_TP_CD_LOOKUP,
      initialEditValue: '',
    },
    { title: '메시지 명', field: 'MLANG_MSG_NM', cellStyle: { textAlign: 'center' }, width: '30%' },
  ]
  const mlangMsgColumns = [
    { title: '다국어 아이디', field: 'MLANG_MSG_ID', cellStyle: { textAlign: 'center' }, width: '20%', hidden: true },
    { title: '서비스', field: 'SVC_CD', cellStyle: { textAlign: 'center' }, width: '20%', hidden: true },
    {
      title: '로케일',
      field: 'LOCALE_CD',
      cellStyle: { textAlign: 'center' },
      width: '50%',
      lookup: UI_INFO.LOCALE_CD_LOOKUP,
      initialEditValue: '',
    },
    { title: '메시지 내용', field: 'MSG_CONT', cellStyle: { textAlign: 'center' }, width: '50%' },
  ]
  //##############################################//

  //################### useEffect ##################//

  useEffect(() => {
    if (SVC_CD && LOCALE_CD && MLANG_MSG_TP_CD) {
      var SVC_CD_LOOKUP = SVC_CD.getCode.reduce(function(acc, cur, i) {
        acc[cur.COM_CD] = cur.COM_CD_NM
        return acc
      }, {})
      var LOCALE_CD_LOOKUP = LOCALE_CD.getCode.reduce(function(acc, cur, i) {
        acc[cur.COM_CD] = cur.COM_CD_NM
        return acc
      }, {})
      var MLANG_MSG_TP_CD_LOOKUP = MLANG_MSG_TP_CD.getCode.reduce(function(acc, cur, i) {
        acc[cur.COM_CD] = cur.COM_CD_NM
        return acc
      }, {})
      SET_UI_INFO(props => ({ ...props, SVC_CD_LOOKUP, LOCALE_CD_LOOKUP, MLANG_MSG_TP_CD_LOOKUP }))
    }
  }, [SVC_CD, LOCALE_CD, MLANG_MSG_TP_CD, LOAD_MULTILANGMSG])
  //#################################################//

  //##################   TABLE_EVENT    ##################//
  /**
   * 테이블 row click 이벤트 처리 함수
   * @param {object} ev 이벤트
   * @param {object} rowData 선택된 데이터의 데이터 값
   */
  const onMlangRowClicked = async (ev, rowData) => {
    await SET_DTL_INPUT(props => ({ ...props, MLANG_MSG_ID: rowData.MLANG_MSG_ID, SVC_CD: rowData.SVC_CD }))
    LOAD_MULTILANGMSG({ variables: { param: { SVC_CD: rowData.SVC_CD, MLANG_MSG_ID: rowData.MLANG_MSG_ID }, ver } })
  }
  /**
   * 데이터 삭제 함수
   */
  const onRemoveMlang = async oldData => {
    try {
      await SET_DTL_INPUT(props => ({ ...props, MLANG_MSG_ID: oldData.MLANG_MSG_ID, SVC_CD: oldData.SVC_CD }))
      const result = await delMlang()
      if (result.data.delAuthorization.rsltCd === 'OK') {
        toast.success('성공적으로 삭제 되었습니다.')
        LOAD_MTL_REFETCH()
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
  const onAddMlang = async newData => {
    try {
      await SET_DTL_INPUT(props => ({
        ...props,
        MLANG_MSG_ID: newData.MLANG_MSG_ID,
        SVC_CD: newData.SVC_CD,
        MLANG_MSG_TP_CD: newData.MLANG_MSG_TP_CD,
        MLANG_MSG_NM: newData.MLANG_MSG_NM,
      }))
      const result = await saveMlang()
      if (result.data.saveMlang.rsltCd === 'OK') {
        toast.success('성공적으로 저장 되었습니다.')
        LOAD_MTL_REFETCH()
      } else {
        toast.error('오류 발생 했습니다.')
      }
    } catch (err) {
      toast.error(`${err} 오류가 발생했습니다.`)
    }
  }
  /**
   * 데이터 저장 함수
   */
  const onSaveMlang = async (newData, oldData) => {
    if (Object.keys(newData).filter(k => newData[k] !== oldData[k]).length === 0) {
      toast.info('변경사항이 없습니다.')
    }
    onAddMlang(newData)
  }
  /**
   * 데이터 삭제 함수
   */
  const onRemoveMlangMsg = async oldData => {
    try {
      await SET_DTL_INPUT(props => ({ ...props, LOCALE_CD: oldData.LOCALE_CD }))
      const result = await delMlangMsg()
      if (result.data.delMlangMsg.rsltCd === 'OK') {
        toast.success('성공적으로 삭제 되었습니다.')
        LOAD_MULTILANGMSG({ variables: { param: { SVC_CD: DTL_INPUT.SVC_CD, MLANG_MSG_ID: DTL_INPUT.MLANG_MSG_ID }, ver } })
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
  const onAddMlangMsg = async newData => {
    try {
      await SET_DTL_INPUT(props => ({ ...props, LOCALE_CD: newData.LOCALE_CD, MSG_CONT: newData.MSG_CONT }))
      const result = await saveMlangMsg()
      if (result.data.saveMlangMsg.rsltCd === 'OK') {
        toast.success('성공적으로 저장 되었습니다.')
        LOAD_MULTILANGMSG({ variables: { param: { SVC_CD: DTL_INPUT.SVC_CD, MLANG_MSG_ID: DTL_INPUT.MLANG_MSG_ID }, ver } })
      } else {
        toast.error('오류 발생 했습니다.')
      }
    } catch (err) {
      toast.error(`${err} 오류가 발생했습니다.`)
    }
  }
  /**
   * 데이터 저장 함수
   */
  const onSaveMlangMsg = async (newData, oldData) => {
    if (Object.keys(newData).filter(k => newData[k] !== oldData[k]).length === 0) {
      toast.info('변경사항이 없습니다.')
    }
    onAddMlangMsg(newData)
  }

  //###################################################//

  return (
    <Page className={classes.page} title="다국어 관리">
      <Container className={media.w1600 ? classes.container : null} maxWidth={false}>
        <Box style={{ width: media.w1600 ? '50%' : null }}>
          <MaterialTable
            style={{ height: '800px' }}
            localization={{
              header: {
                actions: 'Edit',
                headerStyle: { textAlign: 'center' },
              },
              body: {
                emptyDataSourceMessage: '다국어 없습니다.',
                editRow: {
                  deleteText: '삭제 시 복구 할 수 없습니다. 정말 삭제하시겠습니까?',
                },
              },
            }}
            title={
              <Typography variant="h6" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <b>다국어 목록</b>
              </Typography>
            }
            isLoading={mlangLoading}
            columns={mlangColumns}
            components={{
              EditField: props => <MTableEditField {...props} fullWidth />,
            }}
            data={MULTILANG?.getMlang?.map(item => ({ id: item.SVC_CD + item.MLANG_MSG_ID, ...item }))}
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
                if (rowData.MLANG_MSG_ID === DTL_INPUT.MLANG_MSG_ID) {
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
              onRowAdd: newRow => onAddMlang(newRow),
              onRowUpdate: (newData, oldData) => onSaveMlang(newData, oldData),
              onRowDelete: oldData => onRemoveMlang(oldData),
            }}
            onRowClick={(event, rowData) => onMlangRowClicked(event, rowData)}
          />
        </Box>
        <Box style={{ width: media.w1600 ? '48%' : null }}>
          <MaterialTable
            style={{ height: '800px' }}
            localization={{
              header: {
                actions: 'Edit',
                headerStyle: { textAlign: 'center' },
              },
              body: {
                emptyDataSourceMessage: '다국어 메시지 없습니다.',
                editRow: {
                  deleteText: '삭제 시 복구 할 수 없습니다. 정말 삭제하시겠습니까?',
                },
              },
            }}
            title={
              <Typography variant="h6" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <b>다국어 메시지 목록</b>
              </Typography>
            }
            isLoading={mlangLoading}
            columns={mlangMsgColumns}
            components={{
              EditField: props => <MTableEditField {...props} fullWidth />,
            }}
            data={MULTILANGMSG?.getMlangMsg?.map(item => ({ id: item.SVC_CD + item.MLANG_MSG_ID + item.LOCALE_CD, ...item }))}
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
                return { backgroundColor: 'white', fontSize: '13px' }
              },
              actionsColumnIndex: -1,
              addRowPosition: 'first',
              maxBodyHeight: '800px',
              paging: false,
              sorting: false,
            }}
            editable={{
              onRowAdd: newRow => onAddMlangMsg(newRow),
              onRowUpdate: (newData, oldData) => onSaveMlangMsg(newData, oldData),
              onRowDelete: oldData => onRemoveMlangMsg(oldData),
            }}
          />
        </Box>
      </Container>
    </Page>
  )
}

export default MultiLangView
