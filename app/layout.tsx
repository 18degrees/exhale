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
					<link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
					<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<link rel="shortcut icon" href="/favicon.ico" />
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
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
