import React, {useState} from 'react'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./Bar.module.scss"
import { fetchComicsData } from '../../../apis/comics';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Bar({setResults}) {
  const [input, setInput] = useState("")
  const [comicsData, setComicsData] = useState([]);


  const fetchData = async (value) => {
    try {
      const data = await fetchComicsData();
      if (Array.isArray(data)) {
        setComicsData(data);
        const results = data.filter((comics) => (
          value &&
          comics &&
          comics.title &&
          comics.title.toLowerCase().includes(value.toLowerCase())
        ));
        console.log(results);
        setResults(results)
      } else {
        console.error('Invalid data format:', data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
    

  const handleChange = (value) => {
    setInput(value)
    fetchData(value)
  }

  return (
    <div className={`${styles.mainDiv}`}>
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      <input
       placeholder="R e c h e r c h e r . . ."
       value={input} 
       onChange={(e) => handleChange(e.target.value)}
       />
    </div>
  )
}

export default Bar