'use client';

import {useRouter} from "next/navigation";

export default function TitleButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push('/')}
            className="rounded-md px-6 py-3 text-lg lg:text-3xl font-bold transition-all cursor-pointer "
            style={{ color: '#a855f7' }}
        >
            AdaVerse
        </button>
    );
}