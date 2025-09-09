import axios from "axios";
import type { IPins } from "@/interfaces/IPins";
import { apiURL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY } from "../config/config";

export const getAllPins = async (): Promise<IPins[]> => {
  try {
    const response = await axios.get(`${apiURL}/pin`);
    return response.data;
  } catch (error) {
    console.error("Error getting pins:", error);
    return [];
  }
};

export const getCloudinarySignature = async () => {
  const res = await axios.get(`${apiURL}/cloudinary/signature`);
  return res.data; 
};
export const uploadToCloudinary = async (
  file: File,
  signatureData: { signature: string; timestamp: number; folder: string }
) => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY) throw new Error("Faltan variables de entorno de Cloudinary");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", CLOUDINARY_API_KEY);
  formData.append("timestamp", String(signatureData.timestamp));
  formData.append("signature", signatureData.signature);
  formData.append("folder", signatureData.folder);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData
  );

  return res.data; 
};

export const savePin = async (imageUrl: string, description: string) => {
  const res = await axios.post(`${apiURL}/pin`, {
    imageUrl,
    description,
  });
  return res.data;
};