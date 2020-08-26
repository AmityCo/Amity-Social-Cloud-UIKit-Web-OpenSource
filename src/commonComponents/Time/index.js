import React, { useEffect, useReducer } from 'react';
import { FormattedDate } from 'react-intl';
import ReactTimeAgo from 'react-time-ago';

import { DateContainer } from './styles';

const DAY = 24 * 60 * 60 * 1000;

const Time = ({ className, date }) => {
  const delta = Date.now() - date;

  return (
    <DateContainer className={className}>
      {delta < DAY ? <ReactTimeAgo date={date} /> : <FormattedDate value={date} />}
    </DateContainer>
  );
};

export default Time;
