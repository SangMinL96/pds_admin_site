import { gql } from 'apollo-boost';

export const GET_MCN_DATA = gql`
  query getMachine($param: MachineQParam, $ver: String!) {
    getMachine(param: $param, ver: $ver) {
     RET_LIST{
      SVC_CD
        SVC_NM
       MCN_ID
       MCN_MDL_CD
       MCN_MDL_NM
       MCN_SR_NO
       MAC_ADDR
       MCN_MDL_NO
       MCN_MDL_DESC
       W_SZ
       H_SZ
       D_SZ
       REG_DT
       UPD_DT
     }
    }
  }
`;

export const GET_MCN_PART_DATA = gql`
  query getMachinePart($MCN_ID: String!, $ver: String!) {
    getMachinePart(MCN_ID: $MCN_ID, ver: $ver) {
       MCN_ID
       PART_TP_CD
       PART_TP_NM
       PART_CD
       PART_NM
       PART_XCHG_DT
    }
  }
`;
export const GET_MCN_STT_DATA = gql`
  query getMachineSettingItemL($MCN_ID: String!, $ver: String!) {
    getMachineSettingItemL(MCN_ID: $MCN_ID, ver: $ver) {
       MCN_ID
       MCN_STTG_ITM_ID
       MCN_STTG_ITM_NM
       MCN_STTG_ITM_VAL
       MCN_LCL_UPD_YN
    }
  }
`;

export const GET_DTL_STT_DATA = gql`
  query getMachineSetting($param: MachineSettingQParam, $ver: String!) {
    getMachineSetting(param: $param, ver: $ver) {
      MCN_STTG_ID
      MCN_STTG_NM
      SVC_CD
      SVC_NM
      MCN_MDL_CD
      MCN_MDL_NM


    }
  }
`;


export const GET_DTL_STT_ITM_DATA = gql`
  query getMachineSettingItem($param: MachineSettingQParam, $ver: String!) {
    getMachineSettingItem(param: $param, ver: $ver) {
      MCN_STTG_ID
      MCN_STTG_ITM_ID
      MCN_STTG_ITM_NM
      MCN_STTG_ITM_VAL
      MCN_LCL_UPD_YN
    }
  }
`;

export const INIT_MCN_STT_ITM = gql`
  mutation initMachineSttgItemL($ver: String!, $param: InitMachineSttgItmInput) {
    initMachineSttgItemL(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const SVC_CD_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
      COM_CD_VAL
    }
  }
`;

export const PART_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "PART_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const PART_TP_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "PART_TP_CD", ver: "v1") {
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

export const ADD_MCN = gql`
  mutation saveMachine($ver: String!, $param: MachineInput) {
    saveMachine(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_MCN = gql`
  mutation saveMachine($ver: String!, $param: MachineInput) {
    saveMachine(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_MCN = gql`
 mutation delMachine($ver: String!, $param: MachineInput) {
  delMachine(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const ADD_MCN_PART = gql`
  mutation saveMachinePart($ver: String!, $param: MachinePartInput) {
    saveMachinePart(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_MCN_PART = gql`
  mutation saveMachinePart($ver: String!, $param: MachinePartInput) {
    saveMachinePart(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_MCN_PART = gql`
 mutation delMachinePart($ver: String!, $MCN_ID:String! ,$PART_TP_CD:String!,$PART_CD:String!) {
  delMachinePart(ver: $ver, MCN_ID:$MCN_ID ,PART_TP_CD:$PART_TP_CD,PART_CD:$PART_CD) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;


export const ADD_MCN_STT_ITM = gql`
  mutation saveMachineSttgItemL($ver: String!, $param: MachineSettingItemInput) {
    saveMachineSttgItemL(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_MCN_STT_ITM = gql`
  mutation saveMachineSttgItemL($ver: String!, $param: MachineSettingItemInput) {
    saveMachineSttgItemL(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_MCN_STT_ITM = gql`
 mutation delMachineSttgItemL($ver: String!, $MCN_ID:String! ,$MCN_STTG_ITM_ID:String!) {
  delMachineSttgItemL(ver: $ver, MCN_ID:$MCN_ID ,MCN_STTG_ITM_ID:$MCN_STTG_ITM_ID) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;


