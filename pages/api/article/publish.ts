import { EXCEPTION_ARTICLE } from '../config/code';
import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../../config'
import { ISession } from ".."
import { prepareConnection } from 'db/index'
import { User, Article, Tag } from 'db/entity'

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session
  const { title = '', content = '', tagIds = [] } = req.body
  const AppDataSource = await prepareConnection()
  const userRepo = AppDataSource.getRepository(User)
  const articleRepo = AppDataSource.getRepository(Article)
  const tagRepo = AppDataSource.getRepository(Tag)

  const user = await userRepo.findOne({
    where: {
      id: session.userId
    }
  })

  const tags = await tagRepo.find({
    where: tagIds.map((tagId: number) => ({
      id: tagId
    }))
  })

  const article = new Article()
  const date = new Date()
  article.title = title
  article.content = content
  article.create_time = date
  article.update_time = date
  article.is_delete = 0
  article.views = 0

  if (user) {
    article.user = user
  }

  if (tags) {
    const newTags = tags.map(tag => {
      tag.article_count++
      return tag
    })
    article.tags = newTags
  }

  const resArticle = await articleRepo.save(article)

  if (resArticle) {
    res.status(200).json({
      code: 0,
      data: resArticle,
      msg: '发布成功'
    })
  } else {
    res.status(200).json({
      ...EXCEPTION_ARTICLE.PUBLISH_FAILED
    })
  }
}

export default withIronSessionApiRoute(publish, ironOptions)
