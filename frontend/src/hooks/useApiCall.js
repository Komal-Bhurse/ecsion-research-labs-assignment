import axios from "axios"
import { useState } from "react"

// export default useApiCall = () =>{
//        const [loading , setLoading] = useState(false)
//        const [data,setData] = useState(null)

//        const APICALL = async() =>{

//        }



// }

export const APICALL = async(method,url,data)=>{
    try {
        if(method === "post"){
            const res = await axios.post(`${url}`,{...data},{withCredentials:true})
            return res
        }
    } catch (error) {
        return error
    }
          
} 