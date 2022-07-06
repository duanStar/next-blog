import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { message } from 'antd'
import CountDown from '../CountDown'
import request from '../../services/fetch'
import styles from './index.module.scss'
import { useStore } from 'store'

interface LoginProps {
  isShow: boolean
  onClose: Function
}

const Login: NextPage<LoginProps> = (props) => {
  const store = useStore()
  const { isShow, onClose } = props
  const [form, setForm] = useState({
    phone: '',
    captcha: ''
  })
  const [isShowCaptcha, setIsShowCaptcha] = useState(false)
  const handleClose = () => {
    onClose && onClose()
  }
  const handleGetCaptcha = () => {
    if (!form.phone) {
      message.warning("请输入手机号")
      return
    }
    request.post('/api/user/sendCaptcha', {
      to: form.phone,
      templateId: 1
    }).then((res: any) => {
      if (res.code === 0) {
        store.user.setUserInfo(res.data)
        message.success(res.msg || '发送成功')
      } else {
        message.error(res.msg || '发送失败')
      }
      setIsShowCaptcha(true)
    })
  }
  const handleLogin = () => {
    if (!form.phone) {
      message.warning("请输入手机号")
      return
    }
    if (!form.captcha) {
      message.warning("请输入验证码")
      return
    }
    request.post('/api/user/login', {
      ...form,
      identity_type: 'phone'
    }).then((res: any) => {
      if (res.code === 0) {
        message.success(res.msg || '登录成功')
        onClose && onClose(res.data)
      } else {
        message.error(res.msg || '登录失败')
      }
    })
  }
  const handleOAuthLogin = () => {}
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }
  const handleCaptchaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({
      ...form,
      [name]: value
    })
  }
  const handleCountDownEnd = () => {
    setIsShowCaptcha(false)
  }
  return isShow ? (<div className={styles.loginArea}>
    <div className={styles.loginBox}>
      <div className={styles.loginTitle}>
        <div>手机号登录</div>
        <div className={styles.close} onClick={handleClose}>x</div>
      </div>
      <input type="text" name="phone" placeholder="请输入手机号" value={form.phone} onChange={handlePhoneChange}/>
      <div className={styles.verifyCodeArea}>
        <input type="text" name="captcha" placeholder="请输入验证码" value={form.captcha} onChange={handleCaptchaChange}/>
        <span className={styles.verifyCode}>
          { isShowCaptcha ? <CountDown time={10} onEnd={handleCountDownEnd} /> : <span onClick={handleGetCaptcha}>获取验证码</span>}
        </span>
      </div>
      <div className={styles.loginBtn} onClick={handleLogin}>
        登录
      </div>
      <div className={styles.otherLogin} onClick={handleOAuthLogin}>使用 GitHub 登录</div>
      <div className={styles.loginPrivacy}>
        注册登录即表示同意
        <a href="https://moco.imooc.com/privacy.html" target="_blank" rel="noreferrer">隐私政策</a>
      </div>
    </div>
  </div>) : <div></div> 
  
}

export default observer(Login)
