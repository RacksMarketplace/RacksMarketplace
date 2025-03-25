import { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "../context/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
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
    const [editingProduct, setEditingProduct] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedPrice, setEditedPrice] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    const fetchProducts = useCallback(async () => {
        try {
            const query = `${API_URL}?search=${search}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`;
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
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Marketplace Products</h2>
            <div className="flex gap-4 mb-4">
                <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Home & Living">Home & Living</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                </Select>
                <Input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <Input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <SelectItem value="">Sort By</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {products.length === 0 ? (
                    <p>No products found</p>
                ) : (
                    products.map((product) => (
                        <Card key={product.id}>
                            <CardHeader>
                                <Image
                                    src={product.image_url || "https://via.placeholder.com/150"}
                                    alt={product.name}
                                    width={200}
                                    height={200}
                                    className="rounded-lg"
                                />
                                <CardTitle>{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-semibold">${product.price}</p>
                                <p>{product.description}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
