
export const treeHandle = (NAT_CD,STT_CD)=>{
    if (NAT_CD === null) {
      return [NAT_CD].concat(STT_CD.split(','));
    } else if (STT_CD === null) {
      return NAT_CD.split(',').concat([STT_CD]);
    } else if (STT_CD === null && NAT_CD===null) {
      return [NAT_CD].concat([STT_CD]);
    } else  {
     return NAT_CD.split(',').concat(STT_CD.split(','));
    }
  }
  export const param = {SVC_CD_LST:"",NTC_NM:"",REG_DT:"", NAT_CD:"",STT_CD:""};

  export const searchSubmitDispatch= (dispatch)=>{
    dispatch({ //조회시 그리드 셀 선택을 초기화.
        type: 'SEL_CLEAR'
      });
      setTimeout( //셀 선택 초기화 재사용을 위해 리듀서 selClear값을 false로 돌려놓음
        dispatch({
          type: 'SEL_CLEAR_FALSE'
        }),
        300
      );
      dispatch({ // 조회시 디테일 컴포넌트의 addFlag,editFlag 상태를 
        type: 'SUBMET_RESET'
      });
      dispatch({
        type: 'DROP_FILE_RESET',
      });
      dispatch({
        type: 'NTC_DETAIL_RESET',
      });
  }
  export const tableSelectDispatch=(ev,dispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
      dispatch({
        type: 'NTC_DETAIL',
        ntcDetail: ev.data
      });
      dispatch({
        type: 'READ_ONLY'
      });
      //클릭한 유저 아이디를 배열로 저장
      dispatch({
        type: 'DROP_FILE_RESET',
      });
  }
  export const tableRemoveDispatch=(dispatch)=>{
    dispatch({
        type: 'SUBMET_RESET',
      });
    dispatch({
        type: 'NTC_DETAIL_RESET'
      });
      dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'DROP_FILE_RESET',
      });
  }



  export const detailSubmitDispatch=(reset,dispatch,id)=>{
    dispatch({
        type: 'READ_ONLY'
      });
      dispatch({
        type: 'NTC_DETAIL_RESET',
      });
      dispatch({
        type: 'SUBMET_RESET'
      });
      dispatch({
        type: 'DROP_FILE_RESET',
      });
      dispatch({
        type: 'SEL_FOCUS',
        selFocusId:id
      });
      reset();
  }


  export const editHandler=(data,formData)=>{
    const detailData = {
      NTC_NM:data?.NTC_NM,
      NAT_CD_LST:data?.NAT_CD_LST,
      STT_CD_LST:data?.STT_CD_LST,
      SVC_CD_LST:data?.SVC_CD_LST,
      NTC_CONT:data?.NTC_CONT,
      NTC_ID:data?.NTC_ID,
      FIX_YN:data?.FIX_YN,}
    const postFormData = formData
  
    return JSON.stringify(detailData)=== JSON.stringify(postFormData)
  }