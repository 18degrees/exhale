import style from "./page.module.css"

export default function Page() {
    return (
        <div className={style.container}>
            <p>
                Hello. My name is Mikhail Izotov. This site is my little gallery. I&apos;m not so good at taking photos, but sometimes can&apos;t help myself. 
                If you like any of those, feel free to use them for any purpose.
            </p>
            <p>
                The pictures most likely taken in Saint Petersburg, Russia.
            </p>
        </div>
    )
}