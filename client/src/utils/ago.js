import moment from 'moment';

moment.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ",
        s: "%ds",
        m: "%dm",
        mm: "%dm",
        h: "%dh",
        hh: "%dh",
        d: "%dd",
        dd: "%dd",
        M: "%dmth",
        MM: "%dmths",
        y: "%dy",
        yy: "%d y"
    }
});

const ago = (date) => {
    return moment(date).fromNow();
};

export default ago;