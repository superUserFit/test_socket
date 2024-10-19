"use client";

import { Container, Flex, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../context/atom/userAtom";
import { redirect, useRouter } from "next/navigation";
import { ChatPage } from "./pages/chat_room/page";



export default function Home() {
  const user = useRecoilValue(userAtom);
  const router = useRouter();

  useEffect(() => {
    if(!user) {
      // redirect('/login');
      router.push('/login');
    }
  }, [user]);


  return (
    <Container>
      <Flex justifyContent={"center"} alignItems={"center"}>
        <ChatPage/>
      </Flex>
    </Container>
  );
}
