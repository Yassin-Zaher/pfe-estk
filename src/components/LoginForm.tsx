"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button, buttonVariants } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import { useToast } from "./ui/use-toast";
import { useUser } from "@/context/UserContext";

const LoginForm = ({ form, onLoginSuccess }) => {
  const { toast } = useToast();
  const { setUser } = useUser();
  const [errors, setErros] = useState("");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [formType, setFormType] = useState(form);
  const [isPending, setIsPending] = useState(false);
  const [formData, setFormData] = useState({
    email: "genuisyassine@gmail.com",
    password: "",
    username: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    if (formType === "login") {
      await handleLoginForm();
    } else {
      await handleRegisterForm();
      setFormType("login");
    }
    setIsPending(false);
  };

  const handleLoginForm = async () => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      const data = await response.json();
      setUser(data);
      onLoginSuccess();
      toast({
        title: `Welcome Back ${data.username}`,
        variant: "default",
      });
    } else {
      const error = await response.json();
      setErros(error.message);
      console.error("Login error:", error);
    }
  };

  const handleRegisterForm = async () => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Registered user:", data.user);
    } else {
      const error = await response.json();
      setErros(error.message);
      console.error("Registration error:", error);
    }
  };
  return (
    <div className="mx-4">
      {errors ? (
        <div
          class="bg-red-100 border my-3 border-red-400 text-red-700 px-4 py-4 rounded relative"
          role="alert"
        >
          <strong class="font-bold">Invalid credentials!</strong>
          <span class="block sm:inline">
            Please check your username and password and try again.
          </span>
        </div>
      ) : null}
      <form>
        {formType === "signup" ? (
          <Input
            className="my-4"
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        ) : null}

        <Input
          value={formData.email}
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Input
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="my-4"
          type="password"
          placeholder="******"
        />

        <Button
          isLoading={isPending}
          disabled={formData.email === "" || formData.password === ""}
          loadingText="Signing in"
          size="sm"
          onClick={handleSubmit}
          className="w-full"
        >
          {formType === "signup" ? "Sign Up" : "Login"}
        </Button>
        {formType === "login" ? (
          <p className="my-4">
            don't have an account{" "}
            <span
              onClick={() => setFormType("signup")}
              className="text-green-600 cursor-pointer"
            >
              sign up
            </span>
          </p>
        ) : (
          <p className="my-4">
            have an account{" "}
            <span
              onClick={() => setFormType("login")}
              className="text-green-600 cursor-pointer"
            >
              login
            </span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
