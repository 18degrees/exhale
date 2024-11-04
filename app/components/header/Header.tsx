import Link from 'next/link'
import style from './header.module.css'
import Image from 'next/image'

export default function Header() {
    return (
        <header className={style.header}>
            <div>
                <Image
                    src='/favicon-48x48.png'
                    alt='logo'
                    width={48}
                    height={48}
                    priority
                />
                <nav>
                    <Link href='/'>gallery</Link>
                    <Link href='/about'>about</Link>
                </nav>
                <div className={style.plug}></div>
            </div>
        </header>
    )
}