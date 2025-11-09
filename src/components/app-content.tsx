import { useTabStore } from '@/stores/useTabStore';
import DashboardPage from './dashboard-page';
import ClassDashboard from './class-page';
import CreatePage from './create-page';
import CreateExamPage from './create-exam-page';

const AppContent = () => {

    const { tab } = useTabStore();

    const renderContent = () => {
        switch (tab) {
            case 'dashboard':
                return <DashboardPage />;
            case 'class':
                return <ClassDashboard />;
            case 'create':
                return <CreatePage />
            case 'create_exam':
                return <CreateExamPage />
            default:
                return <DashboardPage />;
        }
    };

    return (
        <div>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                    <div className="bg-muted/50 aspect-video rounded-xl" />
                </div>

                <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}

                {renderContent()}
            </div>
        </div>
    )
}

export default AppContent
