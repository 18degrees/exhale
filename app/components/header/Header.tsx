import Link from 'next/link'
import style from './header.module.css'
import Image from 'next/image'

export default function Header() {
    return (
        <header className={style.header}>
            <div>
                <Image
                    src='/favicon.svg'
                    alt='logo'
                    width={40}
                    height={40}
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