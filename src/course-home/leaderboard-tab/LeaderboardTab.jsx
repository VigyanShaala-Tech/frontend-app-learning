import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const LeaderboardTab = () => {
  const { courseId } = useParams();

  const data = useSelector(
    state => state.models?.leaderboard?.[courseId]
  );

  if (!data) {
    return <div style={{ padding: '20px' }}>Loading leaderboard...</div>;
  }

  const top10 = data.leaderboard?.top10 ?? [];
  const currentUser = data.currentUser ?? {};
  const isInTop10 = currentUser.isInTop10;

  return (
    <div style={{ padding: '24px', maxWidth: '950px' }}>
      <h2 style={{ marginBottom: '20px', fontWeight: 600 }}>
        Leaderboard
      </h2>

      {/* Ranking Explanation */}
      <div
        style={{
          marginBottom: '20px',
          padding: '12px 16px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#495057'
        }}
      >
        Ranking is based on total points.  
        If multiple learners have the same points, ranking is determined by who completed earlier.  
        The Top 10 includes the first 10 learners based on this criteria.
      </div>

      {top10.length === 0 ? (
        <p>No leaderboard data available.</p>
      ) : (
        <div style={{ border: '1px solid #dee2e6', borderRadius: '6px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={thStyle}>Rank</th>
                <th style={thStyle}>Student</th>
                <th style={thStyle}>Points</th>
              </tr>
            </thead>
            <tbody>
              {top10.map(user => (
                <tr
                  key={`${user.rank}-${user.displayName}`}
                  style={{
                    backgroundColor: user.isCurrentUser
                      ? '#f1f7ff'
                      : 'transparent',
                    fontWeight: user.isCurrentUser ? 600 : 400,
                  }}
                >
                  <td style={tdStyle}>{user.rank}</td>
                  <td style={tdStyle}>
                    {user.displayName}
                    {user.isCurrentUser && ' (You)'}
                  </td>
                  <td style={tdStyle}>{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Position Section */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '10px' }}>Your Position</h3>

        <div
          style={{
            border: '1px solid #dee2e6',
            borderRadius: '6px',
            padding: '16px',
            backgroundColor: '#fafafa',
          }}
        >
          <div style={{ marginBottom: '6px' }}>
            <strong>Rank:</strong> {currentUser.rank ?? 'N/A'}
          </div>
          <div>
            <strong>Points:</strong> {currentUser.points ?? 0}
          </div>
        </div>

        {/* Success / Improvement Message */}
        {isInTop10 ? (
          <div
            style={{
              marginTop: '15px',
              padding: '12px 16px',
              borderLeft: '4px solid #28a745',
              backgroundColor: '#eaf7ef',
              color: '#1e7e34',
              borderRadius: '4px',
            }}
          >
            You are currently in the Top 10. Keep maintaining your performance.
          </div>
        ) : (
          <div
            style={{
              marginTop: '15px',
              padding: '12px 16px',
              borderLeft: '4px solid #ffc107',
              backgroundColor: '#fff8e1',
              color: '#856404',
              borderRadius: '4px',
            }}
          >
            Keep improving your score to climb the leaderboard.
          </div>
        )}
      </div>
    </div>
  );
};

const thStyle = {
  textAlign: 'left',
  padding: '14px',
  fontWeight: 600,
  fontSize: '14px',
  borderBottom: '1px solid #dee2e6',
};

const tdStyle = {
  padding: '12px 14px',
  borderBottom: '1px solid #dee2e6',
  fontSize: '14px',
};

export default LeaderboardTab;