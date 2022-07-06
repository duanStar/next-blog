import { useState } from 'react'
import { NextPage } from 'next'
import { observer } from 'mobx-react-lite'
import Link from 'next/link'
import { navs } from './config'
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import { Button, Dropdown, Avatar, Menu, message } from 'antd'
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import Login from '../Login'
import { useStore } from 'store/index'
import request from 'services/fetch'
import { IUserInfo } from 'store/userStore'

const Navbar: NextPage = () => {
  const store = useStore()
  const { userId, avatar } = store.user.userInfo
  const { pathname, push } = useRouter()
  const [ isShowLogin, setIsShowLogin ] = useState(false)

  const handleGoToEditorPage = () => {
    if (userId) {
      push("/editor/new")
    } else {
      message.warning("请先登录")
    }
  }

  const handleLogin = () => {
    setIsShowLogin(true)
  }

  const handleClose = (data: IUserInfo) => {
    setIsShowLogin(false)
    store.user.setUserInfo(data)
  }

  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`)
  }

  const handleLogout = () => {
    request('/api/user/logout').then((res: any) => {
      if (res.code === 0) {
        store.user.setUserInfo({})
        message.success(res.msg || '退出成功')
      } else {
        message.error(res.msg || '退出失败')
      }
    })
  }

  const renderDropDownMenu = () => {
    return (
      <Menu items={
        [
          {
            label: ' 个人主页',
            icon: <HomeOutlined />,
            key: 1,
            onClick: handleGotoPersonalPage
          },
          {
            label: ' 退出系统',
            icon: <LoginOutlined />,
            key: 2,
            onClick: handleLogout
          }
        ]
      }>
      </Menu>
    );
  };

  return (
    <div className={styles.navbar}>
      <section className={styles.logArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {
          navs?.map(item => {
            return (
              <Link key={item.label} href={item.value}>
                <a className={pathname === item?.value ? styles.active : ''}>{item?.label}</a>
              </Link>
            )
          })
        }
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGoToEditorPage}>写文章</Button>
        {
          userId ? <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
              <Avatar src={avatar} size={32} />
            </Dropdown>
          </> : <Button type='primary' onClick={handleLogin}>登录</Button>
        }
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} ></Login>
    </div>
  )
}

export default observer(Navbar)