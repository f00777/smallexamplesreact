//https://www.freecodecamp.org/news/how-to-build-a-memory-card-game-using-react/

import React, {useState, useEffect} from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import Card from "../Card";
import Loader from "../Loader";
import styles from "./CardGrid.module.scss";
import useFetch from "../../hooks/useFetch";

function CardsGrid(data){
    //State Management
    const [images, setImages] = useState(data?.data?.images || []);
    const [clickedImages, setClickedImages] = useLocalStorage("clickedImages", []);
    const [score, setScore] = useLocalStorage("score", 0);
    const [bestScore, setBestScore] = useLocalStorage("bestScore", 0);
    const [isLoading, setIsLoading] = useState(!data?.data?.images?.length);

    //Custom Hook for fetching images
    const {data: fetchedData, fetchData, error} = useFetch()

    //Update images when new data is fetched
    useEffect(() => {
        if(fetchedData?.images){
            setImages(fetchedData.images);
            setIsLoading(false);
            //Reset clicked images when new batch is loaded
            setClickedImages([])
        }
    })
}