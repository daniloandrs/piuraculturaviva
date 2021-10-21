import {
    dnModule
} from '../../dine.js';

import mdLogin from './login/login.js';
import mdHome from './home/home.js';
import mdUpdateData from './home/components/app/actualizar-datos/actualizar-datos.js';
import mdPerfil from './home/components/app/perfil/perfil.js';
import mdDashboard from './home/components/dashboard/dashboard.js';
import mdMenu from './home/components/seguridad/menu/menu.js';
import mdConstruirMenu from './home/components/seguridad/menu/build/build.js';
import mdRoles from './home/components/seguridad/roles/roles.js';
import mdManagerUser from './home/components/usuarios/administrar/administrar.js';
import mdManagerAccount from './home/components/usuarios/administrar/cuenta/cuenta.js';
import mdRegisterUser from './home/components/usuarios/registrar/registrar.js';

/**mantenimientos */ 

import mdCategoryType from './home/components/app/maintenance/category_type/category_type.js';

import mdCategory from './home/components/app/maintenance/category/category.js';

import mdSubCategories from './home/components/app/maintenance/category/sub_categories/sub_categories.js';

import mdEventType from './home/components/app/maintenance/event_type/event_type.js';


/** Admin Web */

import mdSlider from './home/components/app/admin-web/slider/slider.js';

import mdMyBook from './home/components/app/mi_book/mi_book.js';

import mdCommentsbook from './home/components/app/mi_book/comments/comments.js';

import mdGalleryBook from './home/components/app/mi_book/gallery/gallery.js';

import mdOthersBook from './home/components/app/mi_book/others/others.js';

import mdCulturalRepository from './home/components/app/cultural_repository/cultural_repository.js';

import mdCreateProfile from './home/components/app/create_profile/create_profile.js';

import mdGallery from './home/components/app/gallery/gallery.js';

import mdGalleryDetail from './home/components/app/gallery/gallery_detail/gallery_detail.js';

import mdPost from './home/components/app/post/post.js';

import mdVirtualTours from './home/components/app/virtual_tours/virtual_tours.js';

import mdBusiness from './home/components/app/business/business.js';

import mdBusinessContact from './home/components/app/business/business_contact/business_contact.js';

import mdBusinessAbout from './home/components/app/business/business_about/business_about.js';

import mdEvent from './home/components/app/event/event.js';

import mdBlog from './home/components/app/blog/blog.js';

export default dnModule('mdViews', [
    mdLogin,
    mdHome,
    mdUpdateData,
    mdPerfil,
    mdDashboard,
    mdMenu,
    mdConstruirMenu,
    mdRoles,
    mdManagerUser,
    mdManagerAccount,
    mdRegisterUser, 

    mdCategoryType,
    mdCategory,
    mdSubCategories,
    mdEventType,

    mdSlider,
    mdMyBook,
    mdCommentsbook,
    mdGalleryBook,
    mdOthersBook,
    mdCulturalRepository,
    mdCreateProfile,
    mdGallery,
    mdGalleryDetail,
    mdPost,
    mdVirtualTours,
    mdBusiness,
    mdBusinessContact,
    mdBusinessAbout,
    mdEvent,
    mdBlog
    
]);