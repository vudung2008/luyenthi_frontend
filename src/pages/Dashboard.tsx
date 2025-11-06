
import { useAuthStore } from '@/stores/useAuthStore';
import Logout from '@/components/auth/Logout';

const Dashboard = () => {

    const { user } = useAuthStore();

    return (
        <div>
            User: {user?.username}
            <br />
            <Logout />
        </div>
    )
}

export default Dashboard
