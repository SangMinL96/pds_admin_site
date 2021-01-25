import { gql } from 'apollo-boost';

export const GET_DEALER_DATA = gql`
  query getDealerTree($param: DealerQParam, $ver: String!) {
    getDealerTree(param: $param, ver: $ver) {
      DLR_ID
      USR_NM
      HP
      EML
      DLR_TP_CD
      DLR_TP_NM
      NAT_ID
      NAT_NM
      STE_ID
      STE_NM
      CTY_ID
      CTY_NM
      UPR_DLR_ID
      PATH
    }
  }
`;
export const GET_ALL_DLR_DATA = gql`
  query getDealer($param: DealerQParam, $ver: String!) {
    getDealer(param: $param, ver: $ver) {
      DLR_ID
      
    }
  }
`;

export const DLR_TP_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "DLR_TP_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const GET_AREA = gql`
  query getArea($param: AreaQParam!, $ver: String!) {
    getArea(param: $param, ver: $ver) {
      AREA_ID
      AREA_NM
      AREA_TP_CD
      UPR_AREA_ID
      CTNT_CD
      CTNT_NM
    }
  }
`;

export const GET_UPR_AREA = gql`
  query getArea($param: AreaQParam!, $ver: String!) {
    getArea(param: $param, ver: $ver) {
      AREA_ID
      AREA_NM
      AREA_TP_CD
      UPR_AREA_ID
      CTNT_CD
      CTNT_NM
    }
  }
`;

export const GET_AREA_TREE = gql`
  query getAreaTree($AREA_NM: String!, $ver: String!) {
    getAreaTree(AREA_NM: $AREA_NM, ver: $ver) {
      id
      name
      AREA_TP_CD
      children {
        id
        name
        AREA_TP_CD
        children {
          id
          name
          AREA_TP_CD
        }
      }
    }
  }
`;

export const USER_DATA = gql`
  query getUser($param: UserQParam, $ver: String!) {
    getUser(param: $param, ver: $ver) {
      USR_ID
      USR_NM
    }
  }
`;
export const ADD_DLR = gql`
  mutation saveDealer($ver: String!, $param: DealerInput) {
    saveDealer(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_DLR = gql`
  mutation saveDealer($ver: String!, $param: DealerInput) {
    saveDealer(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_DLR = gql`
  mutation delDealer($ver: String!, $param: DealerInput) {
    delDealer(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;
