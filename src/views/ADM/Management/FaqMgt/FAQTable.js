import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Card } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useDataDispatch, useDataState } from './FAQContext';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { NTC_DATA, NTC_DEL } from './FAQQuery';
import { toast } from 'react-toastify';
import {param, tableRemoveDispatch, tableSelectDispatch} from "./FAQComponent/FAQUtils"
import { titleStyle } from './FAQComponent/FAQStyle';

const FAQCloumns = [
  {
    headerName: '서비스',
    field: 'SVC_NM_LST',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    suppressSizeToFit: true
  },
  {
    headerName: '아이디',

    field: 'NTC_ID'
  },
  {
    headerName: '제목',

    field: 'NTC_NM'
  },
  {
    headerName: '내용',

    field: 'NTC_CONT'
  },
  {
    headerName: '첨부파일수',
    field: 'FL_CNT'
  },

  {
    headerName: '국가',
    field: 'NAT_CD_LST'
  },
  {
    headerName: '시도',

    field: 'STT_CD_LST'
  },
  {
    headerName: '수정일',
    field: 'UPD_DT'
  }
];
const FAQTable = () => {

  const dispatch = useDataDispatch();
  const classes = titleStyle();
  const { gridData, selClear,selFocus,subMitFlag } = useDataState(); //Context컴포넌트안에 리듀서 State 값을 가져옴. 
  const [gridApi, setGridApi] = useState(null); // AG 그리드 함수
  const [removeNtc, setRemoveNtc] = useState([]); // 선택한 데이터를 배열로 모아 삭제

  const [delMutation] = useMutation(NTC_DEL, { // 선택한 데이터 삭제
    variables: {
      notice: { NTC_IDS: removeNtc },
      ver: 'v1'
    }
  });
  const { refetch } = useQuery(NTC_DATA, {  // 데이터 삭제시 그리드 테이블 리프레쉬
    returnPartialData: true,
    variables: { param, ver: 'v1' }
  });
  

  useEffect(() => {
    if (selClear) { //조회시 선택된 셀 전부 해제
      gridApi.deselectAll();
    }
    if(selFocus.flag ===true){ // 데이터 수정 완료후 수정된 데이터 포커싱
      gridApi.forEachNode((node)=>node.setSelected(node.data.NTC_ID === selFocus.id)) 
    }
    if(subMitFlag.addFlag ===true){ // 신규 클릭시 선택된 셀 전부 해제
      gridApi.deselectAll();
    }
    
  }, [selClear,selFocus,subMitFlag,dispatch, gridData,gridApi]);



/**
 * 그리드 데이터 선택 함수.
 * 디스패치 실행시켜 Detail컴포넌트에게 클릭한 데이터를 보냄
 * @param {object} ev 데이터 선택시 해당 공지사항 데이터를 받아옴.
 */
  const onRowClickd = ev => {  tableSelectDispatch(ev,dispatch) };
  
/**
 * onRowClickd함수에서 ChackBox클릭시 row 데이터를 받아오지 못하는 오류가 발생.
 * 그래서 row선택이 되면 전체를 인지하고 데이터를 받아올수있는 함수추가.
 * 이함수는 다수의 데이터를 클릭하여 삭제하는 이벤트와 수정시 해당 데이터를 포커싱하는 이벤트을 담당
 * @param {object} ev 선택된 데이터의 데이터 값
 */
  const onRowSelected=(ev)=>{
    if(selFocus.flag ===true){
      dispatch({ //저장시 selFocus값 true되어 해당 데이터를 디테일컴포넌트로 넘김
        type: 'NTC_DETAIL',
        ntcDetail: ev.data
      });
      dispatch({  //디테일 컴포넌트에서 저장시 재사용을 위해 false로 리셋시킴
        type: 'SEL_FOCUS_RESET',
      });
    }
    const clickNtcData = gridApi.getSelectedRows().map(data => data.NTC_ID);
    setRemoveNtc(clickNtcData);
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
              tableRemoveDispatch(dispatch) //삭제시 필요한 디스패치를 모아둔 함수 
             const result = await delMutation();
            console.log(result)
             if(result.data.delNotice.rsltCd==="OK"){
               toast.success("정상적으로 삭제 되었습니다.")
             }else{
              toast.error("다시 시도해주세요.")
             }
            } catch (error) {
              console.log(error);
            }
            refetch()
          }
        },
        {
          label: '아니요'
        }
      ]
    });
  };

  /**
 * Ag 그리드 함수 사용시 필요함 
 */
  function onGridReady(params) {
    setGridApi(params.api);
  }

  const defaultColDef = {
    //테이블 기본 옵션
    sortable: true,
    filter: true,
    resizable: true,
    width: 198,
    localeText: { noRowsToShow: '조회 결과가 없습니다.' }
  };

  return (
    <>
      <Card >
        {/* TopBar 박스 */}
        <Box className={classes.TopBarBox}>
          <div>
            <h3>
              총
              {gridData?.length > 0 ? (
                <span>{gridData?.length}</span>
              ) : (
                <span>0</span>
              )}
              건
            </h3>
          </div>
          <div>
              <Button
              className={classes.button}
                onClick={onRemove}
                type="submit"
                variant="contained"
                color="primary"
                disabled={removeNtc.length > 0 ? false :true}
              >
                삭제
              </Button>
           
          </div>
        </Box>
        {/* TopBar 박스 */}

        {/* Ag그리드 박스 */}
        <Box >
          <div
            className="ag-theme-alpine"
            style={{ position: 'relative', height: '400px', width: '100%' }}
          >
            <AgGridReact
            headerHeight={35}
              onRowClicked={onRowClickd}
              onRowSelected={onRowSelected}
              onGridReady={onGridReady}
              rowSelection="multiple"
              rowData={gridData}
              defaultColDef={defaultColDef}
              localeText={{ noRowsToShow: '조회 결과가 없습니다.' }}
              columnDefs={FAQCloumns}
              pagination={true}
              paginationPageSize={10}
              gridOptions={{ rowHeight: 30 }}
            />
          </div>
        </Box>
        {/* Ag그리드 박스 */}
      </Card>
    </>
  );
};

FAQTable.propTypes = {
  className: PropTypes.string
};

export default React.memo(FAQTable);



