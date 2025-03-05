import { createRouter, createWebHistory} from 'vue-router';
import GodoOtp from './components/GodoOtp.vue';
import GodoProfile from './components/GodoProfile.vue';
import GodoHome from './components/GodoHome.vue';
import HomeDrive from './components/HomeDrive.vue';
import HomeDelivery from './components/HomeDelivery.vue';
import GodoDrive from './components/GodoDrive.vue';
import GodoRide from './components/GodoRide.vue';
import GodoDelivery from './components/GodoDelivery.vue';
import GodoAdmin from './components/GodoAdmin.vue';
import AdminVehicles from './components/AdminVehicles.vue';

const router = createRouter({
    history: createWebHistory(),
    routes : [
        { path: '/', component: GodoOtp},
        { path: '/profile', component: GodoProfile},
        { path: '/home', component: GodoHome},
        { path: '/homedrive', component: HomeDrive},
        { path: '/homedelivery', component: HomeDelivery},
        { path: '/drive', component: GodoDrive},
        { path: '/ride', component: GodoRide},
        { path: '/delivery', component: GodoDelivery},
        { path: '/admin', component:GodoAdmin},
        { path: '/admin/vehicles', component:AdminVehicles}
    ],
});

export default router;