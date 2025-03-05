import axios from "axios";

export default {
    async login({commit,rootGetters},payload){
        const response = await axios.post(`${rootGetters.getUrl}/api/godo/otp`,payload,
        {
            headers: { 'Content-Type': 'application/json' }
        });
        if(response.status >=200 || response.status <300){
            console.log(response);
            commit('setSessionId',response.data.sessionId)
            return true;
        }
    },

    async verify({rootGetters},payload){
        const response = await axios.post(`${rootGetters.getUrl}/api/godo/verify?otp=${payload.otp}&session=${payload.sessionId}`,{},
            {
            headers: { 'Content-Type': 'application/json' }

            });
            if(response.status>=200 || response.status<300){
                console.log(response);
                return response;
            }

    },
    async searchRide({rootGetters},payload){
        const response = await axios.post(`${rootGetters.getUrl}/api/godo/travelBooking`,payload,
            {
            headers: { 'Content-Type': 'application/json' }

            });
            if(response.status>=200 || response.status<300){
                console.log(response);
                return true;
            }

    },
    async addDrive({rootGetters},payload){
        const response = await axios.post(`${rootGetters.getUrl}/api/godo/route?session=${payload.sessionId}&vehicleId=${payload.vehicleId}`,payload.data,
            {
            headers: { 'Content-Type': 'application/json' }

            });
            if(response.status>=200 || response.status<300){
                console.log(response);
                return true;
            }

    },
    async addVehicle({rootGetters},payload){
        const response = await axios.post(`${rootGetters.getUrl}/api/godo/addVehicle?session=${payload.session}`,payload.formData,
            {
            headers: { 'Content-Type': 'multipart/form-data' }


            });
            if(response.status>=200 || response.status<300){
                console.log(response);
                return response;
            }

    }
}