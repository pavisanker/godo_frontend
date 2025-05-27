import { createRouter, createWebHistory} from 'vue-router';
import GodoOtp from './components/GodoOtp.vue';
import GodoProfile from './components/GodoProfile.vue';
import GodoHome from './components/GodoHome.vue';
import HomeDrive from './components/HomeDrive.vue';
import HomeDelivery from './components/HomeDelivery.vue';
import GodoDrive from './components/GodoDrive.vue';
import GodoRide from './components/GodoRide.vue';
import GodoDelivery from './components/GodoDelivery.vue';
import GodoAdmin from './components/admin/GodoAdmin.vue';
import AdminVehicles from './components/admin/AdminVehicles.vue';
import AdminUsers from './components/admin/AdminUsers.vue';
import AdminDashboard from './components/admin/AdminDashboard.vue';
import AdminDrives from './components/admin/AdminDrives.vue';
import AdminBookings from './components/admin/AdminBookings.vue';
import AdminHistory from './components/admin/AdminHistory.vue';
import GodoAbout from './components/GodoAbout.vue';

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
        { path: '/admin', component:GodoAdmin,
            children: [
                {path: '', redirect: '/admin/dashboard' },
                {path: 'dashboard', component: AdminDashboard },
                {path: 'vehicles', component: AdminVehicles},
                {path: 'users', component: AdminUsers},
                {path: 'drives', component: AdminDrives},
                {path: 'bookings', component: AdminBookings},
                {path: 'history', component: AdminHistory},
            ]
        },
        { path: '/about', component: GodoAbout},
    ],
});

export default router;