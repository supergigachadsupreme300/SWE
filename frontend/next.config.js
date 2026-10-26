/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**', // Dấu ** cho phép lấy ảnh từ bất kỳ trang web nào
            },
        ],
    },
};
module.exports = nextConfig;