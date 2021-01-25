import { gql } from 'apollo-boost';

export const GET_PGM_DL_DATA = gql`
  query getMachinePgmDlHistory($param: MachineQParam!, $ver: String!) {
    getMachinePgmDlHistory(param: $param, ver: $ver) {
      RET_LIST{
        SVC_CD
        SVC_NM
        MCN_MDL_CD
        MCN_MDL_NM
        NAT_ID
        NAT_NM
        SW_TP_CD
        SW_TP_NM
        MAC_ADDR
        SW_MJR_VER
        SW_MNR_VER
        SW_BLD_VER
        SW_DL_ST_CD
        SW_DL_ST_NM
        DL_DT
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

export const SW_DL_ST_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "SW_DL_ST_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;


