"use client";

import { Button, Flex, Text } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";


const ChatRoom = () => {
    const router = useRouter();
    const { id } = useParams();

    const handleLeave = () => {
        router.back();
    };


    return (
        <Flex
            justifyContent={"center"}
            alignItems={"center"}
            minH={"100vh"}
            minW={"100vw"}
        >
            <Text>{id}</Text>
            <Button onClick={handleLeave}>
                <Text>Leave</Text>
            </Button>
        </Flex>
    );
}

export default ChatRoom;