const API_URL = "postgresql://marketplace_db_5w2a_user:Eed8FyW4vjqSkJQN4r8gzX9alfkmPmg1@dpg-cvgnb2gfnakc73fg3g3g-a/marketplace_db_5w2a"; // Replace with your actual backend URL

// Fetch all products
export const getProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};

// Fetch a single product
export const getProductById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch product");
        }
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};
