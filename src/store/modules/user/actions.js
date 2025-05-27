import axios from "axios";

export default{

    async addDrive({rootGetters},payload){
        const response = await axios.post(`${rootGetters.getUrl}/api/godo/route?session=${payload.sessionId}&vehicleId=${payload.vehicleId}`,payload.data,
            {
            headers: { 'Content-Type': 'application/json' }

            });
            if(response.status>=200 && response.status<300){
                console.log(response);
                return true;
            }

    },
}