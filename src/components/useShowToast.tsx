import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useCallback } from "react";

export const useShowToast = () => {
    const toast = useToast();

    const showToast = useCallback(
        (title:string, description:string, status:UseToastOptions["status"]) => toast({
            title, 
            description,
            status,
            duration: 4000,
            isClosable: true
        }),
        [toast]
    );

    return showToast;
}