import axios from "axios";
import type { IPins } from "@/interfaces/IPins";


const getAllPins = async (): Promise<IPins[]> => {
  try {
    const response = await axios.get("http://localhost:3000/pin");
    return response.data;
  } catch (error) {
    console.error("Error getting pins: ", error);
    return [];
  }
};

export default getAllPins;
