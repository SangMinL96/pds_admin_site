import { gql } from 'apollo-boost';

export const ADMIN_USER = gql`
  query getUser($param: UserQParam, $ver: String!) {
    getUser(param: $param, ver: $ver) {
      USR_ID
      USR_NM
      PWD_EXP_DT
      EML
      HP
      USR_TP_CD
      USR_TP_NM
      BLN_NM
      AUTH_TP_NM
      AUTR_ID_LIST
      AUTR_NM_LIST
    }
  }
`;


export const AUTH_USER = gql`
  query getAuthorization($param: AuthorizationQParam, $ver: String!) {
    getAuthorization(param: $param, ver: $ver) {
      AUTR_ID
      AUTR_NM
      AUTR_DESC
    }
  }
`;

export const USR_TP_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "USR_TP_CD", ver: "v1") {
      COM_CD_GRP_ID
      COM_CD
      COM_CD_NM
      COM_CD_DESC
      COM_CD_VAL
      COM_CD_SEQ
    }
  }
`;

export const EDIT_USER = gql`
  mutation modifyUser($ver: String!, $param: UserInput) {
    modifyUser(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const ADD_USER = gql`
  mutation addUser($ver: String!, $param: UserInput) {
    addUser(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_USER = gql`
  mutation delUser($ver: String!, $param: UserInput) {
    delUser(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const PWD_RESET = gql`
  mutation resetPwd($ver: String!, $USR_ID: String!) {
    resetPwd(ver: $ver, USR_ID: $USR_ID) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;