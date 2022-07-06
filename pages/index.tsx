import ListItem from 'components/ListItem';
import { prepareConnection } from 'db';
import { Article, Tag } from 'db/entity';
import type { NextPage } from 'next';
import { Divider } from 'antd'
import { IArticle, ITag } from './api';
import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'
import classnames from 'classnames'
import request from 'services/fetch'

export async function getServerSideProps() {
  const AppDataSource = await prepareConnection()
  const articleRepo = AppDataSource.getRepository(Article)
  const tagRepo = AppDataSource.getRepository(Tag)
  const articles = await articleRepo.find({
    relations: ['user', 'tags']
  })
  const tags = await tagRepo.find({
    relations: ['users']
  })
  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(tags)) || []
    }
  }
}

interface IndexProps {
  articles: IArticle[],
  tags: ITag[]
}

const Home: NextPage<IndexProps> = (props) => {
  const { articles, tags }  = props
  const [selectTag, setSelectTag] = useState(0)
  const [showArticles, setShowArticles] = useState([...articles]);

  useEffect(() => {
    console.log(selectTag)
    selectTag &&
      request.get(`/api/article/get?tagId=${selectTag}`).then((res: any) => {
        if (res?.code === 0) {
          setShowArticles(res?.data);
        }
      });
  }, [selectTag])

  const handleSelectTag = (event: any) => {
    const { tagid } = event?.target?.dataset || {};
    if ((tagid && Number(tagid) === selectTag) || !tagid) {
      setSelectTag(-1)
      return
    }
    setSelectTag(Number(tagid));
  }

  return (
    <div>
      <div className={styles.tags} onClick={handleSelectTag}>
        {tags?.map((tag) => (
          <div
            key={tag?.id}
            data-tagid={tag?.id}
            className={classnames(
              styles.tag,
              selectTag === tag?.id ? styles['active'] : ''
            )}
          >
            {tag?.title}
          </div>
        ))}
      </div>
      <div className='contentLayout'>
        { showArticles.map((item, index) => <React.Fragment key={index}>
          <ListItem  article={item} />
          <Divider></Divider>
        </React.Fragment>) }
      </div>
    </div>
  );
};

export default Home;
