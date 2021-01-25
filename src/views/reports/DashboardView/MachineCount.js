import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {

  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors,
  Badge,
  Box
} from '@material-ui/core';
import { ArrowDownwardIcon } from '@material-ui/data-grid';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '200px'
  },
  dateBox: theme.dateBoxStyle,
  badge: {
     position:"absolute",
     top:"-10px",
     '& > *': {
       margin: theme.spacing(2),
     },
   },differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  },
}));

const MachineCount = ({ className, ...rest }) => {
  const classes = useStyles();

  const badgeProps = {
     color: 'secondary',
     
   };
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
          <Grid item>
            
            <Typography
              gutterBottom
              variant="h4"
              style={{position:"relative",}}
            >
              가동 머신 수  <span className={classes.badge}><Badge badgeContent={99} {...badgeProps} /></span>
            </Typography>
           
            <Typography
              color="textPrimary"
              variant="h4"
              
            >
              3000대
            </Typography>
          </Grid>
          <Grid item>
            <Box className={classes.dateBox}>
              <div>20.08.20</div>
              <div>11:00</div>
            </Box>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          <ArrowDownwardIcon className={classes.differenceIcon} />
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            12%
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            전주 대비
          </Typography>
        </Box>
      
      </CardContent>
    </Card>
  );
};

MachineCount.propTypes = {
  className: PropTypes.string
};

export default MachineCount;
