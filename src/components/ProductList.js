import { useState, useEffect } from "react";

const API_URL = "https://racksmarketplace.onrender.com/products"; // Replace with your actual backend URL

export default function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    return (
        <div>
            <h2>Marketplace Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.map(product => (
                    <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
                        <img src={product.image_url || "https://via.placeholder.com/150"} alt={product.name} width="100%" />
                        <h3>{product.name}</h3>
                        <p>Price: ${product.price}</p>
                        <p>{product.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
