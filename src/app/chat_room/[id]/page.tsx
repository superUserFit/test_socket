"use client";

import { 
    Button, 
    Flex, 
    Text,
    Box,
    VStack,
    Input
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";

import { useSocket } from "@/context/socket/SocketContext";
import { useState } from "react";


const ChatRoom = () => {
    const router = useRouter();
    const { id } = useParams();
    const { socket } = useSocket();

    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState("");

    const handleLeave = () => {
        const message = JSON.stringify({
            action: 'leaveChatRoom',
            room: id
        });

        socket.send(message);
        router.back();
    };


    const handleSendMessage = () => {
        const message = JSON.stringify({
            action: 'sendMessage',
            room: id
        });

        socket.send(message);
    }


    return (
        <Flex
            direction="column"
            justifyContent="space-between"
            alignItems="center"
            minH="100vh"
            minW="100vw"
            p={4}
            bg="gray.50"
        >
            <Box w="full" mb={4}>
                <Text fontSize="2xl" mb={2}>
                    Chat Room: {id}
                </Text>
                <Button onClick={handleLeave} colorScheme="red" mb={4}>
                    Leave
                </Button>
            </Box>
            <VStack
                spacing={3}
                align="stretch"
                w="full"
                overflowY="auto"
                maxH="60vh"
                border="1px"
                borderColor="gray.300"
                borderRadius="md"
                p={4}
                bg="white"
            >
                {messages.map((msg) => (
                    <Box
                        key={msg.id}
                        bg="blue.100"
                        p={3}
                        borderRadius="md"
                    >
                        <Text>{msg.text}</Text>
                    </Box>
                ))}
            </VStack>
            <Flex mt={4} w="full">
                <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your message..."
                    mr={2}
                />
                <Button colorScheme="teal" onClick={handleSendMessage}>
                    Send
                </Button>
            </Flex>
        </Flex>
    );
}

export default ChatRoom;