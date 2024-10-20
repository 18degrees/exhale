import Link from 'next/link'
import style from './header.module.css'
import { barlow } from 'app/fonts'
import Image from 'next/image'

export default function Header() {
    return (
        <header className={style.header}>
            <div>
                <div className={style['logo-container']}>
                    <Image
                        src='/favicon-rounded-45x45.png'
                        alt='logo'
                        width={45}
                        height={45}
                        priority
                    />
                    <span className={barlow.className}>exhale</span>
                </div>
                <nav>
                    <Link href='/'>gallery</Link>
                    <Link href='/about'>about</Link>
                </nav>
                <div className={style.plug}></div>
            </div>
        </header>
    )
}