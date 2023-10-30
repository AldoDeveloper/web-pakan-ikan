
import { useCookie } from "next-cookie"
import React from "react"
import { useRouter } from 'next/router'
import { configData } from "../config"
import HeaderLayoutAuth from "@/component/headerAuth";
import { ProgressSpinner } from 'primereact/progressspinner';

const url_backend = configData.API_BACKEND;

interface PropsLayout {
    children?: React.ReactNode | React.ReactElement
}

export interface PropsAuth {
    name?: string,
    email?: string,
    token?: string
    email_verified_at?: string,
    created_at?: string | number
}

export const ContextUserAuth = React.createContext<PropsAuth | null>(null);

export const LoadingComponent = () => {
    return (
        <div
            className="flex justify-content-center align-items-center"
            style={{ height: '100vh' }}>
            <ProgressSpinner
                style={{ width: '60px', height: '60px' }}
                strokeWidth="6" fill="var(--surface-ground)"
                animationDuration=".7s" />
        </div>
    )
}

export default function LayoutContextDasboard({ children }: PropsLayout) {

    const [user, setUser] = React.useState<PropsAuth | null>(null);

    const [redirect, setRedirect] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const cookie = useCookie();
    const router = useRouter();

    const resetPropsData = () => {
        setRedirect(true)
        setLoading(true);
        setTimeout(() => {
            router.push('/auth/login')
        }, 1500)
    }

    React.useEffect(() => {
        if (cookie.has('access_token')) {
            (async () => {
                const token = cookie.get('access_token');
                const protectedUser = await fetch(`${url_backend}/protected/user`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token as any}`,
                        "Content-Type": "application/json"
                    }
                });

                if (protectedUser.ok) {
                    const getUser = await protectedUser.json();
                    const user: PropsAuth = {
                        name: getUser?.full_name,
                        email: getUser?.email,
                        email_verified_at: getUser?.email_verified_at,
                        created_at: Date.now(),
                        token: token as any,
                    }
                    setLoading(true);
                    setUser(user)
                }

                if (!protectedUser.ok && protectedUser.status === 401) {
                    resetPropsData();
                }

                if (protectedUser.status === 403) {
                    if (cookie.has('access_token')) {
                        cookie.remove('access_token', {
                            path: '/'
                        })
                    }
                    resetPropsData();
                    setUser(null);
                }
            })();
        } else {
            resetPropsData();
        }
    }, []);

    if (!loading) return <LoadingComponent/>

    return (
        <React.Fragment>
            {
                redirect ? <LoadingComponent/> : (
                    <ContextUserAuth.Provider value={user as any}>
                        <>
                            <HeaderLayoutAuth />
                            {children}
                        </>
                    </ContextUserAuth.Provider>
                )
            }
        </React.Fragment>
    )
}