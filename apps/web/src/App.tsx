import { useEffect } from "react";
import { useStrava } from "./hooks/useStrava";
import { StravaLogin } from "./components/StravaLogin";
import { AthleteProfile } from "./components/AthleteProfile";
import { ActivitiesList } from "./components/ActivitiesList";
import "./App.css";
import { Schedule } from "@repo/ui";

// switch over to an I18n
const scheduleMessages = {
  title: "Event Name",
  category: "Category",
  startDate: "Start",
  endDate: "End",
  color: "Color",
  submit: "Submit",
};

function App() {
  const {
    isAuthenticated,
    isLoading,
    athlete,
    activities,
    events,
    error,
    login,
    logout,
    fetchAthlete,
    fetchActivities,
    setEvents,
  } = useStrava();

  useEffect(() => {
    if (isAuthenticated) {
      fetchAthlete();
    }
  }, [isAuthenticated, fetchAthlete]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <StravaLogin onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col gap-6">
        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {athlete && <AthleteProfile athlete={athlete} onLogout={logout} />}
        <Schedule
          dateFormMessages={scheduleMessages}
          workoutCategories={[{ label: "run", id: 1 }]}
          events={events}
          setEvents={setEvents}
        />
        <ActivitiesList
          activities={activities}
          onFetchActivities={fetchActivities}
        />
      </div>
    </div>
  );
}

export default App;
