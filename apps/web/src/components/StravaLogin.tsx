interface StravaLoginProps {
  onLogin: () => void;
}

export const StravaLogin = ({ onLogin }: StravaLoginProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 mb-4 text-orange-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
          </svg>
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            Strava Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
            Connect your Strava account to track and analyze your activities
          </p>

          <button
            onClick={onLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
            </svg>
            Connect with Strava
          </button>

          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            You'll be redirected to Strava to authorize this application
          </p>
        </div>
      </div>
    </div>
  );
};
