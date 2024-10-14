import { Providers } from "./components/Providers"
import Header from "./components/header/Header"
import type { Metadata } from "next"
import { lora } from './fonts'
import "./globals.css"

export const metadata: Metadata = {
	title: {
		template: '%s | Exhale',
		default: 'Exhale',
	},
	description: "The gallery of photo mostly taken in Saint Petersburg by Mikhail Izotov",
}

export default function RootLayout({
	children,
	modal
}: Readonly<{
	children: React.ReactNode,
	modal: React.ReactNode,
	
}>) {
	return (
		<html lang="en">
			<Providers>
				<head>
					<link rel="icon" type="image/png" href="/favicon-48x48.png" sizes="48x48" />
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<link rel="shortcut icon" href="/favicon.ico" />
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
					<meta name="apple-mobile-web-app-title" content="exhale" />
				</head>
				<body className={lora.className}>
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
