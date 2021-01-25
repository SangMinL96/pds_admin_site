import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  dateBoxStyle: {
      width:"110px",
      borderRadius:"50px",
      height:"35px",
      backgroundColor:"#74b9ff",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      flexDirection:"column",
      fontSize:"0.85rem",
      color:"white",
      fontWeight:"600"
    },
    searchBtn:{
      width: '105px', 
      marginRight: '0.7em', 
      height:"34px"
    },
    tableBtn:{
      width: '100px', 
      marginRight: '1.5em',
      height:"30px",
      background:"red"
    },
    detailBtn:{
      width: '100px',
      marginLeft: '0.5em',
      marginRight: '0.5em'
    },
    tableText:{
      '& div' :{
        fontSize: "1.05rem",
        fontWeight: "600",
      },
      '& h3':{
        fontSize: "1.02rem",
        fontWeight: "600",
        marginLeft: "1.1em",
        '& span': {
          marginLeft: "5px",
        }
      }
    }  ,
    detailTitle:{
     
      fontSize: '1.2rem',
        color: '#2c3e50',
        marginLeft: '1em',
        marginTop: '0.5em'
    },
  palette: {
    background: {
      dark: '#F4F6F8',
      default: colors.common.white,
      paper: colors.common.white
    },
    primary: {
      main: colors.indigo[500]
    },
    secondary: {
      main: colors.indigo[500]
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600]
    }
  },
  shadows,
  typography
});

export default theme;
