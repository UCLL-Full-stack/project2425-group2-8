const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const getAllUsers = async (token: string) => {
  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const users = await response.json();
    console.log(users);

    return users.map((user: any) => ({
      id: user.id,
      username: user.username,
      firstName: user.profile.firstName,
      lastName: user.profile.lastName,
      email: user.profile.email,
      role: user.role,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const getUserById = async (userId: number, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

const getUserProfile = async (token: string) => {
  try {
    const response = await fetch(`${apiUrl}/profiles`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

const updateUserProfile = async (profileData: any, token: string) => {
  try {
    const response = await fetch(`${apiUrl}/profiles`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

const UserService = {
  getAllUsers,
  getUserById,
  getUserProfile,
  updateUserProfile,
};

export default UserService;
