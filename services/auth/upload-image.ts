export interface UploadResponse {
  status: boolean;
  message: string;
  data: {
    address: string;
    file_name: string;
  }[];
}

export default async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    "https://api-truemoney-stg.savyu.com/api/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return response.json();
}
