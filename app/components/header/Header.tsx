import Link from 'next/link'
import style from './header.module.css'
import Image from 'next/image'

export default function Header() {
    return (
        <header className={style.header}>
            <nav>
                <Link href='/'>галерея</Link>
                <Image
                    src='/favicon.svg'
                    alt='logo'
                    width={40}
                    height={40}
                    priority
                />
                <Link href='/about'>о сайте</Link>
            </nav>
        </header>
    )
}