import { EXCEPTION_USER } from 'pages/api/config/code';
import { ironOptions } from 'config/index';
import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from 'iron-session/next'
import { prepareConnection } from 'db';
import { User } from 'db/entity';

async function detail(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const AppDataSource = await prepareConnection()
  const userRepo = AppDataSource.getRepository(User)

  const userInfo = await userRepo.findOne({
    where: {
      id: Number(id)
    }
  })

  if (userInfo) {
    res.status(200).json({
      code: 0,
      msg: '',
      data: {
        userInfo
      }
    })
  } else {
    res.status(200).json(EXCEPTION_USER.NOT_FOUND)
  }
}

export default withIronSessionApiRoute(detail, ironOptions)
