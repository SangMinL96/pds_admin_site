import React, { useReducer, createContext, useContext } from 'react';

const FAQState = {
  gridData: [],
  ntcDetailData: undefined,
  selClear: false,
  inputReadOnly: false,
  subMitFlag: {
    addFlag: false,
    editFlag: false
  },
  treeData: [],
  editorReset:false,
  dropFileData:[],
  selFocus:{
    id:undefined,
    flag:false,
  },
};

function Reducer(state, action) {
  switch (action.type) {
    case 'GET_GRID_DATA': //search 컴포넌트에서 데이터를 받아 디스패치후 useReducer 기본 state에 데이터를 넣음
      return { ...state, gridData: action?.gridData };
    case 'NTC_DETAIL_RESET': // 데이터 제거시 모든 인풋 Value를 리셋 시킴
      return {
        ...state,
        ntcDetailData: {
          NTC_ID:undefined,
          NAT_CD_LST:"",
          STT_CD_LST:"",
          SVC_NM_LST:[],
          NTC_CONT:null,
          FIX_YN:false
        }
      
      };
    case 'TREE_DATA':
      return { ...state, treeData: { ...action?.treeData } };
    case 'NTC_DETAIL': // 그리드 테이블의 클릭한 유저 데이터를 받아 디테일 인풋 Value에 값을 채워 넣음.
      return { ...state, ntcDetailData: { ...action?.ntcDetail } };
    case 'SEL_CLEAR': // 조회시 클릭 상태였던 셀을 초기화 시킴
      return { ...state, selClear: true};
    case 'SEL_CLEAR_FALSE': // SEL_CLEAR를 재사용하기 위해 값을 false로 미리 변경시켜놓음
      return { ...state, selClear: false};
    case 'READ_ONLY': // 모든 인풋을 읽기 전용으로 바꿈
      return { ...state, inputReadOnly: false };
    case 'READ_ONLY_FALSE': // 모든 인풋을 쓰기 전용으로 바꿈
      return { ...state, inputReadOnly: true };
    case 'ADD_SUBMET': // 초기화 버튼 클릭시 addFlag를 true값으로 바꾸어 Submit 실행시 유저 추가 함수가 실행 하도록함.
      return { ...state, subMitFlag: { addFlag: true, editFlag: false } };
    case 'EDIT_SUBMET': // 수정 버튼 클릭시 editFlag를 true값으로 바꾸어 Submit 실행시 유저 수정 함수가 실행 하도록함.
      return { ...state, subMitFlag: { editFlag: true, addFlag: false } };
    case 'SUBMET_RESET': // 조회 버튼 클릭시 모든 Flag를 false로 바꿈
      return { ...state, subMitFlag: { addFlag: false, editFlag: false } };
    case 'DROP_FILE':
      return  {...state, dropFileData:state.dropFileData.concat(action.dropFileAdd) }
    case 'DROP_FILE_REMOVE':
      return {...state, dropFileData: state?.dropFileData?.filter(file => file.id !==action.dropFile.id)};
    case "DROP_FILE_RESET":
      return  {...state, dropFileData:[]}
      case "SEL_FOCUS":
      return  {...state, selFocus:{id:action.selFocusId,flag:true}}
      case "SEL_FOCUS_RESET":
        return  {...state, selFocus:{id:undefined,flag:false}}
    default:
      throw new Error('Error');
  }
}

const StateContext = createContext();
const DispatchContext = createContext();

export function FAQContext({ children }) {
  const [state, dispatch] = useReducer(Reducer, FAQState);

  return (
    <StateContext.Provider
      value={{
        gridData: state?.gridData,
        ntcDetailData: state?.ntcDetailData,
        selClear: state?.selClear,
        inputReadOnly: state?.inputReadOnly,
        subMitFlag: state?.subMitFlag,
        treeData: state?.treeData,
        editorReset:state?.editorReset,
        dropFileData:state?.dropFileData,
        selFocus:state?.selFocus,
        editorData:state?.editorData
      }}
    >
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function useDataState() {
  return useContext(StateContext);
}
export function useDataDispatch() {
  return useContext(DispatchContext);
}
