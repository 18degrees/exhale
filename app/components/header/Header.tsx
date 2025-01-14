import Link from 'next/link'
import style from './header.module.css'
import Image from 'next/image'
import Logo from '@/app/favicon.ico'

export default function Header() {
    return (
        <header className={style.header}>
            <nav>
                <Link href='/'>галерея</Link>
                <Image
                    src={Logo}
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