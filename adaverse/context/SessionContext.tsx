'use client';
import {createContext, ReactNode, useContext} from "react";

type SessionContextType = {
    session: any;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({
    children,
    session
}: {
    children: ReactNode;
    session: any;
}) {
    return (
        <SessionContext.Provider value={{session}}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}  