import createRefresh from 'react-auth-kit/createRefresh';
import axios from 'axios'

const refresh_api = createRefresh({
    interval: 10,
    refreshApiCallback: async (param) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/refresh', param, {
                headers: {'Authorization': `Bearer ${param.authToken}`}
            })
            console.log("Refreshing")
            return {
                isSuccess: true,
                newAuthToken: response.data.token,
                newAuthTokenExpireIn: 10,
                newRefreshTokenExpiresIn: 60
            }
        }
        catch(error){
            console.error(error)
            return {
                isSuccess: false
            } 
        }
    }
})

  export default refresh_api