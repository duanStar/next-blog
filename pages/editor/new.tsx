import type { NextPage } from 'next'
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import dynamic from "next/dynamic"
import { ChangeEvent, useEffect, useState } from 'react'
import styles from './index.module.scss'
import request from 'services/fetch'
import {Input, Button, message, Select} from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from 'store'
import { useRouter } from 'next/router'

interface IUser {
  id: number;
  nickname: string;
  avatar: string;
}

interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: IUser[];
}

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
)

const Editor: NextPage = () => {
  const store = useStore()
  const { push } = useRouter()
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('')
  const { userId } = store.user.userInfo
  const [tagIds, setTagIds] = useState<number[]>([])
  const [allTags, setAllTags] = useState<ITag[]>([])

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res.code === 0) {
        setAllTags(res.data.allTags)
      }
    })
  }, [])

  const handlePublish = () => {
    if (!title) {
      message.warning('请输入文章标题')
      return
    }
    request.post('/api/article/publish', {
      title,
      content,
      tagIds
    }).then((res: any) => {
      if (res.code === 0) {
        message.success('发布成功')
        if (userId) {
          push(`/user/${userId}`)
        }
      } else {
        message.error(res.msg || '发布失败')
      }
    })
  }
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  const handleContentChange = (value: any) => setContent(value)

  const handleSelectChange = (value: number[]) => {
    setTagIds(value)
  }

  return <div className={styles.container}>
    <div className={styles.operation}>
      <Input className={styles.title} placeholder="请输入文章标题" value={title} onChange={handleTitleChange} />
      <Select className={styles.tag} mode='multiple' allowClear placeholder="请选择标签" onChange={handleSelectChange}>
        {
          allTags.map(tag => (
            <Select.Option key={tag.id} value={tag.id}>{tag.title}</Select.Option>
          ))
        }
      </Select>
      <Button className={styles.button} type='primary' onClick={handlePublish}>发布</Button>
    </div>
    <MDEditor value={content} height={1080} onChange={handleContentChange} />
  </div>
}
(Editor as any).layout = null;

export default observer(Editor)
