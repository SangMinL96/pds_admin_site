import { gql } from '@apollo/client';
export const SVC_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;
export const MDLE_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "MDLE_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const GET_MENU_DATA = gql`
  query getMenu($ver: String!, $param: MenuQParam) {
    getMenu(ver: $ver, param: $param) {
      MNU_ID
      MNU_NM
      MDLE_CD
      MDLE_NM
      SCRN_ID
      LVL
      UPR_MNU_ID
      SHOW_YN
      SVC_CD
      SVC_NM
      ICO_PTH
      MNU_SEQ
      DAT_CD
      REG_DT
      UPD_DT
      REG_ID
      UPD_ID
    }
  }
`;

export const ADD_MENU = gql`
  mutation saveMenu($ver: String!, $param: MenuInput) {
    saveMenu(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_MENU = gql`
  mutation saveMenu($ver: String!, $param: MenuInput) {
    saveMenu(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_MENU = gql`
  mutation delMenu($ver: String!, $param: MenuInput) {
    delMenu(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
