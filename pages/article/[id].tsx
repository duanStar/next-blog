import { useState } from 'react';
import type { NextPage } from 'next'
import { prepareConnection } from 'db';
import { Article } from 'db/entity';
import { IArticle, IComment } from 'pages/api';
import { Avatar, Input, Button, message, Divider } from 'antd'
import { observer } from 'mobx-react-lite'
import { useStore } from 'store';
import styles from './index.module.scss'
import Link from 'next/link';
import Markdown from 'markdown-to-jsx'
import { format } from 'date-fns'
import request from 'services/fetch'
import { useRouter } from 'next/router';

interface ArticleDetailProps {
  article: IArticle
}

export async function getServerSideProps({ params }: { params: any }) {
  const AppDataSource = await prepareConnection()
  const articleRepo = AppDataSource.getRepository(Article)
  const article = await articleRepo.findOne({
    relations: ['user', 'comments', 'comments.user'],
    where: {
      id: params.id,
    },
    order: {
      comments: {
        update_time: 'DESC'
      }
    }
  })
  if (article) {
    article.views = article.views + 1
    await articleRepo.update({
      id: article.id
    }, {
      views: article.views
    })
  }
  return {
    props: {
      article: JSON.parse(JSON.stringify(article))
    }
  }
}

const ArticleDetail: NextPage<ArticleDetailProps> = (props) => {
  const store = useStore()
  const { push } = useRouter()
  const [inputVal, setInputVal] = useState('')
  const loginUserInfo = store.user.userInfo
  const { article } = props
  const { user: { nickname, avatar, id } } = article
  const [comments, setComments] = useState(article.comments)

  const handleComment = () => {
    if (!inputVal) {
      message.warning('评论内容不能为空')
      return
    }
    request.post('/api/comment/publish', {
      content: inputVal,
      articleId: article.id
    }).then((res: any) => {
      if (res.code === 0) {
        message.success('评论发表成功')
        const newComments: IComment[] = [
          {
            id: Math.random(),
            create_time: new Date(),
            update_time: new Date(),
            content: inputVal,
            user: {
              avatar: loginUserInfo.avatar,
              nickname: loginUserInfo.nickname,
              id: loginUserInfo.userId,
              userId: loginUserInfo.userId
            },
          },
          ...comments
        ]
        setComments(newComments)
        setInputVal('')
      } else {
        message.error(res.msg || '评论发表失败')
      }
    })
  }

  const handleGotoPersonalPage = () => {
    push(`/user/${id}`)
  }

  return <div>
    <div className="contentLayout">
      <h2 className={styles.title}>{article?.title}</h2>
      <div className={styles.user}>
        <div style={{ cursor: 'pointer' }} onClick={handleGotoPersonalPage}>
          <Avatar src={avatar} size={50}></Avatar>
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{nickname}</div>
          <div className={styles.date}>
            <div>{format(new Date(article?.update_time), 'yyyy-MM-dd hh:mm:ss')}</div>
            <div>阅读 {article?.views}</div>
            {
              Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>编辑</Link>
              )
            }
          </div>
        </div>
      </div>
      <Markdown className={styles.markdown}>{article?.content}</Markdown>
    </div>
    <div className={styles.divider}></div>
    <div className="contentLayout">
      <div className={styles.comment}>
        <h3>评论</h3>
        {
          loginUserInfo.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40}></Avatar>
              <div className={styles.content}>
                <Input.TextArea placeholder='请输入评论' rows={4} value={inputVal} onChange={e => setInputVal(e.target.value)} />
                <Button type='primary' onClick={handleComment}>发表评论</Button>
              </div>
            </div>
          )
        }
      </div>
      <Divider></Divider>
      <div className={styles.display}>
        {
          comments.map(comment => (
            <div className={styles.wrapper} key={comment?.id}>
              <Avatar src={comment?.user?.avatar} size={40} />
              <div className={styles.info}>
                <div className={styles.name}>
                  <div>{comment?.user?.nickname}</div>
                  <div className={styles.date}>{format(new Date(comment.update_time), 'yyyy-MM-dd hh:mm:ss')}</div>
                </div>
                <div className={styles.content}>
                  {comment?.content}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  </div>
}

export default observer(ArticleDetail)