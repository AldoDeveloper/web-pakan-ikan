
import HeaderLayoutAuth from "@/component/headerAuth";
import React from "react";
import { Card } from "primereact/card";
import { useRouter } from 'next/router'
import Link from "next/link";
import { useCookie } from 'next-cookie';
import { LoadingComponent } from "./layoutContextDasboard";
import { configData } from "../config";

interface PropsLayout {
    children?: React.ReactNode | React.ReactElement
}

const url_backend = configData.API_BACKEND;

export default function LayoutContextAuth({ children }: PropsLayout) {
    const cookie = useCookie();
    const router = useRouter();

    const [auth, path] = router.route.substring(1, router.route.length).split('/')
    const [loading, setLoading] = React.useState<boolean>(true);
    const [authh, setAuth] = React.useState<boolean>(true);

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
                    setLoading(false);
                    router.push('/pakan-ikan/dasboard');
                    return;
                }
                setAuth(false);
            })()
        } else {
            setLoading(false)
            setAuth(false);
        }
    }, []);

    if (loading) return <LoadingComponent />

    return (
        <React.Fragment>
            {!authh && (
                <>
                    <HeaderLayoutAuth />
                    <div className="flex justify-content-center align-items-center w-full" style={{ height: "89vh" }}>
                        <div className="grid w-full">
                            <div className="col-12">
                                <div className="grid justify-content-center p-fluid g-7 p-5">
                                    <div className="col-12 md:col-6 align-self-center">
                                        <div className="flex justify-content-center">
                                            <div>
                                                <img src="/images/auth-logo.svg" height={350} alt="auth-logo-data" />
                                                <h2 className="text-center text-700">Authentication</h2>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-6 align-self-center">
                                        <div className="card border-0">
                                            <Card title={path.toUpperCase()} className="w-28rem border-0">
                                                {children}
                                                <div className="text-center mt-2" style={{ fontSize: "12px" }}>
                                                    {
                                                        path.includes("login") ? (
                                                            <React.Fragment>
                                                                Baru di Ar? <span className="text-blue-700">
                                                                    <Link
                                                                        href={'/auth/register'}
                                                                        className="no-underline">Daftar
                                                                    </Link>
                                                                </span>
                                                            </React.Fragment>
                                                        ) : (
                                                            <React.Fragment>
                                                                Sudah Punya Account? <span className="text-blue-700">
                                                                    <Link
                                                                        href={'/auth/login'}
                                                                        className="text-decoration-none">Masuk
                                                                    </Link>
                                                                </span>
                                                            </React.Fragment>
                                                        )
                                                    }
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </React.Fragment>
    )
}