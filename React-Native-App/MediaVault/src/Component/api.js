
const BASE_URL = "https://media-vault-app.vercel.app/api";

// Function to handle login API call
const login = async (username, password) => {
    try {
        // console.log(`${BASE_URL}/auth/login`, "cred :", username, password);
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        });
        // console.log("Success", response);
        if (response.ok) {
            // console.log("Ok Login Res")
            const result = await response.json();
            // console.log("Success", result);
            return result; // You may want to return relevant data from the response
        } else {
            console.log("Not So Ok Login Res")
            const errorResult = await response.json();
            throw new Error(errorResult.message); // You can handle error messages as needed
        }
    } catch (error) {
        console.log("Not Ok Login Res");
        throw new Error("Error during login:", error.message);
    }
};

const signup = async (name, username, password) => {
    // console.log("cred :", email, password);
    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                username: username,
                password: password,
            }),
        });

        if (response.ok) {
            const result = await response.json();
            return result; // You may want to return relevant data from the response
        } else {
            const errorResult = await response.json();
            throw new Error(errorResult.message); // You can handle error messages as needed
        }
    } catch (error) {
        throw new Error("Error during login:", error.message);
    }
};

const fetchMedia = async (auth) => {
    try {
        const response = await fetch(`${BASE_URL}/media/get-media`, {
            headers: {
                Authorization: `Bearer ${auth}`, // Replace with actual token
            },
        });

        let data = response.json()
        // console.log("Data from fetch media : ", data);
        return data;
    } catch (error) {
        console.error('Error fetching media:', error);
    }
};

const verifyToken = async (auth) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/verify-token`, {
            headers: {
                Authorization: `Bearer ${auth}`, // Replace with actual token
            },
        });

        console.log("token :", auth);
        let data = response.json()
        return data;
    } catch (error) {
        console.error('Error fetching media:', error);
    }
};

const deleteMedia = async (auth, mediaId) => {
    try {
        const response = await fetch(`${BASE_URL}/media/del-media/${mediaId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${auth}`,
            },
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error deleting media:', error);
        return { success: false, message: 'Error deleting media.' };
    }
};



export {
    login,
    signup,
    fetchMedia,
    verifyToken,
    deleteMedia
};