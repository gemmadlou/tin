import axios from "axios";

export const Sdk = {
    schemaUploads: {
        get: async (paramId: string | number) => {
            return (await axios.get(`/api/schema-uploads/${paramId}`)).data
        }
    },
    test: 'hi',
    hero: () => {
        alert('hi')
    }
}