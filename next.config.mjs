/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'instagram.ftrv3-1.fna.fbcdn.net',
            },
            {
                protocol: 'https',
                hostname: '**.fbcdn.net',
            },
            {
                protocol: 'https',
                hostname: '**.instagram.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'www.google.com',
            },
            {
                protocol: 'https',
                hostname: '**.google.com',
            },
        ],
    },
};

export default nextConfig;
