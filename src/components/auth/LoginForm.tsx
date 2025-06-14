"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/assets/icons";
import React, { useState, useEffect } from "react";
import AuthenService from "@/services/auth.service";
import { LoginPayload } from "@/modules/auth/auth.module";
import { appRouter } from "@/hooks/useAppRouter";
import Toast, { ToastInfo, ToastVariant } from "../ui/toast/Toast";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorPayload, setErrorPayload] = useState<LoginPayload>({ username: "", password: "" });
  const [formData, setFormData] = useState<LoginPayload>({ username: '', password: '' });
  const [isSubmit, setIsSubmit] = useState(false);
  const [toastInfo, setToastInfo] = useState<ToastInfo>({ show: false, message: '', variant: ToastVariant.SUCCESS });

  useEffect(() => {
    if (isSubmit) {
      validateInput();
    }
  }, [formData, isSubmit]);

  const validateInput = () => {
    var errorUsername = errorPayload.password;
    if (formData.password.length === 0) {
      errorUsername = "Tài khoản không được để trống!";
    } else {
      errorUsername = "";
    }
    var errorPassword = errorPayload.password;
    if (formData.password.length === 0) {
      errorPassword = "Mật khẩu không được để trống!";
    } else {
      errorPassword = "";
    }
    setErrorPayload((prevErrorPayload) => ({
      ...prevErrorPayload,
      username: errorUsername,
      password: errorPassword,
    }));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);
    if (errorPayload.username || errorPayload.password || !formData.username || !formData.password) {
      return;
    }
    AuthenService.loginRequest(formData)
      .then((res) => {
        if (res) {
          localStorage.setItem("access_token", res.access_token);
          window.location.href = appRouter.home.path;
        }
      }, (err) => {
        setToastInfo({ show: true, message: err?.message || "Đã xảy ra lỗi, vui lòng thử lại sau.", variant: ToastVariant.ERROR })
      });
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your username and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Username <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    name="username"
                    placeholder="Username"
                    type="text"
                    error={!!errorPayload.username}
                    hint={errorPayload.username}
                    defaultValue={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      error={!!errorPayload.password}
                      hint={errorPayload.password}
                      defaultValue={formData.password}
                      onChange={handleChange}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute z-30 -translate-y-1/2 cursor-pointer right-4 
                        ${errorPayload.password ? "top-1/3" : "top-1/2"}`
                      }
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Toast
        variant={toastInfo.variant}
        title="Thông báo"
        message={toastInfo.message}
        show={toastInfo.show}
        onClose={() => setToastInfo({ show: false, message: '', variant: ToastVariant.SUCCESS })}
      />
    </div>
  );
}
