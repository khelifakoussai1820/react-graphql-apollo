const API_URL = "http://localhost:8000/api/v1/auth"

export const register = async(data) => {
    const response = await fetch(`${API_URL}/register`, {
        method:"POST",
        headers:{
            "Content-Type" : "application/json",      
        },
        body: JSON.stringify(data),
    });

    if(!response.ok) {
        const error = await response.json(); 
        throw new Error(error.message || "Register failed");
    }

    return response.json
}