import "reflect-metadata"
import { DataSource } from 'typeorm'
import { User, UserAuth, Article, Comment, Tag } from "./entity";

let connectReadyPromise: Promise<DataSource> | null = null;
const host = process.env.DATABASE_HOST
const port = process.env.DATABASE_PORT as string
const username = process.env.DATABASE_USERNAME
const password = process.env.DATABASE_PASSWORD
const database = process.env.DATABASE_NAME

export const prepareConnection = () => {
  if (!connectReadyPromise) {
    connectReadyPromise = (async () => {
      const AppDataSource = new DataSource({
        type: 'mysql',
        host,
        port: +port,
        username,
        password,
        database,
        entities: [User, UserAuth, Article, Comment, Tag],
        synchronize: false,
        logging: true
      })
      await AppDataSource.initialize().then(() => {console.log("Data Source has been initialized!")})
      return AppDataSource
    })()
  }
  return connectReadyPromise
}
