"use client"

import { verificaTokenExpirado } from "@/src/services/token/token"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export interface IToken {
    accessToken: string
}

export default function Usuarios() {

    const router = useRouter()

    useEffect(() => {
        let lsToken = localStorage.getItem('painel1pitchau.token')

        let token: IToken | null = null

        if (typeof lsToken === 'string') {
            token = JSON.parse(lsToken)
        }

        if (!token  || verificaTokenExpirado(token.accessToken)) {

            router.push('/?teste=123')
        }

    }, [])

    return (
        <h1 style={{
            color: 'red'
        }}>Usuarios</h1>
    );
}
