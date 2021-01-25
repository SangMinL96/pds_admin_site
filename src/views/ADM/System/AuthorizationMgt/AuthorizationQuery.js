import { gql } from 'apollo-boost';

export const GET_AUTHORIZATION = gql`
  query getAuthorization($param: AuthorizationQParam, $ver: String!) {
    getAuthorization(param: $param, ver: $ver) {
      AUTR_ID
      AUTR_NM
      AUTR_DESC
      REG_DT
      UPD_DT
      REG_ID
      UPD_ID
    }
  }
`;

export const GET_AUTR_MENU = gql`
  query getAutrMenu($param: AuthorizationQParam, $ver: String!) {
    getAutrMenu(param: $param, ver: $ver) {
      AUTR_ID
      MNU_ID
    }
  }
`;

export const GET_AUTR_API = gql`
  query getAutrApi($param: AuthorizationQParam, $ver: String!) {
    getAutrApi(param: $param, ver: $ver) {
      AUTR_ID
      API_ID
    }
  }
`;


export const DEL_AUTHORIZATION = gql`
  mutation delAuthorization($ver: String!, $param: AuthorizationInput) {
    delAuthorization(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;

export const SAVE_AUTHORIZATION = gql`
  mutation saveAuthorization($ver: String!, $param: AuthorizationInput) {
    saveAuthorization(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const SAVE_AUTR_API = gql`
  mutation saveAutrApi($ver: String!, $param: AutrMenuApiInput) {
    saveAutrApi(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const SAVE_AUTR_MENU = gql`
  mutation saveAutrMenu($ver: String!, $param: AutrMenuApiInput) {
    saveAutrMenu(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;


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

export const GET_MENU = gql`
  query getMenuTree($ver: String!, $param: MenuQParam) {
    getMenuTree(ver: $ver, param: $param) {
      MNU_ID
      MNU_NM
      PATH
      MDLE_CD
      MDLE_NM
      SCRN_ID
      LVL
      UPR_MNU_ID
      SHOW_YN
      SVC_CD
      SVC_NM
      ICO_PTH
      DAT_CD
      REG_DT
      UPD_DT
      REG_ID
      UPD_ID
    }
  }
`;
