import type { NextPage } from 'next'
import "@uiw/react-md-editor/markdown-editor.css"
import "@uiw/react-markdown-preview/markdown.css"
import dynamic from "next/dynamic"
import { ChangeEvent, useState, useEffect } from 'react'
import styles from './index.module.scss'
import request from 'services/fetch'
import {Input, Button, message, Select} from 'antd'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { prepareConnection } from 'db';
import { Article } from 'db/entity';
import { IArticle } from 'pages/api'

interface ModifyEditorProps {
  article: IArticle
}

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

export async function getServerSideProps({ params }: { params: any }) {
  const AppDataSource = await prepareConnection()
  const articleRepo = AppDataSource.getRepository(Article)
  const article = await articleRepo.findOne({
    relations: ['user', 'tags'],
    where: {
      id: params.id
    }
  })
  return {
    props: {
      article: JSON.parse(JSON.stringify(article))
    }
  }
}


const ModifyEditor: NextPage<ModifyEditorProps> = (props) => {
  const { article } = props
  const { tags } = article
  const { push, query } = useRouter()
  const [content, setContent] = useState(article?.content || '')
  const [title, setTitle] = useState(article?.title || '')
  const [tagIds, setTagIds] = useState<number[]>(tags.map(tag => tag.id))
  const [allTags, setAllTags] = useState<ITag[]>([])
  const articleId = query.id

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res.code === 0) {
        setAllTags(res.data.allTags)
      }
    })
  }, [])

  const handleUpdate = () => {
    if (!title) {
      message.warning('请输入文章标题')
      return
    }
    request.post('/api/article/update', {
      title,
      content,
      id: articleId,
      tagIds
    }).then((res: any) => {
      if (res.code === 0) {
        message.success('更新成功')
        push(`/article/${articleId}`)
      } else {
        message.error(res.msg || '更新失败')
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
      <Select className={styles.tag} mode='multiple' value={tagIds} allowClear placeholder="请选择标签" onChange={handleSelectChange}>
        {
          allTags.map(tag => (
            <Select.Option key={tag.id} value={tag.id}>{tag.title}</Select.Option>
          ))
        }
      </Select>
      <Button className={styles.button} type='primary' onClick={handleUpdate}>更新</Button>
    </div>
    <MDEditor value={content} height={1080} onChange={handleContentChange} />
  </div>
}
(ModifyEditor as any).layout = null;

export default observer(ModifyEditor)
