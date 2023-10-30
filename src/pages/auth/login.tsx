import React from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import Link from 'next/link'
import { configData } from "../../../config";
import { Toast } from 'primereact/toast'
import { useRouter } from 'next/router'
import { useCookie } from 'next-cookie'
import Head from "next/head";
const url_backend = configData.API_BACKEND;

export default function Login() {

    const refToast  = React.useRef<Toast>(null);
    const [disable, setDisable] = React.useState(false)
    const router = useRouter();
    const cookie = useCookie();

    const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setDisable(true)
        const formData   = new FormData(ev.target as HTMLFormElement);
        const bodyLogin  = Object.fromEntries(formData.entries());
        const loginFetch = await fetch(`${url_backend}/login`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyLogin)
        });

        if(loginFetch.ok){
            const responseSucces = await loginFetch.json();
            cookie.set('access_token', responseSucces?.token, {
                path: "/"
            })
            setDisable(false)
            refToast.current?.show({
                severity: "success",
                summary: "Login Account",
                detail: "Login Account Berhasil"
            });
            return router.push('/pakan-ikan/dasboard')
        }

        if(!loginFetch.ok){
            const failedLogin = await loginFetch.json();
            setDisable(false)
            refToast.current?.show({
                severity: "error",
                summary: "Login Account",
                detail: `Login Gagal ${failedLogin?.message}`
            })
        }
    }
    return (
        <React.Fragment>
            <Toast ref={refToast}/>
            <Head>
                <title>Login Pakan Ikan</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <form onSubmit={handleSubmit}>
                <div className="grid p-fluid">
                    <div className="col-12">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="username">Username</label>
                            <InputText
                                type="email"
                                placeholder="Masukan Username"
                                id="username"
                                name="username"
                                aria-describedby="username-help" />
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="username">Password</label>
                            <span className="p-input-icon-right">
                                <i className="pi pi-eye" />
                                <InputText
                                    type="password"
                                    name="password"
                                    placeholder="Masukan Password" />
                            </span>
                        </div>
                        <div className="flex justify-content-end mt-2">
                            <Link href={'/'} className="no-underline">
                                <span><small className="text-600">Forgot Password</small></span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-12">
                        <Button
                            rounded
                            disabled={disable}
                            type="submit"
                            label="Masuk"
                            size="small" />
                    </div>
                </div>
            </form>
        </React.Fragment>
    )
}

Login.getLayoutAuth = function (page: React.ReactElement) {
    return page;
}