import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import NavBar from './NavBar'
import TopBar from './TopBar'
import Axios from 'axios'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'react-confirm-alert/src/react-confirm-alert.css'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256,
    },
  },
  contentContainer: {
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
  },
  content: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto',
  },
}))

const DashboardLayout = () => {
  const classes = useStyles()
  const [isMobileNavOpen, setMobileNavOpen] = useState(false)
  const [onNewTab, setOnNewTab] = useState(false)
  const navigate = useNavigate()
  const userLoginDT = JSON.parse(localStorage.getItem('userInfo')).loginDT
  let today = new Date()
  let formetToday = moment(today).format('YYYYMMDD')
  let formetLoginDate = moment(userLoginDT).format('YYYYMMDD')

  const refreshToken = async () => {
    try {
      const token = await Axios.get(`${process.env.REACT_APP_API_GW_URL}/api/v1/getToken`, {
        withCredentials: true,
      })
      if (token?.data?.accessToken !== undefined) {
        sessionStorage.setItem('token', token?.data?.accessToken)
        setOnNewTab(true)
      }
    } catch (e) {
      sessionStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      navigate('/login', { replace: true })
    }
  }

  const loginOut = async () => {
    try {
      const result = await Axios.post(`${process.env.REACT_APP_API_GW_URL}/api/v1/logout`, null, {
        withCredentials: true,
      })

      if (result?.status === 200) {
        localStorage.removeItem('userInfo')
        sessionStorage.removeItem('token')
        navigate('/login', { replace: true })
      } else {
        localStorage.removeItem('userInfo')
        sessionStorage.removeItem('token')
        navigate('/login', { replace: true })
      }
    } catch (error) {
      localStorage.removeItem('userInfo')
      sessionStorage.removeItem('token')
      navigate('/login', { replace: true })
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem('token') === null && localStorage.getItem('userInfo') !== null) {
      refreshToken()
    }
    if (formetToday > formetLoginDate) {
      loginOut()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionStorage, refreshToken, formetToday, loginOut, formetLoginDate])

  return (
    <div className={classes.root}>
      <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      
      <NavBar
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
        onNewTab={onNewTab}
        setOnNewTab={setOnNewTab}
      />
      <div className={classes.wrapper}>
        <div className={classes.contentContainer}>
          <div className={classes.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
