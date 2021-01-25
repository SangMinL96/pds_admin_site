import { gql } from 'apollo-boost';

export const MCN_SW_DATA = gql`
  query getMcnSwRepo($SVC_CD: String!, $ver: String!) {
    getMcnSwRepo(SVC_CD: $SVC_CD, ver: $ver) {
      MCN_SW_REPO_ID
      MCN_SW_REPO_NM
      SVC_CD
      SW_TP_CD
      SW_TP_NM
      SVN_PTH
      SVN_ID
      SVN_PWD
      SW_DESC
    }
  }
`;



export const SVC_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;
export const SW_TP_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "SW_TP_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const ADD_MCN_SW = gql`
  mutation saveMcnSwRepo($ver: String!, $param: McnSwRepoInput) {
    saveMcnSwRepo(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_MCN_SW = gql`
  mutation saveMcnSwRepo($ver: String!, $param: McnSwRepoInput) {
    saveMcnSwRepo(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const DEL_MCN_SW = gql`
  mutation delMcnSwRepo($ver: String!, $param: McnSwRepoInput) {
    delMcnSwRepo(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;