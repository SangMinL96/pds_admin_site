import { gql } from 'apollo-boost';

export const GET_COUNTY_DATA = gql`
  query getArea($param: AreaQParam!, $ver: String!) {
    getArea(param: $param, ver: $ver) {
       AREA_ID
       AREA_NM
       AREA_TP_CD
       UPR_AREA_ID
       CTNT_CD
       CTNT_NM
       REG_DT
    }
  }
`;
export const ADD_COUNTY = gql`
  mutation saveArea($ver: String!, $param: AreaInput) {
    saveArea(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const EDIT_COUNTY = gql`
  mutation saveArea($ver: String!, $param: AreaInput) {
    saveArea(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
    }
  }
`;
export const DEL_COUNTY = gql`
  mutation delArea($ver: String!, $param: AreaInput) {
    delArea(ver: $ver, param: $param) {
      rsltCd
      errCd
      rsltCont
      
    }
  }
`;