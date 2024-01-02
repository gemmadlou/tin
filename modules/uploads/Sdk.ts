import axios from "axios";

export default {
    schemaUploads: {
        get: async (paramId: string | number) => {
            return (await axios.get(`/api/schema-uploads/${paramId}`)).data
        }
    }
}