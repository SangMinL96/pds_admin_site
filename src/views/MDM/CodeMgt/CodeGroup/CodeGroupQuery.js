import { gql } from 'apollo-boost';

export const GET_CODE_DATA = gql`
  query getCodeGrp($param: CodeGrpQParam, $ver: String!) {
    getCodeGrp(param: $param, ver: $ver) {
      COM_CD_GRP_ID
      COM_CD_GRP_NM
      COM_CD_GRP_DESC
     
    }
  }
`;
export const ADD_CODE_GRP = gql`
  mutation saveCodeGrp($ver: String!, $param: CodeGrpInput) {
    saveCodeGrp(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_CODE_GRP = gql`
    mutation saveCodeGrp($ver: String!, $param: CodeGrpInput) {
    saveCodeGrp(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const DEL_CODE_GRP = gql`
  mutation delCodeGrp($ver: String!, $param: CodeGrpInput) {
    delCodeGrp(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;