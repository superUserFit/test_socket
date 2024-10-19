import userAtom from "@/context/atom/userAtom";
import * as myAxios from "axios";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";


// Function to configure Axios with user authorization headers
export const useAxios = () => {
    const user = useRecoilValue(userAtom);

    // Create an Axios instance
    const axios = myAxios.default.create({
        baseURL: "http://192.168.1.101/1ofis/application/backend",
    });

    useEffect(() => {
        // Add a request interceptor to add Authorization header if the user is authenticated
        axios.interceptors.request.use((config) => {
            if (user && user.access_token) {
                const authorizationHeader = btoa(`${user.username}:${user.access_token}`);
                config.headers['Authorization'] = `Basic ${authorizationHeader}`;
            }
            return config;
        }, (error) => {
            // Handle error here
            return Promise.reject(error);
        });
    }, [user]);

    return axios;
};
