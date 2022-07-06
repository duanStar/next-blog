import { IUserInfo } from './../../store/userStore';
import { IronSession } from 'iron-session'

export type ISession = IronSession & Record<string, any>;

interface IUser {
  id: number;
  nickname: string;
  avatar: string;
}

interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: IUser[];
}

export type IArticle = {
  id: number;
  title: string;
  content: string;
  create_time: Date;
  update_time: Date;
  views: number;
  user: IUserInfo;
  comments: IComment[];
  tags: ITag[];
}

export type IComment = {
  id: number;
  content: string;
  create_time: Date;
  update_time: Date;
  user: IUserInfo;
}
