"use client";

import { Button, Card, CardBody, CardHeader, Flex, Link, Text } from "@chakra-ui/react";
import Cookies from "js-cookies";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "../../context/socket/SocketContext";
import { JobOrderHasAssignment } from "../../interfaces/job_order/JobOrderHasAssignment";
import { useAxios } from "@/components/axios";
import { AxiosError } from "axios";
import { useShowToast } from "@/components/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "@/context/atom/userAtom";


const ChatPage = () => {
    const router = useRouter();
    const showToast = useShowToast();
    const { socket } = useSocket();
    const [jobOrderHasAssignments, setJobOrderHasAssignments] = useState<JobOrderHasAssignment[]>([]);
    const user = useRecoilValue(userAtom);
    const axios = useAxios();

    const handleLogout = () => {
        Cookies.removeItem("user");
        router.push('/login');
    }

    const getJobOrderHasAssignmentByUser = async () => {
        const formData = new FormData();

        formData.append('param[sort]', 'createdAtFormat');
        formData.append('param[order]', 'desc');
        formData.append('param[offset]', '0');
        formData.append('param[limit]', '10');

        try {
            const response = await axios.post('/job_order/api/job-order/get-job-order-has-assignment-by-user-2', formData);
            const data = response.data;

            setJobOrderHasAssignments(data.rows);
        } catch(error) {
            if(error instanceof AxiosError) {
                const errorMessage = error.response?.data;

                console.log(errorMessage);
                showToast(errorMessage.name, errorMessage.message, 'error');
            }
        }
    }


    const handleJoinChatRoom = (jobOrderHasAssignment:JobOrderHasAssignment) => {
        const message = JSON.stringify({
            action: 'joinChatRoom',
            room: jobOrderHasAssignment.jobID
        });

        socket.send(message);
        router.push(`/chat_room/${jobOrderHasAssignment.UUID}`);
    }


    useEffect(() => {
        getJobOrderHasAssignmentByUser();
    }, [user]);


    return (
        <Flex
            height={"100vh"}
            width={"100vw"}
            direction="column"
            justifyContent={"center"}
            alignItems={"center"}
            position="relative"
        >
            <Flex direction="column" alignItems="center" justifyContent="center">
                {jobOrderHasAssignments.map((jobOrderHasAssignment) => (
                    <Card
                        key={jobOrderHasAssignment.UUID}
                        width={"70vw"}
                        height={"300px"}
                        display="flex"
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="center"
                        margin={4}
                    >
                        <CardHeader>{jobOrderHasAssignment.jobID}</CardHeader>
                        <CardBody>
                            <Text>{jobOrderHasAssignment.pickupLocation}</Text>
                            <Text>{jobOrderHasAssignment.pickupAddress}</Text>
                            <Button width={"100%"} marginTop={8} onClick={() => handleJoinChatRoom(jobOrderHasAssignment)}>
                                <Text>Join</Text>
                            </Button>
                        </CardBody>
                    </Card>
                ))}
            </Flex>
    
            {/* Fixed Logout Button at the bottom */}
            <Button
                background={"red"}
                color={"white"}
                onClick={handleLogout}
                padding={8}
                width={"100vw"}
                position="fixed"
                bottom={0}
                left={0}
            >
                <Text>Logout</Text>
            </Button>
        </Flex>
    );    
}

export default ChatPage;