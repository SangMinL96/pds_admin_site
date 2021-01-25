import { gql } from 'apollo-boost';

export const GET_MACHINE_STT_DATA = gql`
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
export const GET_MACHINE_STT_ITM_DATA = gql`
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


export const SVC_CD_DATA = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;
export const MCN_MDL_CD_DATA = gql`
  {
    getCode(COM_CD_GRP_ID: "MCN_MDL_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;



export const ADD_MCN_STT = gql`
  mutation saveMachineSetting($ver: String!, $param: MachineSettingInput) {
    saveMachineSetting(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;
export const EDIT_MCN_STT = gql`
  mutation saveMachineSetting($ver: String!, $param: MachineSettingInput) {
    saveMachineSetting(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;
export const DEL_MCN_STT = gql`
  mutation delMachineSetting($ver: String!, $param: MachineSettingInput) {
    delMachineSetting(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;
export const ADD_MCN_STT_ITM = gql`
  mutation saveMachineSettingItem($ver: String!, $param: MachineSettingItemInput) {
    saveMachineSettingItem(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;
export const EDIT_MCN_STT_ITM = gql`
  mutation saveMachineSettingItem($ver: String!, $param: MachineSettingItemInput) {
    saveMachineSettingItem(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;
export const DEL_MCN_STT_ITM = gql`
  mutation delMachineSettingItem($ver: String!, $param: MachineSettingItemInput) {
    delMachineSettingItem(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;

