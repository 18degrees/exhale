import type { Metadata } from "next"

export const metadata: Metadata = {
	title: {
		template: '%s | Exhale',
		default: 'О сайте',
	}
}
export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <>{children}</>
    )
}