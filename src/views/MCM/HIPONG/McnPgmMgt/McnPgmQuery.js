import { gql } from 'apollo-boost';

export const GET_MCN_PGM_DATA = gql`
  query getMachinePgm($param: MachineQParam!, $ver: String!) {
    getMachinePgm(param: $param, ver: $ver) {
      SVC_CD
      SVC_NM
      MCN_MDL_CD
      MCN_MDL_NM
      NAT_ID
      NAT_NM
      MAN_SW_MJR_VER
      MAN_SW_MNR_VER
      MAN_SW_BLD_VER
      SUB_SW_MJR_VER
      SUB_SW_MNR_VER
      SUB_SW_BLD_VER
      MAN_SW_REV
      SUB_SW_REV
      MAN_SW_ATV_YN
      SUB_SW_ATV_YN
      MAN_MCN_SW_REPO_ID
      SUB_MCN_SW_REPO_ID
    }
  }
`;
export const MCN_SW_DATA = gql`
  query getMcnSwRepo($SVC_CD: String!, $ver: String!) {
    getMcnSwRepo(SVC_CD: $SVC_CD, ver: $ver) {
      MCN_SW_REPO_ID
      MCN_SW_REPO_NM
      SVN_PTH
      SVN_ID
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
export const GET_AREA = gql`
  query getArea($param: AreaQParam!, $ver: String!) {
    getArea(param: $param, ver: $ver) {
      AREA_ID
      AREA_NM

    }
  }
`;



export const ADD_MCN_PGM = gql`
  mutation saveMachinePgm($ver: String!, $param:MachinePgmInput) {
    saveMachinePgm(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_MCN_PGM = gql`
   mutation saveMachinePgm($ver: String!, $param: MachinePgmInput) {
    saveMachinePgm(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_MCN_PGM= gql`
  mutation delMachinePgm($ver: String!,$SVC_CD:String!,$MCN_MDL_CD:String!,$NAT_ID:String!) {
    delMachinePgm(ver: $ver,SVC_CD:$SVC_CD,MCN_MDL_CD:$MCN_MDL_CD,NAT_ID:$NAT_ID) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
