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
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "@/context/atom/userAtom";


const ChatRoom = () => {
    const router = useRouter();
    const user = useRecoilValue(userAtom);
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
        if(text.trim() !== "") {
            setMessages([...messages, { id: 'ID', text: text, sender: user.id}]);
            setText("");
        }

        socket.send(JSON.stringify({
            Authorization: "Basic Auth",
            action: "sendMessage",
            message: {
                text: text,
                sender: user.id
            }
        }));
    }

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);

            if (data.action === "sendMessage") {
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { id: data.message.id, text: data.message.text, sender: data.message.sender }
                ]);
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket]);



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

            {/* Message display area */}
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
                {messages.map((message) => {
                    console.log('Sender: ', message.sender);
                    return(
                        <Flex
                        key={message.id}
                        justify={message.sender === user.id ? 'flex-end' : 'flex-start'}
                    >
                        <Box
                            bg={message.sender === user.id ? 'blue.200' : 'gray.200'}
                            p={3}
                            borderRadius="md"
                            maxW="70%"
                            alignSelf={message.sender === user.id ? 'flex-end' : 'flex-start'}
                        >
                            <Text>{message.text}</Text>
                        </Box>
                    </Flex>
                    );
                })}
            </VStack>

            {/* Message input and send button */}
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