import { useState, useEffect, useContext } from "react";
import UserContext from "../context/UserContext";
import Image from "next/image";
const API_URL = "https://racksmarketplace.onrender.com/products"; // Replace with actual backend URL

export default function ProductList() {
    const { user } = useContext(UserContext);
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

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // ✅ Fixed
    

    const fetchProducts = async () => {
        let url = `${API_URL}?search=${search}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const deleteProduct = async (id) => {
        if (!user) return alert("You must be logged in to delete a product.");
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Failed to delete product");
            fetchProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    const startEditing = (product) => {
        if (!user || user.id !== product.user_id) {
            return alert("You are not authorized to edit this product.");
        }
        setEditingProduct(product.id);
        setEditedName(product.name);
        setEditedPrice(product.price);
        setEditedDescription(product.description);
    };

    const saveEdit = async (id) => {
        if (!user) return alert("You must be logged in to edit a product.");

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editedName,
                    price: editedPrice,
                    description: editedDescription
                })
            });
            if (!response.ok) throw new Error("Failed to update product");

            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            console.error("Error updating product:", err);
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products.map(product => (
                        <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
                            <Image 
    src={product.image_url ? `${API_URL}${product.image_url}` : "https://via.placeholder.com/150"} 
    alt={product.name} 
    width={150} 
    height={150} 
    style={{ borderRadius: "8px" }}
/>
                            {editingProduct === product.id ? (
                                <>
                                    <input type="text" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                                    <input type="number" value={editedPrice} onChange={(e) => setEditedPrice(e.target.value)} />
                                    <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
                                    <button onClick={() => saveEdit(product.id)}>Save</button>
                                    <button onClick={() => setEditingProduct(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <h3>{product.name}</h3>
                                    <p><strong>Price:</strong> ${product.price}</p>
                                    <p>{product.description}</p>
                                    {user && user.id === product.user_id && (
                                        <>
                                            <button onClick={() => startEditing(product)}>Edit</button>
                                            <button onClick={() => deleteProduct(product.id)} style={{ color: "red" }}>Delete</button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
