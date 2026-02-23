import { Card, CardContent } from "@repo/ui/card";

interface Athlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  profile: string;
  profile_medium: string;
}

interface AthleteProfileProps {
  athlete: Athlete;
  onLogout: () => void;
}

export const AthleteProfile = ({ athlete, onLogout }: AthleteProfileProps) => {
  const getInitials = () => {
    return `${athlete.firstname?.[0] || ""}${athlete.lastname?.[0] || ""}`.toUpperCase();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none";
    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = "flex";
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <img
                src={athlete.profile_medium || athlete.profile}
                alt={`${athlete.firstname} ${athlete.lastname}`}
                className="w-16 h-16 rounded-full border-2 border-orange-500 object-cover"
                onError={handleImageError}
              />
              <div
                className="hidden w-16 h-16 rounded-full border-2 border-orange-500 bg-orange-500 items-center justify-center text-white font-bold text-xl"
                style={{ display: "none" }}
              >
                {getInitials()}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {athlete.firstname} {athlete.lastname}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                @{athlete.username}
              </p>
              {athlete.city && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {athlete.city}
                  {athlete.state && `, ${athlete.state}`}
                  {athlete.country && ` • ${athlete.country}`}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-2 py-1.5 text-md font-medium text-gray-200 bg-gray-500 rounded-xl transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
