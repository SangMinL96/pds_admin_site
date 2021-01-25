import { gql } from 'apollo-boost';

export const GET_MCN_STS_DATA = gql`
  query getMachineStatus($param: MachineQParam, $ver: String!) {
    getMachineStatus(param: $param, ver: $ver) {
      RET_LIST{ 
        SVC_CD
        SVC_NM
        MCN_RPT_DT
        ERR_OCCR_DT
        MCN_ID
        MCN_MDL_CD
        MCN_MDL_NM
        MCN_SR_NO
        MAC_ADDR
        MCN_MDL_NO
        SHP_NM
        MCN_MDL_DESC
        DLR_NM
        NAT_NM
        STE_NM
        CTY_NM
        SHP_CTG_NM
        MCN_ST_NM
        MCN_RPT_DT
        SSH_PORT
        }
      
      
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