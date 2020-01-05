import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://localhost:5000',
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(request => {
  console.log('Starting Request: ', request)
  return request
});
instance.interceptors.response.use(response => {
  console.log('Response: ', response)
  return response
})


instance.setAuthToken = token => {
    if (token) {
        console.log("Set auth token");
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete instance.defaults.headers.common['Authorization'];
    }
}

export default instance;

