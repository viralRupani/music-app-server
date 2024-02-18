const generateOtp = (): Promise<string> => {
  return new Promise((resolve) => {
    const otp: string = String(
      Math.floor(1000 + Math.random() * 900000),
    ).padStart(6, String(Math.floor(Math.random() * 9)));
    resolve(otp);
  });
};

export default generateOtp;
