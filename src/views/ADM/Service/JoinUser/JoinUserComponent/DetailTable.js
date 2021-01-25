import React from 'react';
import { DataGrid } from '@material-ui/data-grid';


const columns = [
  { field: 'AUTH_TP_CD', headerName: '인증유형', width: 100 },
  { field: 'AUTH_USR_ID', headerName: '인증아이디', width: 170 },
  { field: 'ATV_YN', headerName: '활성화상태', width: 110 }
];

export default function DetailTable({tableData}) {

  return (
    <div style={{ height: 155, width: '100%' }}>
      <DataGrid
        rows={ tableData?.getUserAuth?.map(item=>({id:item.AUTH_USR_ID, ...item}))||[]}
        columns={columns}
        headerHeight={40}
        rowHeight={30}
        hideFooter={true}
      />
    </div>
  );
}
