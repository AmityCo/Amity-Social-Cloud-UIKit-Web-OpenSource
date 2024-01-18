import React from 'react';
import { FormattedDate } from 'react-intl';
import TimeAgo from 'react-timeago';

import { DateContainer } from './styles';

const DAY = 24 * 60 * 60 * 1000;

export interface TimeProps {
  className?: string;
  date?: number;
}

const Time = ({ className, date = Date.now() }: TimeProps) => {
  const delta = Date.now() - date;

  return (
    <DateContainer className={className}>
      {delta < DAY ? <TimeAgo date={date} /> : <FormattedDate value={date} />}
    </DateContainer>
  );
};

export default Time;
