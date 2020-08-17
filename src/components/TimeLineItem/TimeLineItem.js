import React, {useMemo} from 'react';
import './TimeLineItem.css';

function TimeLineItem(props) {
    const {item, baseTimeDiff} = props;  
    const offsetTimezone = useMemo(() => item.TimeDiff - baseTimeDiff, [item, baseTimeDiff]);
    const HOUR_IN_DAY = 24;
    const FIRST_HOUR_OF_DAY = 0;
    const LAST_HOUR_OF_DAY = 23;
    const NIGHT_HOURS = [1, 2, 3, 4, 5, 22];
    const MORNING_HOURS = [6, 7];
    const EVENING_HOURS = [18, 19, 20, 21];
    const WORKING_HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    const renderClassName = (i) =>{
        if (i === FIRST_HOUR_OF_DAY)
            return "tod_begin";
        if (NIGHT_HOURS.includes(i))
            return "tod_n";
        if (MORNING_HOURS.includes(i))
            return "tod_m";
        if (EVENING_HOURS.includes(i))
            return "tod_e";
        if (WORKING_HOURS.includes(i))
            return "tod_d";
        if (i === LAST_HOUR_OF_DAY)
            return "tod_n tod_end";
    };

    const getHourByTimezone = (i) => {
        const h = offsetTimezone < 0 ? (i + 24 + offsetTimezone) : (i + offsetTimezone);
        return h >= 24 ? h - 24 : h;
    };

    const isFirstHour = h => h === FIRST_HOUR_OF_DAY;

    const displayDate = new Date(item.StartTime);

    return (
        <div className="hourline">
            <ul className="timeline">
                {Array.from(Array(HOUR_IN_DAY), (e, i) => i).map((i) => {
                    const hour = getHourByTimezone(i);
                    return isFirstHour(hour) ? 
                        (
                            // Should be replaced by a smaller component 
                            <li className={renderClassName(hour)}>
                                <div className="dow">
                                    {displayDate.toDateString().split(" ", 3)[0]}
                                </div>
                                <div>
                                    {displayDate.toDateString().split(" ", 3)[1]}
                                </div>
                                <div>
                                    {displayDate.toDateString().split(" ", 3)[2]}
                                </div>
                            </li>
                        ) : 
                        (
                            // Should be replaced by a smaller component 
                            <li className={renderClassName(hour)}>
                                <div>{hour > 12 ? hour - 12 : hour}</div>
                                <div>{hour > 12 ? 'pm' : 'am'}</div>
                            </li>
                        );
                })}
            </ul>
        </div>
    );
}

export default TimeLineItem;
