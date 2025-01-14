import style from "./page.module.css"

export default function Page() {
    return (
        <div className={style.container}>
            <p>
                Здравствуйте. Меня зовут Михаил Изотов. Люблю иногда пофоткать, а этот сайт использую как галерею. Если понравилось фото, можете использовать в любых целях.
            </p>
            <p>
                Cнимки делаю в Санкт-Петербурге.
            </p>
        </div>
    )
}