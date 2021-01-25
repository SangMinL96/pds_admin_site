import { gql } from 'apollo-boost';

export const GET_GAME_DATA = gql`
  query getGame($param: GameQParam, $ver: String!) {
    getGame(param: $param, ver: $ver) {
       GME_ID
       SVC_CD
       SVC_NM
       GME_CTG_CD
       GME_CTG_NM
       GME_NM
       GME_DESC
       GME_CRD
       GME_RND_VAL
       HNDI_YN
       MCN_MDL_CD_LST
      
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
export const GME_CTG_CODE = gql`
  {
    getCode(COM_CD_GRP_ID: "GME_CTG_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;


export const ADD_GAME = gql`
  mutation saveGame($ver: String!, $param: GameInput) {
    saveGame(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_GAME = gql`
   mutation saveGame($ver: String!, $param: GameInput) {
    saveGame(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;

export const DEL_GAME = gql`
  mutation delGame($ver: String!, $param: GameInput) {
    delGame(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;
