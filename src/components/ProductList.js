import { useState, useEffect, useCallback, useContext } from "react";
import { UserContext } from "../context/UserContext"; // ✅ Correct import
import Image from "next/image";

const API_URL = "https://racksmarketplace.onrender.com/products";

export default function ProductList() {
    const { user } = useContext(UserContext) || {}; // ✅ Prevents crashing when `user` is null
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedPrice, setEditedPrice] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    // ✅ Fetch Products
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

    // ✅ Delete Product
    const deleteProduct = async (id) => {
        if (!user) return alert("You must be logged in to delete a product.");
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to delete product");
            fetchProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    return (
        <div>
            <h2>Marketplace Products</h2>

            {/* ✅ Search and Filters */}
            <div>
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
            </div>

            {/* ✅ Product Listings */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
                            <Image
                                src={product.image_url || "https://via.placeholder.com/150"}
                                alt={product.name}
                                width={150}
                                height={150}
                                style={{ borderRadius: "8px" }}
                            />
                            <h3>{product.name}</h3>
                            <p>
                                <strong>Price:</strong> ${product.price}
                            </p>
                            <p>{product.description}</p>
                            {user && user.id === product.user_id && (
                                <>
                                    <button onClick={() => deleteProduct(product.id)} style={{ color: "red" }}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
