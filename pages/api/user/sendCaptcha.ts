import type { NextApiRequest, NextApiResponse } from "next";
import { format } from 'date-fns'
import md5 from 'md5'
import { encode } from 'js-base64'
import { withIronSessionApiRoute } from 'iron-session/next'
import request from '../../../services/fetch'
import { ironOptions } from '../../../config'
import { ISession } from "..";

async function sendCaptcha (req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session
  const { to = '', templateId = 1 } = req.body
  const AppId = '8a216da88185a9c001818629c2fd004d'
  const AccountId = '8a216da88185a9c001818629c1eb0046'
  const AuthToken = 'd02fd7eba0494583ac7ef16cf8542f78'
  const NowDate = format(new Date(), 'yyyyMMddHHmmss')
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`)
  const Authorization = encode(`${AccountId}:${NowDate}`)
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000
  const expireMinute = 5
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter.toUpperCase()}`

  const response = await request.post(url, {
    to,
    templateId,
    appId: AppId,
    datas: [verifyCode, expireMinute]
  }, {
    headers: {
      Authorization
    }
  })
  
  const { statusCode, statusMessage, templateSMS } = response as any
  if (statusCode === '000000') {
    session.verifyCode = verifyCode
    await session.save()
    res.status(200).json({
      code: 0,
      msg: '发送成功',
      data: {
        templateSMS
      }
    })
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMessage
    })
  }
}

export default withIronSessionApiRoute(sendCaptcha, ironOptions)

