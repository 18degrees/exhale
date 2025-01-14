import { Providers } from "./components/Providers"
import Header from "./components/header/Header"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
	title: {
		template: '%s | Exhale',
		default: 'Exhale',
	},
	description: "Галерея фотографий сделанных в Санкт-Петербурге перспективным начинающим фотографом Михаилом Изотовым",
}

export default function RootLayout({
	children,
	modal
}: Readonly<{
	children: React.ReactNode,
	modal: React.ReactNode,
	
}>) {
	return (
		<html lang="ru">
			<Providers>
				<head>
                    <meta name="apple-mobile-web-app-title" content="exhale" />
				</head>
				<body>
					<Header/>
					<main>
						{modal}
						{children}
						<div id="modal-root" />
					</main>
				</body>
			</Providers>
		</html>
	)
}
