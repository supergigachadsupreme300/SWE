import React from 'react';

export default async function ProductsPage() {
    // Thay localhost bằng 127.0.0.1 để fix lỗi fetch của Node.js
    const res = await fetch('http://127.0.0.1:8000/products', {
        cache: 'no-store'
    });

    const products = await res.json();

    return (
        <div className= "p-8" >
        <h1 className="text-3xl font-bold mb-6" > Menu Đồ Uống BrewLite </h1>

    {
        products.length === 0 ? (
            <p className= "text-gray-500" > Menu hiện đang trống.Hãy thêm dữ liệu vào database! </p>
      ) : (
            <ul className= "grid grid-cols-1 md:grid-cols-3 gap-6" >
            {
                products.map((product: any) => (
                    <li key= { product.id } className = "border p-4 rounded-lg shadow-md" >
                    <h2 className="text-xl font-semibold" > { product.name } </h2>
                < p className = "text-blue-600 font-medium" > { product.price } VNĐ </p>
                </li>
                ))
            }
            </ul>
      )
    }
    </div>
  );
}