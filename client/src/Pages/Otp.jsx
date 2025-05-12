import React, { useState } from "react";
import { Button } from "../Components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../Components/ui/input-otp";
import { useDispatch } from "react-redux";
import { verifyotp } from "../features/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");

  const handleSubmit = () => {
    console.log("Entered OTP:", otp);
    dispatch(verifyotp({ otp, email }))
      .unwrap()
      .then((res) => {
        console.log("Verification successful", res);
        navigate("/auth");
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="bg-black w-full min-h-screen flex flex-col justify-center items-center px-4 text-white">
      <div className="flex flex-col gap-2 mb-8 max-w-md text-center w-full sm:w-96">
        <h3 className="text-2xl sm:text-3xl font-semibold">
          OTP has been sent to {email}
        </h3>
        <p className="text-sm sm:text-lg">
          Please do not close this page. Enter the 6-digit code below to verify.
        </p>
        <p className="text-xs sm:text-sm text-gray-400 mt-2">
          Didn't receive it? Check your spam or junk folder.
        </p>
      </div>

      <InputOTP
        type="text"
        maxLength={6}
        value={otp}
          pattern="[A-Za-z0-9]*"
        onChange={(val) => setOtp(val)}
        aria-label="OTP Input"
        className="w-full"
      >
        <InputOTPGroup className="flex justify-between">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPGroup className="flex justify-between">
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <Button
        className="mt-10 px-6 py-2 text-lg sm:text-xl rounded-lg w-full sm:w-auto"
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </div>
  );
}

export default Otp;
