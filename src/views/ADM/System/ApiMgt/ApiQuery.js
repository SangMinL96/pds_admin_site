import { gql } from 'apollo-boost';

export const GET_API = gql`
  query getApi($param: ApiQParam, $ver: String!) {
    getApi(param: $param, ver: $ver) {
        API_ID
        API_NM
        API_DESC
        API_VER
        MDLE_CD
        MDLE_NM
        API_EPT_PTH
        FUNC_CD
      }
  }
`;

export const MDLE_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "MDLE_CD", ver: "v1") {
      COM_CD_GRP_ID
      COM_CD
      COM_CD_NM
      COM_CD_DESC
      COM_CD_VAL
      COM_CD_SEQ
    }
  }
`;
export const ADD_API = gql`
  mutation saveApi($ver: String!, $param: ApiInput) {
    saveApi(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDI_API = gql`
  mutation saveApi($ver: String!, $param: ApiInput) {
    saveApi(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_API = gql`
  mutation delApi($ver: String!, $param: ApiInput) {
    delApi(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
