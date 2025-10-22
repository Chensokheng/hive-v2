export interface UpdateProfilePayload {
  fullName?: string;
  email?: string | null;
  birthdate?: string | null;
  user_id: number;
  gender?: number;
  image_path?: string;
  image_name?: string;
}

export interface UpdateProfileResponse {
  status: boolean;
  message: string;
  error_message?: string;
  data?: any;
}

export default async function updateProfile(
  payload: UpdateProfilePayload,
  token: string
): Promise<UpdateProfileResponse> {
  const response = await fetch(
    "https://api-truemoney-stg.savyu.com/api/web/consumer/giaodoan/profile",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  return response.json();
}
