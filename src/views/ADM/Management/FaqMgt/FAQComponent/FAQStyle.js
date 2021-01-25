const { makeStyles, useMediaQuery } = require("@material-ui/core");

export const searchStyle = makeStyles(theme => ({
    searchBox:{
      position: 'relative', 
      zIndex: 1,
    },
    searchCard:{
      padding: '0.8em' ,
      
      '& form':{
        justifyContent: 'space-between', 
        display: 'flex' 
      }
    },
    formBox:{
      width: '70%',
      marginRight:"5em",
     
    },
    formInputWidth:{
      width:"200px"
    },
    button:{
      width:"105px",
      height:"34px",
      marginRight:"0.7em"
    },
    w490searchCard:{
      padding: '0.8em' ,
      height:"100%",
      '& form':{
        
        
      }
    },
    w490button:{
      width:"100%",
      marginTop:"4em"
    }

  
    
  }))

 export const titleStyle = makeStyles(theme => ({
    button:{
    width: '100px', 
    marginRight: '1.75em',
 
 height:"30px"
  },
  TopBarBox:{
   display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    height:" 46px",
   
    backgroundColor: "#ffffff",
    border: "1px solid #babfc7",
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
  }
  }));

  export const detailStyle = makeStyles(props => (
    
    {
    detailsHeader: {
      display: 'flex',
      width: '100%',
      justifyContent: 'space-between'
    },
    detailsHeaderTitle: {
      fontSize: '1.2rem',
      color: '#2c3e50',
      marginLeft: '1em',
      marginTop: '0.5em'
    },
    detailsBtnBox: {
      position:"relative",
      width: '50%',
      marginTop: '0.5em',
      marginRight: '1.4em',
      display: 'flex',
      justifyContent: 'flex-end',
      '& Button': {
        width: '100px',
        marginLeft: '1em'
      }
    },
    inputCardContent: {
      display:'flex',
      width: '100%',
      position: 'relative',
      justifyContent: 'space-between'
    },
    checkBox: {
      width: '120px',
      marginLeft: '0.6em',
     
    },
    inputWidth: {
      width: '200px'
    },
   
  
    fileContainer:{
      width:"30%"
    },
    editorBox: {
      width:"75%",
      display:"flex",
     marginLeft:"1em",
      '& .MuiDropzoneArea-root':{
        width:"100%",
       minHeight:"100px",
       height:"15vh",
       overflowY:"auto",
       border: '1px solid #CCCCCC'
      }

    },
    editorLayout: {
      width: '70%',
      position: 'relative',
      marginRight:"1em",
      zIndex: 70
    },
  
    fileChipsCard:{
      overflowY:"auto",
      padding:"12px",
      
      marginTop:"0.5em",
      height:"155px",
      border: '1px solid #e3e3e3',
    },
    fileChipsBox:{
      display:"flex",
      justifyContent:"center"
    },
    Chips:{
      margin:"5px",
      width:"220px",
      justifyContent:"space-between"
    },
    
    TreeBox:{
      padding:"1em",
      height:"165px",
      marginTop:"5em",
      border: '1px solid #e3e3e3',
      overflowY:"auto",
      '& h3': {
        marginLeft: '1.2em'
      }
      
  
    },
    w800inputCardContent:{
      position: 'relative',
   
    },
    w800editorBox:{
      marginTop:"1em",
      width:"100%",
      '& .MuiDropzoneArea-root':{
        width:"100%",
       minHeight:"100px",
       height:"15vh",
       overflowY:"auto",
       border: '1px solid #CCCCCC'
      }
    },
    w800fileContainer:{
      marginTop:"1em",
    },
    w800editorContent:{
       height: '230px',
      padding: '5px',
      borderRadius: '3px',
      border: '1px solid #CCCCCC'
    },
    w800editorToolBar:{
     border: '1px solid #CCCCCC' 
    },
    w525detailsBtnBox:{
      position:"relative",
      marginLeft:"1em",
      marginTop:"1em"
    },
    w1691TreeBox:{
      padding:"1em",
      height:"125px",
      marginTop:"5em",
      border: '1px solid #e3e3e3',
      overflowY:"auto",
      '& h3': {
        marginLeft: '1.2em'
      }
    }
 
  }));