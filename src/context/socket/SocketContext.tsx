import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atom/userAtom";


interface SocketContextProviderProps {
    children: ReactNode;
}


interface SocketContextType {
    socket: WebSocket|null,
    user: null
}

const SocketContext = createContext<SocketContextType | null>(null);


export const useSocket = () => {
    return useContext(SocketContext);
}


export const SocketContextProvider:React.FC<SocketContextProviderProps>  = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket|null>(null);
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        const newSocket = new WebSocket("ws://localhost:5050");
        setSocket(newSocket);

        return () => {
            newSocket.close();
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket, user }}>
            {children}
        </SocketContext.Provider>
    );
}
