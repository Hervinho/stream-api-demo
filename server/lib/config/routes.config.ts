
//Routes
import UserRoute from '../routes/user.route';
import ProfileRoute from '../routes/profile.route';
import WatchLogRoute from '../routes/watchLog.route';
import VideoRoute from '../routes/video.route';

//All API routes here.
export const appRoutes = [
    {
        url: '/api/users',
        route: UserRoute
    },
    {
        url: '/api/profiles',
        route: ProfileRoute
    },
    {
        url: '/api/watchlogs',
        route: WatchLogRoute
    },
    {
        url: '/api/videos',
        route: VideoRoute
    },
];