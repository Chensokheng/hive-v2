"use server";

export const sendOtp = async (phoneNumber: string) => {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("content-type", "application/json");

  const raw = JSON.stringify({
    phone: {
      number_phone: phoneNumber.startsWith("0")
        ? phoneNumber.substring(1)
        : phoneNumber,
      country_code: 855,
    },
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow" as RequestRedirect,
  };
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_HIVE_BASE_API +
        "/api/v2/web/user/send-otp-to-sms",
      requestOptions
    );
    const data = (await res.json()) as {
      status: boolean;
      data: {
        message: string;
        is_sent: boolean;
        next_available_otp_at: number;
      };
    };
    return data;
  } catch {
    return {
      status: false,
      data: {
        message: "Error sending OTP",
        is_sent: false,
        next_available_otp_at: 0,
      },
    };
  }
};
