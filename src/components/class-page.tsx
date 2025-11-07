import { useTabStore } from '@/stores/useTabStore'

const ClassPage = () => {

    const { cls } = useTabStore();

    return (
        <div>
            {cls}
        </div>
    )
}

export default ClassPage
