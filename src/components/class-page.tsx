import { useTabStore } from '@/stores/useTabStore'
import React from 'react'

const ClassPage = () => {

    const { cls } = useTabStore();

    return (
        <div>
            {cls}
        </div>
    )
}

export default ClassPage
