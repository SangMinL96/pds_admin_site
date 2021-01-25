
import React, {  useEffect, useState } from 'react';
import {Sync,SyncDisabled} from '@material-ui/icons';
import { GET_MCN_STS_DATA } from '../McnStsQuery';
import { useQuery } from '@apollo/react-hooks';
import { toast } from 'react-toastify';


function RsshBtn(props){

const [portState,setPortState]=useState(false)
  const { data: LOAD_MCN_STS_DATA} = useQuery(GET_MCN_STS_DATA, { 
    variables: { param:{}, ver:"v1"}, 
    fetchPolicy: 'network-only',
  })

 const  startClickedHandler=()=> {
   if(portState){
     toast.error("이미 RSSH 연결중인 머신이 존재합니다.")
   }else{
    const mac = props.data.MAC_ADDR
    const svcCd = props.data.SVC_CD
    const status = props.data.SSH_PORT ==="0"? "OFF":"ON"
    props.clicked(mac,svcCd,status);
  }
 }
 
 const  stopClickedHandler=async()=> {
  const mac = props.data.MAC_ADDR
  const svcCd = props.data.SVC_CD
  const status = props.data.SSH_PORT ==="0"? "OFF":"ON"
   props.clicked(mac,svcCd,status);
  
}

useEffect(()=>{
if(LOAD_MCN_STS_DATA?.getMachineStatus?.RET_LIST?.some(item=>item.SSH_PORT !== "0")){
  setPortState(true)
}

},[LOAD_MCN_STS_DATA])

 return (
  <>
  
  {props?.data?.SSH_PORT ==="0" ?  <Sync style={{cursor:"pointer",fontSize:"1.6rem",marginTop:"5px"}} onClick={startClickedHandler}/>: 
        <SyncDisabled style={{cursor:"pointer",fontSize:"1.6rem",marginTop:"5px"}} onClick={stopClickedHandler}/> }
  </>
);
}

export default React.memo(RsshBtn);

