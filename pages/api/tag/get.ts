import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from 'config'
import { Tag } from 'db/entity'
import { ISession } from '..';
import { prepareConnection } from 'db'

async function get(req: NextApiRequest, res: NextApiResponse) {
  const session:ISession = req.session
  const AppDataSource = await prepareConnection()
  const userId = session.userId
  const tagRepo = AppDataSource.getRepository(Tag)

  const followTags = await tagRepo.find({
    relations: ['users'],
    where: {
      users: {
        id: userId
      }
    }
  })

  const allTags = await tagRepo.find({
    relations: ['users']
  })

  res.status(200).json({
    code: 0,
    msg: '获取标签成功',
    data: {
      followTags,
      allTags
    }
  })
}

export default withIronSessionApiRoute(get, ironOptions)
