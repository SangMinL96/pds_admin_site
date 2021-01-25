import { gql } from 'apollo-boost';

export const GET_GME_BOK_DATA = gql`
  query getBookGame($param: BookGameQParam, $ver: String!) {
    getBookGame(param: $param, ver: $ver) {
   RET_LIST{
      BOK_DAT_ID
      
      }   
    }
  }
`;
export const GET_SHOP = gql`
  query getShop($param: ShopQParam, $ver: String!) {
    getShop(param: $param, ver: $ver) {
      SHP_ID
      SHP_NM
    }
  }
`;
export const GET_MCN_STS_ERR_DATA = gql`
  query getMachineError($MAC_ADDR: String!, $ver: String!) {
    getMachineError(MAC_ADDR: $MAC_ADDR, ver: $ver) {
      ERR_OCCR_DT
      MCN_ST_NM
      MCN_ERR_CONT
      LOG_FL_ID
      
      
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
export const GET_AREA = gql`
  query getArea($param: AreaQParam!, $ver: String!) {
    getArea(param: $param, ver: $ver) {
      AREA_ID
      AREA_NM
      AREA_TP_CD
    }
  }
`;
export const SVC_CD_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;
export const MCN_MDL_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "MCN_MDL_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;
export const MCN_ST_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "MCN_ST_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const HANDLE_RSSH = gql`
  mutation handleSSHPort($ver: String!, $param: MachineSSHInput) {
    handleSSHPort(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;