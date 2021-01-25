import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
 
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
  Badge
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '200px'
  },
  dateBox: theme.dateBoxStyle,
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  },
  badge: {
    position:"absolute",
    top:"-10px",
    '& > *': {
      margin: theme.spacing(2),
    },
  },
}));

const ErrorCount = ({ className, ...rest }) => {
  const classes = useStyles();
  const badgeProps = {
    color: 'error',
    
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
              에러 건수  <span className={classes.badge}><Badge badgeContent={99} {...badgeProps} /></span>
            </Typography>
           
            <Typography
              color="textPrimary"
              variant="h4"
              
            >
              0건
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

ErrorCount.propTypes = {
  className: PropTypes.string
};

export default ErrorCount;
