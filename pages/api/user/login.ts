import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from 'iron-session/next'
import { Cookie } from 'next-cookie'
import { ironOptions } from '../../../config'
import { ISession } from ".."
import { prepareConnection } from 'db/index'
import { User, UserAuth } from 'db/entity'
import { setCookie } from 'utils'

async function sendCaptcha (req: NextApiRequest, res: NextApiResponse) {
  const AppDataSource = await prepareConnection()
  const userAuthRepo = AppDataSource.getRepository(UserAuth)
  const cookies = Cookie.fromApiRoute(req, res)
  const session: ISession = req.session
  const { phone = '', captcha = '', identity_type='phone' } = req.body
  if (!phone) {
    res.status(200).json({
      code: 4001,
      msg: '必须输入手机号',
      data: null
    })
    return
  }
  if (!captcha) {
    res.status(200).json({
      code: 4001,
      msg: '必须输入验证码',
      data: null
    })
    return
  }
  if (String(session.verifyCode) === String(captcha)) {
    const userAuth = await userAuthRepo.findOne({
      where: {
        identity_type,
        identifier: phone
      },
      relations: ['user']
    })
    if (userAuth) {
      const { nickname, id, avatar } = userAuth.user
      session.userId = id
      session.nickname = nickname
      session.avatar = avatar
      await session.save()
      setCookie(cookies, {
        userId: id,
        nickname,
        avatar
      })
    } else {
      const user = new User()
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`
      user.avatar = '/images/avatar.jpg'
      user.job = '暂无'
      user.introduce = '暂无'

      const userAuth = new UserAuth()
      userAuth.identifier = phone
      userAuth.identity_type = identity_type
      userAuth.credential = captcha
      userAuth.user = user

      const resUserAuth = await userAuthRepo.save(userAuth)
      const { user: { nickname, id, avatar } } = resUserAuth
      session.userId = id
      session.nickname = nickname
      session.avatar = avatar
      await session.save()
      setCookie(cookies, {
        userId: id,
        nickname,
        avatar
      })
    }
    res.status(200).json({
      code: 0,
      msg: '登录成功',
      data: {
        userId: session.userId,
        avatar: session.avatar,
        nickname: session.nickname
      }
    })
  } else {
    res.status(200).json({
      code: -1,
      msg: '验证码错误',
      data: null
    })
  }
}

export default withIronSessionApiRoute(sendCaptcha, ironOptions)

