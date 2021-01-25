import React, { useState } from 'react'
import moment from 'moment'
import { Box, Chip, Container, Dialog, DialogContent, makeStyles } from '@material-ui/core'
import { fileload } from 'src/components/Utils'

const useStyles = makeStyles(theme => ({
  ntcContainer: {
    width: '100%',
    fontSize: '0.9rem',
    marginTop: '0.8em',
  },
  ntcListBox: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  ntcList: {
    display: 'flex',

    width: '70%',
  },
  ntcNewTitle: {
    cursor: 'pointer',
    width: '80%',
    fontSize: '0.9rem',
    overflow: 'hidden',
    height: '17px',
  },
  ntcNew: {
    color: 'red',
    width: '15%',
    marginRight: '6px',
    fontWeight: '600',
  },
  dateBox: {
    width: '28%',
    fontSize: '0.8rem',
  },
  //############################//
  ntcTitle: {
    textAlign: 'center',
    marginTop: '1em',
    width: '550px',
  },
  ntcDtlContent: {
    marginTop: '1em',
    marginLeft: '1em',
    paddingBottom: '1em',
    borderBottom: '1px solid #d3d3d3',
  },
  ntcDtl: {
    fontSize: '0.85rem',
    display: 'flex',
    '& div': {
      display: 'inline-block',
      fontWeight: 'bold',
      width: '80px',
    },
    '& span': {
      fontSize: '0.8rem',
    },
  },

  ntcContent: {
    height: '500px',
  },
  ntcFileBox: {
    height: '45px',
    borderTop: '1px solid #d3d3d3',
    lineHeight: '1.5',
    display: 'flex',
  },
  ntcChip: {
    fontSize: '0.8rem',
    height: '20px',
    marginLeft: '0.5em',
  },
}))
function NoticeList({ title, dates, regDt, content, nat, stt, svc, fileId, fileNm }) {
  const classes = useStyles()
  let today = new Date()
  let formetToday = moment(today).format('YYYY-MM-DD')
  let formetDates = moment(dates, 'YYYY MM DD').format('YYYY-MM-DD')
  const [open, setOpen] = useState(false)
  return (
    <Container className={classes.ntcContainer}>
      <Box className={classes.ntcListBox}>
        <Box className={classes.ntcList}>
          <Box className={classes.ntcNew}> {formetToday !== formetDates ? null : 'New'}</Box>
          <h5 className={classes.ntcNewTitle} onClick={() => setOpen(true)}>
            {title}
          </h5>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <Box className={classes.ntcTitle}>
              <h3>{'공지사항'}</h3>
            </Box>
            <Box className={classes.ntcDtlContent}>
              <Box className={classes.ntcDtl}>
                <div>{'공지 서비스'} </div>
                <span>: {svc}</span>
              </Box>
              <Box className={classes.ntcDtl}>
                <div>{'공지 국가'} </div>
                <span>: {nat}</span>
              </Box>
              <Box className={classes.ntcDtl}>
                <div>{'공지 도시'} </div>
                <span>: {stt}</span>
              </Box>
              <Box className={classes.ntcDtl}>
                <div>{'등 록 일'} </div>
                <span>: {regDt}</span>
              </Box>
              <Box></Box>
            </Box>
            <DialogContent className={classes.ntcContent}>
              <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </DialogContent>
            <DialogContent className={classes.ntcFileBox}>
              <Box style={{ width: '150px', fontSize: '0.9rem' }}>첨부파일 :</Box>
              <Box className={classes.ntcChipBox}>
                {fileNm?.split(',').map(item => (
                  <Chip
                    className={classes.ntcChip}
                    label={item}
                    color="primary"
                    key={fileId?.split(',')[fileNm?.split(',').indexOf(item)]}
                    id={fileId?.split(',')[fileNm?.split(',').indexOf(item)]}
                    onClick={fileload}
                  ></Chip>
                ))}
              </Box>
            </DialogContent>
          </Dialog>
        </Box>
        <Box className={classes.dateBox}>{formetDates}</Box>
      </Box>
    </Container>
  )
}
export default NoticeList
