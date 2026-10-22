import React from 'react';
import Link from 'next/link';

export default async function ProductsPage() {
    // Thay localhost bằng 127.0.0.1 để fix lỗi fetch của Node.js
    const res = await fetch('http://127.0.0.1:8000/products', {
        cache: 'no-store'
    });

    const products = await res.json();

    return (
        <div className= "max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen" >
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800" > Menu Đồ Uống BrewLite </h1>

    {
        products.length === 0 ? (
            <p className= "text-gray-500 text-center" > Menu hiện đang trống.Hãy thêm dữ liệu vào database! </p>
            ) : (
            <div className= "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" >
            {
                products.map((product: any) => (
                    <Link href= {`/products/${product.id}`} key = { product.id } >
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-green-600 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full" >
                            <h2 className="text-xl font-semibold text-gray-800" > { product.name } </h2>

                                < div className = "mt-4 flex items-center justify-between" >
                                    <span className="text-green-700 font-bold text-lg" >
                                    { product.price.toLocaleString('vi-VN') } VNĐ
                                        </span>
                                        < span className = "text-sm text-gray-500 underline decoration-gray-300" >
                                            Chọn & gt;
        </span>
            </div>
            </div>
            </Link>
                    ))
    }
    </div>
            )
}
</div>
    );
}