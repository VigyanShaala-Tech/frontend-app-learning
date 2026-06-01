import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from '../messages';

const LeaderboardTable = ({ rows, currentUserRank }) => {
  const { formatMessage } = useIntl();

  return (
    <div className="custom-leaderboard-table">
      <div className="custom-leaderboard-table__scroll">
        <table className="custom-leaderboard-table__table">
          <thead>
            <tr>
              <th className="custom-leaderboard-table__head custom-leaderboard-table__head--rank">
                {formatMessage(messages.columnRank)}
              </th>
              <th className="custom-leaderboard-table__head">
                {formatMessage(messages.columnUser)}
              </th>
              <th className="custom-leaderboard-table__head">
                {formatMessage(messages.columnCollege)}
              </th>
              <th className="custom-leaderboard-table__head custom-leaderboard-table__head--points">
                {formatMessage(messages.columnPoints)}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="custom-leaderboard-table__empty">
                  {formatMessage(messages.noResults)}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={row.rank === currentUserRank ? 'custom-leaderboard-table__row--current' : ''}
                >
                  <td className="custom-leaderboard-table__cell custom-leaderboard-table__cell--rank">
                    #
                    {row.rank}
                  </td>
                  <td className="custom-leaderboard-table__cell custom-leaderboard-table__cell--user">
                    {row.user}
                  </td>
                  <td className="custom-leaderboard-table__cell custom-leaderboard-table__cell--college">
                    {row.college}
                  </td>
                  <td className="custom-leaderboard-table__cell custom-leaderboard-table__cell--points">
                    {row.points.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

LeaderboardTable.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    rank: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    college: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
  })).isRequired,
  currentUserRank: PropTypes.number,
};

LeaderboardTable.defaultProps = {
  currentUserRank: undefined,
};

export default LeaderboardTable;
