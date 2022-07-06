export const EXCEPTION_USER = {
  NOT_LOGIN: {
    code: 1001,
    msg: '未登录'
  },
  NOT_FOUND: {
    code: 1002,
    msg: '未找到用户'
  },
  UPDATE_FAILED: {
    code: 1003,
    msg: '修改失败'
  }
}

export const EXCEPTION_ARTICLE = {
  PUBLISH_FAILED: {
    code: 2001,
    msg: '发布失败'
  },
  UPDATE_FAILED: {
    code: 2002,
    msg: '更新失败'
  },
  NOT_FOUND: {
    code: 2003,
    msg: '文章不存在'
  }
}

export const EXCEPTION_COMMENT = {
  PUBLISH_FAILED: {
    code: 4001,
    msg: '发表失败'
  }
}

export const EXCEPTION_TAG = {
  FOLLOW_FAILED: {
    code: 3001,
    msg: '关注失败'
  },
  FOLLOW_SUCCESS: {
    code: 0,
    msg: '关注成功'
  },
  UNFOLLOW_FAILED: {
    code: 3002,
    msg: '取关失败'
  },
  UNFOLLOW_SUCCESS: {
    code: 0,
    msg: '取关成功'
  },
  NOT_FOUND: {
    code: 3004,
    msg: '标签不存在'
  }
}
