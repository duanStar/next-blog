import { prepareConnection } from 'db'
import { Article, User } from 'db/entity'
import type { NextPage } from 'next'
import { IArticle } from 'pages/api'
import { IUserInfo } from 'store/userStore'
import styles from './index.module.scss'
import { Avatar, Button, Divider } from 'antd'
import { CodeOutlined, FireOutlined, FundViewOutlined } from '@ant-design/icons'
import Link from 'next/link'
import ListItem from 'components/ListItem'
import { useStore } from 'store'

interface UserDetailProps {
  userInfo: IUserInfo,
  articles: IArticle[]
}

// export async function getStaticPaths() {
//   const AppDataSource = await prepareConnection()
//   const userRepo = AppDataSource.getRepository(User)

//   const users = await userRepo.find()
//   const userIds = users.map(user => ({
//     params: {
//       id: `${user.id}`
//     }
//   }))

//   return {
//     paths: userIds,
//     fallback: 'blocking'
//   }
// }

// export async function getStaticProps({ params }: { params: any }) {
//   const userId = params.id
//   const AppDataSource = await prepareConnection()
//   const userRepo = AppDataSource.getRepository(User)
//   const articleRepo = AppDataSource.getRepository(Article)
//   const user = await userRepo.findOne({
//     where: {
//       id: Number(userId)
//     }
//   })
//   const articles = await articleRepo.find({
//     where: {
//       user: {
//         id: Number(userId)
//       }
//     },
//     relations: ['user', 'tags']
//   })

//   return {
//     props: {
//       userInfo: JSON.parse(JSON.stringify(user)),
//       articles: JSON.parse(JSON.stringify(articles))
//     }
//   }
// }

export async function getServerSideProps({ params }: { params: any }) {
  const userId = params.id
  const AppDataSource = await prepareConnection()
  const userRepo = AppDataSource.getRepository(User)
  const articleRepo = AppDataSource.getRepository(Article)
  const user = await userRepo.findOne({
    where: {
      id: Number(userId)
    }
  })
  const articles = await articleRepo.find({
    where: {
      user: {
        id: Number(userId)
      }
    },
    relations: ['user', 'tags']
  })

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      articles: JSON.parse(JSON.stringify(articles))
    }
  }
}

const UserDetail: NextPage<UserDetailProps> = (props) => {
  const store = useStore()
  const loginUserInfo = store.user.userInfo
  const { userInfo, articles } = props
  const viewsCount = articles.reduce((prev, next) => {
    return prev + next.views
  }, 0)

  return <div className={styles.userDetail}>
    <div className={styles.left}>
      <div className={styles.userInfo}>
        <Avatar className={styles.avatar} src={userInfo.avatar} size={90} />
        <div>
          <div className={styles.nickname}>{userInfo.nickname}</div>
          <div className={styles.desc}>
            <CodeOutlined /> {userInfo.job}
          </div>
          <div className={styles.desc}>
            <FireOutlined /> {userInfo.introduce}
          </div>
        </div>
        { Number(loginUserInfo.userId) === Number(userInfo.id) && <Link href={`/user/profile/${userInfo.id}`}><Button>编辑个人资料</Button></Link>}
      </div>
      <Divider />
      <div className={styles.article}>
        {
          articles?.map(article => (
            <div key={article.id}>
              <ListItem article={article} />
              <Divider />
            </div>
          ))
        }
      </div>
    </div>
    <div className={styles.right}>
      <div className={styles.achievement}>
        <div className={styles.header}>个人成就</div>
        <div className={styles.number}>
          <div className={styles.wrapper}>
            <FundViewOutlined /> 
            <span>共创作 { articles.length } 篇文章</span>
          </div>
          <div className={styles.wrapper}>
            <FundViewOutlined /> 
            <span>文章被阅读 { viewsCount } 次</span>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default UserDetail