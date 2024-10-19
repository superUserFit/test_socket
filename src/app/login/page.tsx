"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import Cookies from "js-cookies";

import { useShowToast } from "../../components/useShowToast";
import { useAxios } from "@/components/axios";
import { redirect, useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";
import userAtom from "../../context/atom/userAtom";


const Login = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const setUser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const router = useRouter();
  const axios = useAxios();

  // Validate the email and password fields
  const validate = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (!loginData.username) {
      newErrors.username = "Email is required";
      valid = false;
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const formData = new FormData();

    formData.append('username', loginData.username);
    formData.append('password', loginData.password);

    try {
      const response = await axios.post('/site/api/site/login', formData);
      const data = JSON.stringify(response.data.data);

      setUser(data);
      Cookies.setItem("user", data);
      showToast('Success', 'Login successfully', 'success');
      router.push('/');
      // redirect('/');
    } catch (error) {
      if(error instanceof AxiosError) {
        const errorMessage = error.response?.data;
        showToast(errorMessage.name, errorMessage.message, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" minW="100vw">
      <Box
        bg="white"
        p={8}
        maxW="sm"
        borderRadius="lg"
        boxShadow="lg"
        w="full"
      >
        <Heading as="h1" size="lg" textAlign="center" mb={6}>
          Login
        </Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="flex-start">
            {/* Email Input */}
            <FormControl isInvalid={!!errors.username}>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData((loginData) => ({...loginData, username: e.target.value}))}
              />
              {errors.username && (
                <FormErrorMessage>{errors.username}</FormErrorMessage>
              )}
            </FormControl>

            {/* Password Input */}
            <FormControl isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData((loginData) => ({...loginData, password: e.target.value}))}
              />
              {errors.password && (
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              )}
            </FormControl>

            {/* Login Button */}
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}


export default Login;