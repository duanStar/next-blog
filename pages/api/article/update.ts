import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../../config'
import { prepareConnection } from 'db/index'
import { Article, Tag } from 'db/entity'
import { EXCEPTION_ARTICLE } from 'pages/api/config/code'

async function update(req: NextApiRequest, res: NextApiResponse) {
  const { title = '', content = '', id = '', tagIds = [] } = req.body
  const AppDataSource = await prepareConnection()
  const articleRepo = AppDataSource.getRepository(Article)
  const tagRepo = AppDataSource.getRepository(Tag)

  const tags = await tagRepo.find({
    where: tagIds.map((tagId: number) => ({
      id: tagId
    }))
  })

  const article = await articleRepo.findOne({
    where: {
      id
    },
    relations: ['tags']
  })
  if (article) {
    article.title = title
    article.content = content
    article.update_time = new Date()
  
    if (article.tags) {
      const newTags = tags.map(tag => {
        if (!article.tags.find(item => item.id === tag.id)) {
          tag.article_count++
        }
        return tag
      })
      const resTags = article.tags.filter(tag => !tags.find(item => item.id === tag.id))
      article.tags = newTags
      resTags.forEach(item => item.article_count--)
      await tagRepo.save(resTags)
    }
    const articleRes = await articleRepo.save(article)
  
    if (articleRes) {
      res.status(200).json({
        code: 0,
        msg: '更新成功',
        data: articleRes
      })
    } else {
      res.status(200).json(EXCEPTION_ARTICLE.UPDATE_FAILED)
    }
  } else {
    res.status(200).json(EXCEPTION_ARTICLE.NOT_FOUND)
  }
}

export default withIronSessionApiRoute(update, ironOptions)
