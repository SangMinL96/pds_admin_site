import React, { useState } from 'react'
import styled from 'styled-components'
import { TextField, Button, Box } from '@material-ui/core'
import useAxiosGet from 'src/components/useAxiosGet'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import NoticeList from './NoticeList'
import Axios from 'axios'
import PwdEdit from './PwdEdit'
import { toast } from 'react-toastify'
import Page from 'src/components/Page'
import useMedia from 'src/components/useMedia'
const LoginView = () => {
  const [state] = useAxiosGet(`${process.env.REACT_APP_API_GW_URL}/api/v1/notices`)
  const { data: NTC_DATA } = state
  const [pwdEdit, setpwdEdit] = useState(false)
  const navigate = useNavigate()
  const { register, handleSubmit, errors } = useForm()
  const [loginError, setLoginError] = useState(false)
  const [media] = useMedia()

  const onSubmit = async data => {
    try {
      const token = await Axios.post(`${process.env.REACT_APP_API_GW_URL}/api/v1/login`, data, { withCredentials: true })

      if (token !== '' && token !== undefined) {
        sessionStorage.setItem('token', token.data.accessToken)
        localStorage.setItem(
          'userInfo',
          JSON.stringify({
            loginID: token.data.user.id,
            loginDT: new Date(),
          }),
        )
        navigate('/', { replace: true })
      }
    } catch (error) {
      const status = error?.response?.request?.status
      const pwdEditStatus = error?.response?.data?.user
      if (pwdEditStatus === 'PWD_INIT') {
        toast.error('관리자로 인해 비밀번호가 초기화 되었습니다.')
        setpwdEdit(true)
      }
      if (status === 400) {
        setLoginError(true)
      }
    }
  }

  return (
    <Page title={'Hipong Admin'}>
      <LoginContainer>
        <FormContainer>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <LoginLogo src="/static/images/loginHipongLogo.png" />
            <TextField
              error={errors?.id !== undefined ? true : false}
              style={{ width: media.w525 ? '70%' : null }}
              label="아이디"
              variant="outlined"
              fullWidth
              type="text"
              name="id"
              inputRef={register({ required: true })}
              size="small"
            />
            <TextField
              error={errors?.pwd !== undefined ? true : loginError ? true : false}
              helperText={loginError ? '아이디 또는 비밀번호가 잘못되었습니다.' : null}
              style={{ marginTop: '1em', width: media.w525 ? '70%' : null }}
              label="비밀번호"
              variant="outlined"
              fullWidth
              type="password"
              name="pwd"
              inputRef={register({ required: true })}
              size="small"
            />

            <Box
              style={{ marginTop: '1em', width: media.w525 ? '70%' : '100%', display: 'flex', justifyContent: 'space-between' }}
            >
              <Button style={{ width: '48%' }} type="submit" fullWidth variant="contained" color="primary" size="small">
                로그인
              </Button>
              <Button
                style={{ width: '48%' }}
                fullWidth
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setpwdEdit(true)}
              >
                비밀번호변경
              </Button>
            </Box>
          </Form>

          <NoticeContainer>
            <h3>공지사항</h3>
            <NoticeContents>
              {NTC_DATA?.map(item => (
                <NoticeList
                  key={item.NTC_ID}
                  title={item.NTC_NM}
                  dates={item.REG_DT}
                  content={item.NTC_CONT}
                  nat={item.NAT_NM_LST}
                  stt={item.STT_NM_LST}
                  svc={item.SVC_NM_LST}
                  regDt={item.REG_DT}
                  updDt={item.UPD_DT}
                  fileId={item.FL_ID_LST}
                  fileNm={item.FL_NM_LST}
                />
              ))}
            </NoticeContents>
          </NoticeContainer>
        </FormContainer>
      </LoginContainer>
      {pwdEdit ? <PwdEdit setpwdEdit={setpwdEdit} /> : null}
    </Page>
  )
}
export default LoginView
// 스타일스 컴포넌트
const LoginContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('/static/images/loginMainImg.png');
  background-size: 100% 100%;
  top: 0px;
`
const FormContainer = styled.div`
  width: 800px;
  height: 350px;
  border: 1px solid #e3e5e7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4em;
  box-shadow: 0px 1px 7px 0px rgba(156, 156, 156, 0.55);
  border-radius: 8px;
  background-color: #f0f0f0f5;
  @media only screen and (max-width: 800px) {
    flex-direction: column;
    justify-content: space-evenly;
    height: 600px;
    margin: 1em;
  }
  @media only screen and (max-width: 450px) {
    width: 350px;
    flex-direction: column;

    height: 550px;
    margin: 1em;
  }
  h3 {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1rem;
    width: 100px;
    height: 30px;
    position: absolute;
    top: -12px;
    left: 5%;
    z-index: 10;
    border-radius: 20px;
    background-color: #f0f0f0f5;
  }
`
const NoticeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 215px;
  border-radius: 8px;

  border: 1px solid #bbbdbf;
  box-shadow: 0px 1px 4px 0px rgba(156, 156, 156, 0.55);
  @media only screen and (max-width: 800px) {
    margin-top: 2em;
    padding-bottom: 1em;
  }
  @media only screen and (max-width: 450px) {
    width: 300px;
    margin-top: 2em;
    padding-bottom: 1em;
  }
`
const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 800px) {
    align-items: center;
  }
`
const NoticeContents = styled.div`
  margin-top: 1em;

  width: 100%;
  height: 88%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`
const LoginLogo = styled.img`
  width: 75%;
`
