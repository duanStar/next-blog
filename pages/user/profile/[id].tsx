import { observer } from 'mobx-react-lite'
import type { NextPage } from 'next'
import { Form, Input, Button, message } from 'antd'
import request from 'services/fetch'
import styles from './index.module.scss'
import { useEffect } from 'react'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
}

const tailLayout = {
  wrapperCol: { offset: 4 }
}

export async function getServerSideProps({ params }: { params: any }) {
  const userId = params.id
  return {
    props: {
      userId: Number(userId)
    }
  }
}

interface ProfileProps {
  userId: number
}

const Profile: NextPage<ProfileProps> = (props) => {
  const [form] = Form.useForm()
  const { userId } = props

  useEffect(() => {
    request.get('/api/user/detail', {
      params: {
        id: userId
      }
    }).then((res: any) => {
      if (res.code === 0) {
        form.setFieldsValue(res.data.userInfo)
      }
    })
  }, [form, userId])

  const handleSubmit = (values: any) => {
    request.post('/api/user/update', {
      ...values,
      id: userId
    }).then((res: any) => {
      if (res.code === 0) {
        message.success(res.msg || '修改成功')
      } else {
        message.error(res.msg || '修改失败')
      }
    })
  }

  return (<div className='contentLayout'>
    <div className={styles.userProfile}>
      <h2>个人资料</h2>
      <div>
        <Form {...layout} form={form} className={styles.form} onFinish={handleSubmit}>
          <Form.Item label="用户名" name="nickname" rules={[{ required: true, message: '用户名是必须的' }]}>
            <Input placeholder='请输入用户名' />
          </Form.Item>
          <Form.Item label="职位" name="job" rules={[{ required: true, message: '职位是必须的' }]}>
            <Input placeholder='请输入职位' />
          </Form.Item>
          <Form.Item label="个人介绍" name="introduce" rules={[{ required: true, message: '个人介绍是必须的' }]}>
            <Input placeholder='请输入个人介绍' />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type='primary' htmlType='submit'>保持修改</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  </div>)
}

export default observer(Profile)
