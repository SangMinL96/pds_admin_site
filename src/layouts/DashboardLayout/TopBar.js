import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  makeStyles,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import InputIcon from '@material-ui/icons/Input'
import Logo from 'src/components/Logo'
import Moment from 'react-moment'
import { useNavigate } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import i18n from 'src/components/i18n'

import Axios from 'axios'
import { toast } from 'react-toastify'
const useStyles = makeStyles(theme => ({
  root: {
    height: '64px',
  },
  userInfoStyle: {
    fontSize: '0.9rem',
    marginRight: '10px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 150,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const language = localStorage.getItem('lang')

  const [lang, setLang] = useState(language)
  const navigate = useNavigate()
  const classes = useStyles()

  const userLoginDT = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).loginDT : null
  const userLoginID = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).loginID : null

  const pageName = localStorage.getItem('pageName')

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

  const handleChangeLang = event => {
    i18n.changeLanguage(event.target.value)
    setLang(event.target.value)
    localStorage.setItem('lang', event.target.value)
  }

  return (
    <AppBar className={clsx(classes.root, className)} elevation={0} {...rest}>
      <Toolbar>
        <RouterLink to="/dashboard">
          <Logo />
        </RouterLink>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{pageName}
        <Box flexGrow={1} />
        <Hidden mdDown>
          <FormControl className={classes.formControl}>
            <InputLabel id="selectLangLabel">Select Lanaguage</InputLabel>
            <Select
              labelId="selectLangLabel"
              id="selectLang"
              value={lang || null || ''}
              onChange={handleChangeLang}
              label="Select Language"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="ko_KR">KOREAN</MenuItem>
              <MenuItem value="en_US">ENGLISH</MenuItem>
              <MenuItem value="ja_JP">JAPANESE</MenuItem>
            </Select>
          </FormControl>
          <Box className={classes.userInfoStyle}>
            {userLoginID} / <Moment format="YYYY-MM-DD hh:mm:ss">{userLoginDT}</Moment>{' '}
          </Box>
          <IconButton onClick={logOut} color="inherit">
            <InputIcon />
          </IconButton>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func,
}

export default TopBar
