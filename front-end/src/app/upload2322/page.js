"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Cookies from "js-cookie";
import "../globals.css"
import Image from "next/image";
const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setname] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { push } = useRouter();
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!email || !name || !password || !username) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Prepare user data
    const userData = {
      email,
      name,
      password,
      username,
    };

    try {
      // Send registration data to the API
      const response = await fetch(
        "http://localhost:3000/api/videos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      // Handle API response
      const data = await response.json();
      if (response.ok) {
        setMessage("Registration successful! Please log in.");
        Cookies.set("accessToken", data.user.token);
        Cookies.set("username", data.user.username);
        Cookies.set("userID", data.user.id);
        Cookies.set("name", data.user.name);
        push("/library");
      } else {
        setMessage(`Registration failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("An error occurred during registration. Please try again.");
    }
  };
  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <label htmlFor="video" className="mx-2 flex items-center w-full justify-center rounded-md bg-indigo-600 pl-3 pr-5 py-1.5 font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer">
               <Image src="/icons/upload-white.png" alt="upload icon" width={30} height={30} className="mr-2" />
               Video
               <input
                  type="file"
                  id="video"
                  name="video"
                  accept="video/mp4" // video type
                  hidden
               />
            </label>
            <label htmlFor="thumbnail" className="pl-10 pr-16 mx-2 flex items-center rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 border-[1px] hover:border-gray-500 cursor-pointer">
               <Image src="/icons/picture.png" alt="picture icon" width={30} height={30} className="mr-2" />
               Thumbnail
               <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  accept="image/jpg" // thumbnail image type
                  hidden
               />
            </label>
          <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
            Register Now!
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" method="POST" onSubmit={handleRegister}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                User name:
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  onChange={(e) => setUserName(e.target.value)}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  onChange={(e) => setname(e.target.value)}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </form>
          {message && <p>{message}</p>}

          <p className="mt-10 text-center text-sm text-gray-500">
            Have an Account?{" "}
            <Link
              href="/signIn"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
