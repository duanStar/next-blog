import { NextPage } from 'next'
import styles from './index.module.scss'

const Footer: NextPage = () => {
  return (
    <div className={styles.footer}>
      <p>Next.js + React + TypeScript</p>
    </div>
  )
}

export default Footer