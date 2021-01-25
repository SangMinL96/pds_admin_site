import { gql } from 'apollo-boost';

export const JOIN_USER = gql`
  query getSvcUser($param: UserQParam, $ver: String!) {
    getSvcUser(param: $param, ver: $ver) {
      USR_ID
      USR_NM
      USR_TP_CD ## 사용자 유형 코드
      USE_SVC_CD_LST ##사용 서비스 코드 목록   (서비스)
      SVC_USE_TP_CD ##서비스 이용 유형 코드
      EML
      HP
      NIC_NM
      AUTH_TP_NM ## 인증 유형
      USR_ST_CD ## 상태 명
      HME_SHP_ID ##홈샵 아이디
      HME_SHP_NM ##홈샵 이름
      PRM_CRD ##프로모션 크레딧
      MBSHP_EXP_DT ##멤버쉽 만료 일시
      GME_CRD ##게임 크레딧
      PAID_EXP_DT ##유료 만료 일시
      PWD_EXP_DT ## 비번 만료 일시
      NAT_CD ##국가 코드
      LANG_CD ##언어 코드
      LST_LGN_DT ##최근 로그인 (마지막 로그인일시)
    }
  }
`;

export const SVC_USE_TP_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_USE_TP_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;

export const SVC_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
    }
  }
`;
export const GET_USER_AUTH = gql`
  query getUserAuth($USR_ID: String!, $ver: String!) {
    getUserAuth(USR_ID: $USR_ID, ver: $ver) {
      AUTH_TP_CD
      AUTH_USR_ID
      ATV_YN
    }
  }
`;
export const EDIT_JOIN_USER = gql`
  mutation modifyUser($ver: String!, $param: UserInput) {
    modifyUser(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const PWD_RESET = gql`
  mutation resetPwd($ver: String!, $USR_ID: String!) {
    resetPwd(ver: $ver, USR_ID: $USR_ID) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
