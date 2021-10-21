
import { dnModule } from '../../dine.js';

/**loader */

import mdLoader from './loader/loader.js';

/** views */

import mdNavbar  from './navbar/navbar.js';

import mdHome from './home/home.js';

import mdAbout from './about/about.js';

import mdMyBook from './my_book/my_book.js';

import mdFooter from './footer/footer.js';

import mdCulturalRepository from './cultural_repository/cultural_repository.js';

import mdMemberProfile from './member_profile/member_profile.js';

import mdGallery from './gallery/gallery.js';

import mdGalleryDetail from './gallery_detail/gallery_detail.js';

import mdPost from './post/post.js';

import mdPostDetail from './post/post_detail/post_detail.js';

import mdvirtualTours from './virtual_tours/virtual_tours.js';

import mdEvent from './event/event.js';

import mdEventDetail from './event/event_detail/event_detail.js';

import mdBlog from './blog/blog.js';

import mdBlogDetail from './blog/blog_detail/blog_detail.js';

import mdSchedule from './schedule/schedule.js';

import mdFondo from './fondo/fondo.js';

export default dnModule('mdViews', [
    
    mdLoader,
    mdNavbar,
    mdHome,
    mdAbout,
    mdMyBook,
    mdFooter,
    mdCulturalRepository,
    mdMemberProfile,
    mdGallery,
    mdGalleryDetail,
    mdPost,
    mdPostDetail,
    mdvirtualTours,
    mdEvent,
    mdEventDetail,
    mdBlog,
    mdBlogDetail,
    mdSchedule,
    mdFondo
]);  