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
    }, [fetchProducts]);

    return (
        <div>
            <h2>Marketplace Products</h2>

            {/* ✅ Search and Filters */}
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Gaming">Gaming</option>
                </select>
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="">Sort By</option>
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                </select>
            </div>

            {/* ✅ Product Listings */}
            <div className="product-grid">
                {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            <Image
                                src={product.image_url || "https://via.placeholder.com/150"}
                                alt={product.name}
                                width={300}
                                height={200}
                            />
                            <h3>{product.name}</h3>
                            <p className="price">${product.price}</p>
                            <p>{product.description}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
