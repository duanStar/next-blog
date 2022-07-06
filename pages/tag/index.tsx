import type { NextPage } from 'next';
import { Tabs, Button, message } from 'antd';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { useEffect, useState } from 'react';
import request from 'services/fetch';
import styles from './index.module.scss'
import * as ANTD_ICONS from '@ant-design/icons'

const { TabPane } = Tabs;

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

const Tag: NextPage = () => {
  const store = useStore()
  const [followTags, setFollowTags] = useState<ITag[]>()
  const [allTags, setAllTags] = useState<ITag[]>()
  const [needRefresh, setNeedRefresh] = useState(false)
  const { userId } = store.user.userInfo

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res.code === 0) {
        const { followTags = [], allTags = [] } = res.data
        setFollowTags(followTags)
        setAllTags(allTags)
      }
    })
  }, [needRefresh])

  const handleUnFollow = (id: number) => {
    request.post('/api/tag/follow', {
      tagId: id,
      type: 'unFollow'
    }).then((res: any) => {
      if (res.code === 0) {
        message.success(res.msg || '取关成功')
        setNeedRefresh(!needRefresh)
      } else {
        message.error(res.msg || '取关失败')
      }
    })
  }

  const handleFollow = (id: number) => {
    request.post('/api/tag/follow', {
      tagId: id,
      type: 'follow'
    }).then((res: any) => {
      if (res.code === 0) {
        message.success(res.msg || '关注成功')
        setNeedRefresh(!needRefresh)
      } else {
        message.error(res.msg || '关注失败')
      }
    })
  }


  return (
    <div className="contentLayout">
      <Tabs defaultActiveKey='all'>
        <TabPane tab='已关注标签' key='follow' className={styles.tags}>
          {
            followTags?.map(tag => (
              <div key={tag.id} className={styles.tagWrapper}>
                <div>{(ANTD_ICONS as any)[tag.icon]?.render()}</div>
                <div className={styles.title}>{tag.title}</div>
                <div>{tag.follow_count} 关注 {tag.article_count} 文章</div>
                {
                  tag.users.find(user => Number(user.id) === Number(userId)) ? <Button type='primary' onClick={() => handleUnFollow(tag.id)}>已关注</Button> : <Button onClick={() => handleFollow(tag.id)}>关注</Button>
                }
              </div>
            ))
          }
        </TabPane>
        <TabPane tab='全部标签' key='all' className={styles.tags}>
          {
            allTags?.map(tag => (
              <div key={tag.id} className={styles.tagWrapper}>
                <div>{(ANTD_ICONS as any)[tag.icon]?.render()}</div>
                <div className={styles.title}>{tag.title}</div>
                <div>{tag.follow_count} 关注 {tag.article_count} 文章</div>
                {
                  tag.users.find(user => Number(user.id) === Number(userId)) ? <Button type='primary' onClick={() => handleUnFollow(tag.id)}>已关注</Button> : <Button onClick={() => handleFollow(tag.id)}>关注</Button>
                }
              </div>
            ))
          }
        </TabPane>
      </Tabs>
    </div>
  );
};

export default observer(Tag);
