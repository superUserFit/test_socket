import { Flex, Text } from "@chakra-ui/react";
import { useRouter } from 'next/router';


export const ChatRoom = () => {
    const router = useRouter();
    const { id } = router.query;

    if(router.isFallback) {
        return <Text>Loading...</Text>
    }

    return (
        <Flex
            justifyContent={"center"}
            alignItems={"center"}
            minH={"100vh"}
            minW={"100vw"}
        >
            <Text>{id}</Text>
        </Flex>
    );
}