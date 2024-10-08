import useTokenStore from "../store/useTokenStore";
import apiClient from "../api/apiClient";

export const fetchRoomData = async (id) => { // 추천 위치
    try {
      const response = await apiClient.get("/api/rooms/myRooms/" + id);
      const data = await response.data;
      console.log("fetchRoomData: ", response)
      return data;
    } catch (error) {
      console.error("Error fetching room data", error);
      throw error;
    }
  };

  export const fetchUserData = async (id) => { // 추천 위치
    try {
      const response = await apiClient.get("/api/user/" + id);
      console.log("fetchUserData: ", response)
      const data = await response.data;
      return data;
    } catch (error) {
      console.error("Error fetching user data", error);
      throw error;
    }
};