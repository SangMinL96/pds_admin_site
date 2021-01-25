import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Box, Drawer, Hidden, IconButton, List, makeStyles } from '@material-ui/core'
import { ExpandMore, ChevronRight, BarChartSharp, DnsOutlined, RemoveOutlined, ClearAllOutlined } from '@material-ui/icons'

import { TreeItem, TreeView } from '@material-ui/lab'
import StyledTreeItem from 'src/components/StyledTreeItem'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import InputIcon from '@material-ui/icons/Input'
import { useNavigate } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import Axios from 'axios'
import { toast } from 'react-toastify'

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256,
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)',
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64,
  },
  logOutBox: {
    width: '100%',
    backgroundColor: '#ebebeb',
    '& span': {
      fontSize: '0.8rem',
      marginLeft: '0.8em',
      fontWeight: '500',
    },
  },
}))

function handleClick(event) {
  localStorage.setItem('pageName', event.target.innerText)
}

const NavBar = ({ onMobileClose, openMobile, onNewTab, setOnNewTab }) => {
  const classes = useStyles()
  const location = useLocation()
  const navigate = useNavigate()
  const [usrMnuTree, setUsrMnuTree] = useState(null)
  const USER_MNU = gql`
    query getUserMnu($usrId: String!, $ver: String!) {
      getUserMnu(ver: $ver, USR_ID: $usrId) {
        USR_ID
        MNU_ID
        MNU_NM
        MDLE_CD
        SCRN_LNK_PTH
        PATH
        ICO_PTH
        LVL
      }
    }
  `

  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const refreshToken = sessionStorage.getItem('token')

  const { data: usrMnus, refetch } = useQuery(USER_MNU, {
    returnPartialData: true,
    skip: userInfo === null,
    variables: { usrId: userInfo?.loginID, ver: 'v1' },
    fetchPolicy: 'network-only',
  })
  const menuIcons = { DnsOutlined, ClearAllOutlined, RemoveOutlined }
  var usrMnuTreeList = []

  useEffect(() => {
 

    if (onNewTab === true) {
      refetch()
      setOnNewTab(false)
    }
    if (openMobile && onMobileClose) {
      onMobileClose()
    }
    if (usrMnus) {
      let mnus = usrMnus?.getUserMnu || []
      let pmnu = null
      let mdleMnu = null
      for (var i = 0; i < mnus.length; i++) {
        if (mnus[i].LVL === 1) {
          mdleMnu = (
            <StyledTreeItem
              key={i + ''}
              style={{ marginLeft: '1em' }}
              nodeId={i + ''}
              labelText={mnus[i].MNU_NM}
              labelIcon={menuIcons[mnus[i].ICO_PTH]}
              children={[]}
            />
          )
          usrMnuTreeList.push(mdleMnu)
        } else if (mnus[i].LVL === 2) {
          pmnu = (
            <StyledTreeItem
              key={i + ''}
              nodeId={i + ''}
              labelText={mnus[i].MNU_NM}
              labelIcon={menuIcons[mnus[i].ICO_PTH]}
              children={[]}
            />
          )
          mdleMnu.props.children.push(pmnu)
        } else if (mnus[i].LVL === 3) {
          pmnu.props.children.push(
            <Link key={i + 'lnk'} to={mnus[i].SCRN_LNK_PTH ? mnus[i].SCRN_LNK_PTH : '#none'} onClick={handleClick}>
              <StyledTreeItem key={i + ''} nodeId={i + ''} labelText={mnus[i].MNU_NM} labelIcon={menuIcons[mnus[i].ICO_PTH]} />
            </Link>,
          )
        }
      }
      setUsrMnuTree(usrMnuTreeList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usrMnus, location.pathname, refreshToken])

  const logOutFn = async () => {
    try {
      const result = await Axios.post(`${process.env.REACT_APP_API_GW_URL}/api/v1/logout`, null, {
        withCredentials: true,
      })

      if (result?.status === 200) {
        localStorage.removeItem('userInfo')
        sessionStorage.removeItem('token')
        navigate('/login', { replace: true })
        toast.success('정상적으로 로그아웃 하였습니다.')
      } else {
        toast.error('다시시도 해주세요.')
      }
    } catch (error) {
      toast.error('다시시도 해주세요.')
    }
  }
  const logOut = () => {
    onMobileClose()
    confirmAlert({
      title: '로그아웃',
      message: '로그아웃 하시겠습니까?',

      buttons: [
        {
          label: '네',
          onClick: () => {
            logOutFn()
          },
        },
        {
          label: '아니요',
        },
      ],
    })
  }

  const content = (
    <Box height="100%" display="flex" flexDirection="column">
      <List>
        <Box p={2}>
          <Box mt={1}>
            <Link to="/dashboard">
              <TreeItem
                style={{ marginLeft: '1em' }}
                icon={<BarChartSharp style={{ marginRight: '0.6em', fontSize: '1.5rem' }} />}
                nodeId="1"
                label="대쉬보드"
              />
            </Link>
          </Box>
          <Box mt={1}>
            <TreeView defaultCollapseIcon={<ExpandMore />} defaultExpandIcon={<ChevronRight />}>
              {usrMnuTree}
            </TreeView>
          </Box>
        </Box>
      </List>
    </Box>
  )

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
          <Box className={classes.logOutBox}>
            <IconButton onClick={logOut} color="inherit">
              <InputIcon /> <span> LOGIN OUT</span>
            </IconButton>
          </Box>
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer anchor="left" classes={{ paper: classes.desktopDrawer }} open variant="persistent">
          {content}
        </Drawer>
      </Hidden>
    </>
  )
}

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
}

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false,
}

export default NavBar
