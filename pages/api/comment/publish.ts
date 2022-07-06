import { EXCEPTION_COMMENT } from '../config/code';
import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../../config'
import { ISession } from ".."
import { prepareConnection } from 'db/index'
import { User, Article, Comment } from 'db/entity'

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session
  const { articleId = '', content = '' } = req.body
  const AppDataSource = await prepareConnection()
  const userRepo = AppDataSource.getRepository(User)
  const articleRepo = AppDataSource.getRepository(Article)
  const commentRepo = AppDataSource.getRepository(Comment)

  const user = await userRepo.findOne({
    where: {
      id: session.userId
    }
  })

  const article = await articleRepo.findOne({
    where: {
      id: articleId
    }
  })

  const comment = new Comment()
  const date = new Date()
  comment.content = content
  comment.create_time = date
  comment.update_time = date

  if (user) {
    comment.user = user
  }

  if (article) {
    comment.article = article
  }

  const resComment = await commentRepo.save(comment)

  if (resComment) {
    res.status(200).json({
      code: 0,
      data: resComment,
      msg: '发表成功'
    })
  } else {
    res.status(200).json(EXCEPTION_COMMENT.PUBLISH_FAILED)
  }
}

export default withIronSessionApiRoute(publish, ironOptions)
