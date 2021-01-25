import React, {   useEffect,    useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Chip,
  useMediaQuery
} from '@material-ui/core';
import { useForm } from 'react-hook-form';
import MultiSelects from 'react-multi-select-component';
import {  toast } from 'react-toastify';
// import '../../../../../node_modules/react-toastify/dist/ReactToastify.css';
import { useDataDispatch, useDataState } from './FAQContext';
import {   DropzoneAreaBase } from 'material-ui-dropzone';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {  fileload, fileRemove, fileUpload, onFileAdd, serviceValue,disabledHandler,validate } from 'src/components/Utils';
// import DetailTree from './FAQComponent/DetailTree';
import { NTC_ADD,NTC_DATA,NTC_EDIT } from './FAQQuery';
import {  useMutation, useQuery } from '@apollo/react-hooks';
import {detailSubmitDispatch, editHandler, param} from "./FAQComponent/FAQUtils"
import {detailStyle} from "./FAQComponent/FAQStyle"
import styled from 'styled-components';
import CKEditor from "@ckeditor/ckeditor5-react"
import classicEditor from "@ckeditor/ckeditor5-build-classic"

function FAQDetail({ sve_code }) {
  const dispatch = useDataDispatch();
  const media = {
    w1691: useMediaQuery('(min-width:1691px)'),
    w1430 : useMediaQuery('(min-width:1430px)'),
    w800 : useMediaQuery('(min-width:800px)'),
    w525 :useMediaQuery('(min-width:525px)'),
  }
  const classes = detailStyle();
  const { ntcDetailData, inputReadOnly, treeData,dropFileData, subMitFlag } = useDataState();
  const { register, handleSubmit, errors, reset, setValue,getValues } = useForm(); // 인풋 폼 데이터 라이브러리
  const [postFormData, setPostFormData] = useState(); // 인풋값을 받아 NTC_ADD 뮤테이션 데이터
  const [selected, setSelected] = useState([]); //공지대상 서비스 유형 인풋값
  const [fixState, setFixState] = useState(); // 고정여부 참 거짓 인풋값
  const [editorData,setEditorData]=useState("") //editor Value 인풋값
  const [fileChips,setFileChips] = useState() // 데이터 첨부 파일 상태 
  const [addMutation] = useMutation(NTC_ADD, { //신규 추가 뮤테이션
    variables: {
      notice: postFormData,
      ver: 'v1'
    }
  });
  const [editMutation] = useMutation(NTC_EDIT, { //데이터 수정 뮤테이션
    variables: {
      notice: postFormData,
      ver: 'v1'
    }
  });
  const { refetch } = useQuery(NTC_DATA, { // 저장 submit 실행시 공지사항 데이터 리프레쉬 쿼리
    returnPartialData: true,
    variables: { param, ver: 'v1' }
  });

  useEffect(() => {
    if (ntcDetailData !== undefined) { // 테이블 컴포넌트에서 유저 데이터 받으면 해당 유저 데이터를 각 인풋 value 추가
      setValue('NTC_NM', ntcDetailData?.NTC_NM);
      setSelected(
        ntcDetailData?.SVC_CD_LST?.split(',').map(item => ({
          label: serviceValue(item),
          value: item
        }))||[]
      );
      setFixState(ntcDetailData?.FIX_YN === 'Y' ? true : false);
      setFileChips(ntcDetailData?.FL_ID_LST !== null ? ntcDetailData?.FL_ID_LST?.split(','):[])
      setEditorData(ntcDetailData?.NTC_CONT||"")
    }
  }, [ntcDetailData,setFixState,setValue]);
 
  const editorOnChange=(ev,editor)=>{
    const data =editor.getData()
    setEditorData(data)
  }
  /**
 * 신규 클릭시 디스패치 이용한 상태 변경 함수
 */
  const inputReset = () => { 
    dispatch({ //인풋 쓰기전용 적용
      type: 'READ_ONLY_FALSE'
    }); 
    dispatch({ // 저장시 신규 submit실행
      type: 'ADD_SUBMET'
    });
    dispatch({ //디테일 인풋값 리셋
      type: 'NTC_DETAIL_RESET',
    });
    dispatch({ 
      type: 'DROP_FILE_RESET',
    });
    
  
  };

 /**
 * 수정 클릭시 디스패치 이용한 상태 변경 함수
 */
  const editClick = () => {
    if (ntcDetailData?.NTC_ID !== undefined) {
      dispatch({ //인풋 쓰기전용 적용
        type: 'READ_ONLY_FALSE'
      }); 
      dispatch({ // 저장시 수정 submit실행
        type: 'EDIT_SUBMET'
      });
    } else {
      toast.error(`수정을 원하는 공지사항을 클릭해주세요.`);  
    }
  };
   
 /**
 * 리듀서의 subMitFlag 상태를 가져와서 저장 subMit 실행시 
 * submit Flag의 따라 실행되는 함수.
 * @param {object} data 인풋 데이터
 */
const onSubmit = async data => {
  let formData= { //subMit인풋 데이터 
    ...data,
   NAT_CD_LST:treeData !== undefined ? treeData?.NAT_CD_LST : ntcDetailData?.NAT_CD_LST,
   STT_CD_LST:treeData !== undefined ?treeData?.STT_CD_LST : ntcDetailData?.STT_CD_LST,
   SVC_CD_LST:selected?.map(item=>item.value).toString(),
   NTC_CONT:editorData,
   NTC_ID:subMitFlag?.editFlag===true ? ntcDetailData?.NTC_ID:undefined, 
   FIX_YN:fixState === true ? 'Y'  : fixState === false  ? 'N' : null,
 }
  setPostFormData(() =>({ //subMit인풋 데이터 
    ...data,
    ...formData,
   AUTR_ID_LST:"",
   GET_LAST_ROW:subMitFlag?.addFlag===true ? "Y":"N",
 }));
 
  if(String(editorData).length < 9){
    toast.error("공지사항 내용을 작성해주세요.")
  } else {
    if (subMitFlag?.addFlag === true) { //신규 subMit 실행 함수
      if(editorData === ""){
        toast.error("공지사항 내용을 추가해주세요.")
      }else{
      try {
        const result = await addMutation();
        console.log(result)
        if(result.data.saveNotice.rsltCd === "OK"){
          toast.success('성공적으로 추가 되었습니다.');
          fileUpload(dropFileData,result.data.saveNotice.rsltCont)
          detailSubmitDispatch(reset)
        }
        refetch()
      } catch (error) {
        console.log(error);
        dispatch({
          type: 'SUBMET_RESET'
        });
      }
    }
    }
    if (subMitFlag?.editFlag === true) { //수정 subMit 실행 함수
      if(editHandler(ntcDetailData,formData) === false){
        try {
          const result =await editMutation();
          console.log(result)
          if(result.data.saveNotice.rsltCd === "OK"){
            toast.success('성공적으로 수정 되었습니다.');
            detailSubmitDispatch(reset,dispatch,ntcDetailData?.NTC_ID)
            fileUpload(dropFileData,ntcDetailData?.NTC_ID)
          }
          refetch()
        } catch (error) {
          console.log(error);
          dispatch({
            type: 'SUBMET_RESET'
          });
        }
      }else{
        toast.error("수정한 내용이 전과 동일합니다.")
      }
    }
   
  }
};



  return (
    <>
      <Box>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={media.w525 ?classes.detailsHeader :null}>
              <h5 className={classes.detailsHeaderTitle}>공지사항 상세</h5>

              {/*  버튼 박스 */}
              <Box className={media.w525 ?classes.detailsBtnBox:classes.w525detailsBtnBox}>
             
                    <MultiSelect
                      options={
                        inputReadOnly ?  sve_code !== undefined
                          ?  sve_code?.getCode.map(item => ({
                              label: item.COM_CD_NM,
                              value: item.COM_CD
                            }))
                          : [] :[]
                      }
                      value={selected}
                      onChange={setSelected}
                      hasSelectAll={false}
                      disableSearch={true}
                      overrideStrings={{
                        selectSomeItems: (
                          <span style={{ color: '#546E7A' }}>질문 상세</span>
                        ),
                        allItemsAreSelected: sve_code?.getCode.map(
                          item => `${item.COM_CD_NM}, `
                        )
                      }}
                    />
                
                <Button
               
                  onClick={inputReset}
                  variant="contained"
                  color="primary"
                  disabled={ subMitFlag?.addFlag ===false ?false:true} 
                >
                  신규
                </Button>
                <Button 
                 style={{marginLeft:media.w525 ? "0.5em":"0.5em"}}
                  onClick={editClick} 
                  variant="contained" 
                  color="primary" 
                  disabled={disabledHandler(subMitFlag) ?false:true}>
                  수정
                </Button>
                <Button
                  style={{marginLeft:media.w525 ? "0.5em":"0.5em", backgroundColor: disabledHandler(subMitFlag) ?"#E0E0E0":"red" }}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={ disabledHandler(subMitFlag) ?true:false}
                >
                  저장
                </Button>
              </Box>
              {/*  버튼 박스 */}
            </Box>
            <CardContent className={media.w800 ? classes.inputCardContent :classes.w800inputCardContent} >
              {/* 디테일 인풋폼 그리드 컨테이너 */}
       
              <Box className={media.w800 ?classes.editorBox:classes.w800editorBox}>
             
               <Box className={media.w800 ?classes.editorLayout:null}>
               <CKEditor onInit={editor => {
                  editor.editing.view.change(writer => {
                    writer.setStyle(
                      "height",
                      "258px",
                      editor.editing.view.document.getRoot()
                    );
                  });}}  
                  editor={classicEditor} disabled={inputReadOnly ? false:true}   data={editorData} onChange={editorOnChange}/>
                  </Box>
     
              </Box>
              {/* 디테일 인풋폼 그리드 컨테이너 */}
            </CardContent>
          </form>
        </Card>
      </Box>
     
    </>
  );
}
FAQDetail.propTypes = {
  className: PropTypes.string
};

export default React.memo(FAQDetail);

const MultiSelect = styled(MultiSelects)`
   
    z-index: 99;
    
    left: 0;
    
    font-size:12px;
    width: 280px;
    
    /* @media only screen and (max-width: 1700px) {
    width: 275px;
    top:120px;
    } */
    
    
`;