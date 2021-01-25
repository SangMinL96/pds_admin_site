import { gql } from 'apollo-boost';

export const GET_MULTILANG = gql`
  query getMlang($param: MlangQParam!, $ver: String!) {
    getMlang(param: $param, ver: $ver) {
      MLANG_MSG_ID
      MLANG_MSG_TP_CD
      MLANG_MSG_TP_NM
      MLANG_MSG_NM
      MSG_CONT
      LOCALE_CD
      LOCALE_NM
      SVC_CD
      SVC_NM
      REG_DT
      UPD_DT
      REG_ID
      UPD_ID
    }
  }
`;

export const GET_MULTILANGMSG = gql`
  query getMlangMsg($param: MlangQParam!, $ver: String!) {
    getMlangMsg(param: $param, ver: $ver) {
      MLANG_MSG_ID
      MLANG_MSG_TP_CD
      MLANG_MSG_TP_NM
      MLANG_MSG_NM
      MSG_CONT
      LOCALE_CD
      LOCALE_NM
      SVC_CD
      SVC_NM
      REG_DT
      UPD_DT
      REG_ID
      UPD_ID
    }
  }
`;

export const GET_LOCALE_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "LOCALE_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const GET_SVC_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const GET_MLANG_MSG_TP_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "MLANG_MSG_TP_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const DEL_MULTILANG = gql`
  mutation delMlang($ver: String!, $param: MlangInput!) {
    delMlang(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;

export const SAVE_MULTILANG = gql`
  mutation saveMlang($ver: String!, $param: MlangInput!) {
    saveMlang(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_MULTILANGMSG = gql`
  mutation delMlangMsg($ver: String!, $param: MlangInput!) {
    delMlangMsg(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;

export const SAVE_MULTILANGMSG = gql`
  mutation saveMlangMsg($ver: String!, $param: MlangInput!) {
    saveMlangMsg(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
