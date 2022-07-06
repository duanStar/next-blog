import { EXCEPTION_USER } from 'pages/api/config/code';
import { ironOptions } from 'config/index';
import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from 'iron-session/next'
import { prepareConnection } from 'db';
import { User } from 'db/entity';

async function update(req: NextApiRequest, res: NextApiResponse) {
  const { nickname, job, introduce, id } = req.body
  const AppDataSource = await prepareConnection()
  const userRepo = AppDataSource.getRepository(User)

  const userInfo = await userRepo.findOne({
    where: {
      id: Number(id)
    }
  })

  if (userInfo) {
    userInfo.nickname = nickname
    userInfo.job = job
    userInfo.introduce = introduce

    const resUser = await userRepo.save(userInfo)

    if (resUser) {
      res.status(200).json({
        code: 0,
        msg: '修改成功',
        data: {
          userInfo
        }
      })
    } else {
      res.status(200).json(EXCEPTION_USER.UPDATE_FAILED)
    }
  } else {
    res.status(200).json(EXCEPTION_USER.NOT_FOUND)
  }
}

export default withIronSessionApiRoute(update, ironOptions)
