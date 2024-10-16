/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects: async () => {
        return [
            {
                source: '/:path*',
                has: [{ type: 'header', key: 'host', value: 'www.exhale.pics' }],
                destination: 'https://exhale.pics/:path*',
                permanent: true
            }
        ]
    }
}

export default nextConfig
