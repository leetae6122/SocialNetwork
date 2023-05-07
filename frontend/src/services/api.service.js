import axios from "axios";


const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    
};

export default (baseURL) => { 
    // console.log(baseURL);
    return axios.create({ 
        baseURL, 
        ...commonConfig, 
    });
    
};

