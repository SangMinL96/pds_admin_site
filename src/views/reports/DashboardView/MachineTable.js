import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  
  Box,
  Card,
  CardContent,
  Grid,
  
  Typography,
  makeStyles,
  colors,
  Badge
} from '@material-ui/core';

import { DataGrid } from '@material-ui/data-grid';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '200px'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  },
    badge: {
    position:"absolute",
    top:"0px",
    '& > *': {
      margin: theme.spacing(2),
    },
  },
}));
const columns = [
  { field: 'AUTH_TP_CD', headerName: '지역', width: 100 },
  { field: 'AUTH_USR_ID', headerName: '모델명', width: 170 },
  { field: 'ATV_YN', headerName: '대수', width: 110 }
];
const MachineTable = ({ className, ...rest }) => {
  const classes = useStyles();
    const [row] = useState([]); 
    const badgeProps = {
    color: 'secondary',
  
  };
    // const { detailTableData: USR_ID } = useDataState();
    // const [getTable, { data: tableData }] = useLazyQuery(GET_USER_AUTH);
  
    // useEffect(() => {
    //   if (USR_ID !== undefined) {
    //     getTable({ variables: { USR_ID, ver: 'v1' } });
    //   }
    //   if (tableData !== undefined) {
    //     setRow(tableData?.getUserAuth);
    //   }
    // }, [USR_ID, getTable, tableData]);
 
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid style={{position:"relative",}} item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h5"
            >
              지역별 머신 설치 현황  <span className={classes.badge}><Badge badgeContent={99} {...badgeProps} /></span>
            </Typography>
           
          </Grid>
          <Grid item>
            국가 선택
          </Grid>
        </Grid>
        <Box  style={{ height: 150, width: '100%' }}>
        <DataGrid
          rows={row && row}
          columns={columns}
          headerHeight={30}
          rowHeight={30}
          hideFooter={true}
       />
      </Box>
      </CardContent>
    </Card>
  );
};

MachineTable.propTypes = {
  className: PropTypes.string
};

export default MachineTable;
