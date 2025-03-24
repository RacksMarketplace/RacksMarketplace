import { useState, useEffect } from "react";

const API_URL = "https://yourbackend.onrender.com/products"; // Replace with your actual backend URL

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedPrice, setEditedPrice] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch products");
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete product");
            fetchProducts(); // Refresh products list
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    const startEditing = (product) => {
        setEditingProduct(product.id);
        setEditedName(product.name);
        setEditedPrice(product.price);
        setEditedDescription(product.description);
    };

    const saveEdit = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: editedName,
                    price: editedPrice,
                    description: editedDescription
                })
            });
            if (!response.ok) throw new Error("Failed to update product");

            setEditingProduct(null);
            fetchProducts(); // Refresh products list
        } catch (err) {
            console.error("Error updating product:", err);
        }
    };

    return (
        <div>
            <h2>Marketplace Products</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {products.length === 0 ? (
                    <p>No products available</p>
                ) : (
                    products.map(product => (
                        <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px" }}>
                            <img 
                                src={product.image_url ? `${API_URL}${product.image_url}` : "https://via.placeholder.com/150"} 
                                alt={product.name} 
                                width="100%" 
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
                                    <button onClick={() => startEditing(product)}>Edit</button>
                                    <button onClick={() => deleteProduct(product.id)} style={{ color: "red" }}>Delete</button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
