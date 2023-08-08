import React from "react";
import axios from "axios";
const useImageColors = (url: string) => {
    const [colors, setColors] = React.useState<any>(null);
    React.useEffect(() => {
        axios
            .get("https://api.sightengine.com/1.0/check.json", {
                params: {
                    url,
                    models: "properties",
                    api_user: "1840465717",
                    api_secret: "kd2R6XfwMQEgFqLNVQ83",
                },
            })
            .then(function (response) {
                console.log(response.data);
                setColors(response.data);
            })
            .catch(function (error) {
                // handle error
                if (error.response) console.log(error.response.data);
                else console.log(error.message);
            });
    }, []);
    return colors;
};
export default useImageColors;
