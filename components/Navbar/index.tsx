import { NextPage } from 'next'
import Link from 'next/link'
import { navs } from './config'
import { useRouter } from 'next/router'
import styles from './index.module.scss'

const Navbar: NextPage = () => {
  const { pathname } = useRouter()
  
  return (
    <div className={styles.navbar}>
      <section className={styles.logArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {
          navs?.map(item => {
            return (
              <Link key={item.label} href={item.value}>
                <a className={pathname === item?.value ? styles.active : ''}>{item?.label}</a>
              </Link>
            )
          })
        }
      </section>
    </div>
  )
}

export default Navbar