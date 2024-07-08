import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const LeaderboardPage = () => {
  const [leaderboardPeriod, setLeaderboardPeriod] = useState('daily');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  useEffect(() => {
    fetchLeaderboardData();
  }, [leaderboardPeriod]);

  const fetchLeaderboardData = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const response = await fetch(
        `/api/leaderboard?period=${leaderboardPeriod}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  return (
    <section className="mt-8 max-w-4xl mx-auto bg-gradient-to-br from-purple-900 to-indigo-900 rounded-xl shadow-2xl overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <h2 className="text-3xl font-bold font-orbitron text-white mb-4">
          Leaderboard
        </h2>
        <div className="flex space-x-2 mb-4">
          {['daily', 'weekly', 'monthly'].map((period) => (
            <button
              key={period}
              onClick={() => setLeaderboardPeriod(period)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                leaderboardPeriod === period
                  ? 'bg-white text-purple-700 shadow-lg transform scale-105'
                  : 'bg-purple-800 text-white hover:bg-purple-700'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {isLoadingLeaderboard ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-800 text-white">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Points
                </th>
              </tr>
            </thead>
            <tbody className="bg-purple-900 bg-opacity-50 divide-y divide-purple-700">
              {leaderboardData.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-purple-800 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.name || 'Anonymous'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    @{user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-purple-300">
                    {user.total_points.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default LeaderboardPage;
