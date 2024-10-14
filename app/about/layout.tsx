import type { Metadata } from "next"

export const metadata: Metadata = {
	title: {
		template: '%s | Exhale',
		default: 'About',
	},
	description: "The gallery of photo mostly taken in Saint Petersburg by Mikhail Izotov",
}
export default function Layout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <>{children}</>
    )
}