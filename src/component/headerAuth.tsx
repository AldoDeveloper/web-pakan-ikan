import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import React from 'react';
import { ContextUserAuth } from '../../layout/layoutContextDasboard';
import { Avatar } from 'primereact/avatar'
import { Button } from 'primereact/button'
import { useCookie } from 'next-cookie'
import { useRouter } from 'next/router';

export default function HeaderLayoutAuth() {

    const user = React.useContext(ContextUserAuth);
    const cookie = useCookie();
    const router = useRouter();

    const ComponentStart = () => {
        return (
            <div className="flex gap-4">
                <img src='/images/logo-fish.png' className='mx-auto' height={50} />
                <span className='align-self-center' style={{ fontWeight: "bold", fontSize: "18px" }}>
                    Web Pakan Ikan
                </span>
            </div>
        )
    }

    const handleLogout = async () => {
        cookie.remove('access_token');
        router.push('/auth/login');
    }

    const ComponentEnd = () => {
        if (user !== null) {
            return (
                <div className='flex gap-3'>
                    <Avatar
                        label={`${user.name?.substring(0, 1).toUpperCase()}`}
                        size="normal"
                        className='align-self-center'
                        style={{ backgroundColor: '#4caf4f', color: '#ffffff' }}
                        shape="circle" />
                    <p className='align-self-center'>{user?.email}</p>
                    <Button
                        severity='danger'
                        label='Logout'
                        rounded 
                        onClick={handleLogout}
                        style={{ fontSize: '12px' }}
                        size='small'
                        icon={"pi pi-sign-out"} />
                </div>
            )
        }
        return <></>
    }
    return (
        <React.Fragment>
            <Menubar
                style={{ borderRadius: 'none' }}
                start={ComponentStart}
                end={ComponentEnd} />
        </React.Fragment>
    )
}