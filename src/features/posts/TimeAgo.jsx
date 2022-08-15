import {parseISO, formatDistanceToNow} from 'date-fns';

const TimeAgo = ({timestamp})=>{
    let timeago = '';

    if(timestamp){
        const date = parseISO(timestamp)
        const timePeriod = formatDistanceToNow(date, {addSuffix:true})
        timeago = timePeriod
    }

    return (
        <span title={timestamp}>
            &nbsp; <i>{timeago}</i>
        </span>
    )
}

export default TimeAgo;