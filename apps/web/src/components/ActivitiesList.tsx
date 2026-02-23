import { useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@repo/ui/card";
import { Separator } from "@repo/ui/Separator";

interface Activity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  type: string;
  start_date_local: string;
  average_speed: number;
  kudos_count: number;
}

interface ActivitiesListProps {
  activities: Activity[];
  onFetchActivities: () => void;
}

const formatDistance = (meters: number) => {
  const km = meters / 1000;
  return `${km.toFixed(2)} km`;
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const formatSpeed = (metersPerSecond: number) => {
  const kmPerHour = metersPerSecond * 3.6;
  return `${kmPerHour.toFixed(1)} km/h`;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "Run":
      return "🏃";
    case "Ride":
      return "🚴";
    case "Swim":
      return "🏊";
    case "Walk":
      return "🚶";
    case "Hike":
      return "🥾";
    case "Workout":
      return "💪";
    default:
      return "📊";
  }
};

export const ActivitiesList = ({
  activities,
  onFetchActivities,
}: ActivitiesListProps) => {
  useEffect(() => {
    onFetchActivities();
  }, [onFetchActivities]);

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No activities found. Start tracking your workouts on Strava!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>

      <Separator />

      <div className="p-4 flex flex-col gap-2">
        {activities.map((activity) => (
          <Card
            key={activity.id}
            hover
            className="border border-gray-200 dark:border-gray-700"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {getActivityIcon(activity.type)}
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {activity.name}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.type}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {formatDate(activity.start_date_local)}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        Distance:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDistance(activity.distance)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        Time:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDuration(activity.moving_time)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-gray-500 dark:text-gray-400">
                        Pace:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatSpeed(activity.average_speed)}
                      </span>
                    </div>

                    {activity.total_elevation_gain > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 dark:text-gray-400">
                          Elevation:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {Math.round(activity.total_elevation_gain)}m
                        </span>
                      </div>
                    )}

                    {activity.kudos_count > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-500 dark:text-gray-400">
                          ❤️
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {activity.kudos_count}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Card>
  );
};
