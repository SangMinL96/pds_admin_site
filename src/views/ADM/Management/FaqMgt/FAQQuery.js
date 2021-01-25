import { gql } from 'apollo-boost';

export const NTC_DATA = gql`
  query getNotice($param: NoticeQParam, $ver: String!) {
    getNotice(param: $param, ver: $ver) {
      NTC_ID
      NTC_NM
      NTC_CONT
      FIX_YN ## 고정 여부
      UPD_DT ##수정일시
      AUTR_ID_LST ## 권한 id 리스트
      SVC_CD_LST ## 서비스코드
      SVC_NM_LST
      NAT_CD_LST ##국가 코드
      NAT_NM_LST
      STT_CD_LST ##시도 코드
      STT_NM_LST
      FL_CNT
      FL_ID_LST
      FL_NM_LST
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

export const GET_UPR_AREA = gql`
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
export const SVC_CD = gql`
  {
    getCode(COM_CD_GRP_ID: "SVC_CD", ver: "v1") {
      COM_CD
      COM_CD_NM
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
export const NTC_DEL = gql`
  mutation delNotice($ver: String!, $notice: NoticeInput) {
    delNotice(ver: $ver, notice: $notice) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;
export const NTC_ADD = gql`
  mutation saveNotice($ver: String!, $notice: NoticeInput) {
    saveNotice(ver: $ver, notice: $notice) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const NTC_EDIT = gql`
  mutation saveNotice($ver: String!, $notice: NoticeInput) {
    saveNotice(ver: $ver, notice: $notice) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;