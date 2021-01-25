import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {

  Box,
  Card,
  CardContent,
  Grid,

  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import { MdAddCircleOutline } from "react-icons/md";

const useStyles = makeStyles((theme) => ({
  root: {
    height: '200px',
    '& > span': {
        margin: theme.spacing(2),
      },
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  }
}));

const TasksProgress = ({ className, ...rest }) => {
  const classes = useStyles();

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
              color="textSecondary"
              gutterBottom
              variant="h4"
            >
              공지사항
            </Typography>
          <Box style={{width:"500px",height:"120px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
              <li>
                  공지사항 11111111111111111111
              </li>
              <li>
                  공지사항 3333333333333333
              </li>
              <li>
                  공지사항 3333333333333333
              </li>
          </Box>
          </Grid>
          <Grid style={{fontSize:"0.9rem", fontWeight:"600"}} item>
          <MdAddCircleOutline /> 더보기
          </Grid>
        </Grid>
    
      </CardContent>
    </Card>
  );
};

TasksProgress.propTypes = {
  className: PropTypes.string
};

export default TasksProgress;