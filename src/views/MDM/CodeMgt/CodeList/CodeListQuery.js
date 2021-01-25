import { gql } from 'apollo-boost';

export const GET_CD_DATA = gql`
  query getCode($COM_CD_GRP_ID: String!, $ver: String!) {
    getCode(COM_CD_GRP_ID: $COM_CD_GRP_ID, ver: $ver) {
      COM_CD_GRP_ID
      COM_CD
      COM_CD_NM
      COM_CD_DESC
      COM_CD_VAL
      COM_CD_SEQ
      UPR_COM_CD
    }
  }
`;
export const ADD_CD_LIST = gql`
  mutation saveCode($ver: String!, $param: CodeInput) {
    saveCode(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_CD_LIST = gql`
 mutation saveCode($ver: String!, $param: CodeInput) {
    saveCode(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const DEL_CD_LIST = gql`
  mutation delCode($ver: String!, $param: CodeInput) {
    delCode(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;