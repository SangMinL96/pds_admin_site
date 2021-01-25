import React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import JoinCount from './JoinCount';

import DashNotice from './DashNotice';
import Sales from './Sales';
import MachineTable from './MachineTable';
import MachineCount from './MachineCount';

import TrafficByDevice from './TrafficByDevice';
import ErrorCount from './ErrorCount';
import PlayCount from './PlayCount';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const Dashboard = () => {
  const classes = useStyles();
 
  return (
    <Page className={classes.root} title="Dashboard">
      <Container maxWidth={false}>
        <Grid container   spacing={3}>
          <Grid item  lg={3}   xs={12}>
            <JoinCount />
          </Grid>
          <Grid item lg={3}   xs={12}>
            <MachineCount />
          </Grid>
          <Grid item lg={3}   xs={12}>
            <ErrorCount />
            
          </Grid>
          <Grid item lg={3} xs={12}>
            <PlayCount />
          </Grid>
          <Grid item lg={6}   xs={12}>
            <DashNotice />
          </Grid>
          <Grid item lg={6}   xs={12}>
            <MachineTable />
          </Grid>
         
          <Grid item lg={8} xs={12}>
            <Sales />
          </Grid>
          <Grid item lg={4}xs={12}>
            <TrafficByDevice />
          </Grid>
         
        </Grid>
      </Container>
    </Page>
  );
};

export default Dashboard;
  