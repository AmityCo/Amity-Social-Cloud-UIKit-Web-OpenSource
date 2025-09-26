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
  const isValidDate = !isNaN(date) && new Date(date).getTime() > 0;
  const delta = Date.now() - date;

  return (
    <DateContainer className={className}>
      {isValidDate &&
        (delta < DAY ? (
          <TimeAgo date={new Date(date)} />
        ) : (
          <FormattedDate value={new Date(date)} />
        ))}
    </DateContainer>
  );
};

export default Time;
