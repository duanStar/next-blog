import { EXCEPTION_USER, EXCEPTION_TAG } from './../config/code';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from 'config'
import { Tag, User } from 'db/entity'
import { ISession } from '..';
import { prepareConnection } from 'db'

async function follow(req: NextApiRequest, res: NextApiResponse) {
  const session:ISession = req.session
  const { tagId, type = 'follow' } = req.body
  const AppDataSource = await prepareConnection()
  const userId = session.userId
  const tagRepo = AppDataSource.getRepository(Tag)
  const userRepo = AppDataSource.getRepository(User)

  if (!tagId) {
    res.status(200).json({
      code: 4000,
      msg: '必须传入tagId'
    })
    return
  }

  if (!userId) {
    res.status(200).json(EXCEPTION_USER.NOT_LOGIN)
    return
  }

  const user = await userRepo.findOne({
    where: {
      id: userId
    }
  })

  const tag = await tagRepo.findOne({
    relations: ['users'],
    where: {
      id: tagId
    }
  })

  if (!user) {
    res.status(200).json(EXCEPTION_USER.NOT_LOGIN)
    return
  }

  if (tag?.users && user) {
    if (type === 'follow') {
      tag.users = tag.users.concat([user])
      tag.follow_count++
    } else if (type === 'unFollow') {
      tag.users = tag.users.filter(user => user.id !== userId)
      tag.follow_count--
    }
  }

  if (tag) {
    const resTag = await tagRepo.save(tag)
    res.status(200).json({
      data: resTag,
      ...(type === 'follow' ? EXCEPTION_TAG.FOLLOW_SUCCESS : EXCEPTION_TAG.UNFOLLOW_SUCCESS)
    })
  } else {
    res.status(200).json(type === 'follow' ? EXCEPTION_TAG.FOLLOW_FAILED : EXCEPTION_TAG.UNFOLLOW_FAILED)
  }

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

export default withIronSessionApiRoute(follow, ironOptions)
