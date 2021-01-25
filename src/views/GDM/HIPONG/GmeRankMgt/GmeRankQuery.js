import { gql } from 'apollo-boost';

export const GET_GME_RANK_DATA = gql`
  query getGameRank($param: BookRankQParam, $ver: String!) {
    getGameRank(param: $param, ver: $ver) {
     SVC_CD
     SVC_NM
     USR_ID
     USR_NM
     TOT_SCRE_VAL
     TOT_CCR_VAL
     TOT_SAR_VAL
     TOT_HCT_VAL
     TOT_WIN_VAL
     TOT_LOSE_VAL
     TOT_PLY_CNT
     RANK
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
export const SVC_CD_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
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