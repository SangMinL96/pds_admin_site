import { gql } from 'apollo-boost';

export const GET_SHOP = gql`
  query getShop($param: ShopQParam, $ver: String!) {
    getShop(param: $param, ver: $ver) {
      SHP_ID
      DLR_ID
      SHP_NM
      NAT_ID
      NAT_NM
      STE_ID
      STE_NM
      CTY_ID
      CTY_NM
      SHP_CTG_CD
      SHP_CTG_NM
      ZIP_CD
      SHP_ADDR
      SHP_ADDR_DTL
      REG_DT
      
    }
  }
`;

export const GET_DEALER_DATA = gql`
  query getDealerTree($param: DealerQParam, $ver: String!) {
    getDealerTree(param: $param, ver: $ver) {
      DLR_ID
      USR_NM
      DLR_TP_NM
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

export const SHP_CTG_CD_DATA = gql`
  {
    getCode(COM_CD_GRP_ID: "SHP_CTG_CD", ver: "v1") {
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

export const SHOP_DEL = gql`
  mutation delShop($ver: String!, $param: ShopInput) {
    delShop(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;

export const SHOP_ADD = gql`
  mutation saveShop($ver: String!, $param: ShopInput) {
    saveShop(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const SHOP_EDIT = gql`
  mutation saveShop($ver: String!, $param: ShopInput) {
    saveShop(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;