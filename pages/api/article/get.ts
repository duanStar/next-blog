import { Article } from 'db/entity';
import { prepareConnection } from 'db';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from 'config'
import { withIronSessionApiRoute } from 'iron-session/next'

async function get(req: NextApiRequest, res: NextApiResponse) {
  const { tagId } = req.query
  const AppDataSource = await prepareConnection()
  const articleRepo = AppDataSource.getRepository(Article)

  if (Number(tagId) > 0) {
    const articles = await articleRepo.find({
      relations: ['user', 'tags'],
      where: {
        tags: {
          id: Number(tagId)
        }
      }
    })
    res.status(200).json({
      code: 0,
      msg: '获取成功',
      data: articles
    })
  } else {
    const articles = await articleRepo.find({
      relations: ['user', 'tags']
    })
    res.status(200).json({
      code: 0,
      msg: '获取成功',
      data: articles
    })
  }
}

export default withIronSessionApiRoute(get, ironOptions)
