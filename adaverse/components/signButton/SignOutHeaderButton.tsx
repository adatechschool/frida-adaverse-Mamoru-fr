'use client'

import { signout } from "@/scripts/actions/signActions"

export function SignOutHeaderButton() {
    return (
        <button
            onClick={async () => {
                await signout();
                window.location.reload();
            }}
        >
            Sign Out
        </button>
    )
}