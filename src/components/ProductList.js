import { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "../context/UserContext";
import Image from "next/image";

const API_URL = "https://racksmarketplace.onrender.com/products";

export default function ProductList() {
    const { user } = useContext(UserContext);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");

    const fetchProducts = useCallback(async () => {
        try {
            let query = `${API_URL}?search=${search}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`;
            const response = await fetch(query);
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    }, [search, category, minPrice, maxPrice, sort]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // ✅ Fixes infinite loop issue

    return (
        <div>
            <h2>Marketplace Products</h2>
            <div>
                <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
                            <Image src={product.image_url || "https://via.placeholder.com/150"} alt={product.name} width={150} height={150} />
                            <h3>{product.name}</h3>
                            <p><strong>Price:</strong> ${product.price}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
