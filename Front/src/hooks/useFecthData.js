import { useEffect, useState } from "react";

function useFecthData(url, way) {

    const [comicsData, setComicsData] = useState([]);

    useEffect(() => {
        async function fetchData () {
            try {
              const response = await fetch(`${url}/${way}`)
                if (!response.ok) {
                    throw new Error ("Une erreur est survenu")
                }
                const data = await response.json();
                setComicsData(data)
            } catch (error) {
                console.log(`Erreur lors de la récupération des données:`, error)
            }
        }
        fetchData();
    }, [])


  return [[comicsData, setComicsData]]
}

export default useFecthData