import React from "react";
import useThree from "../hooks/useThree";


export default function Home() {

    useThree();

    return(

        <div className="sections-container" data-scroll-container>
            <canvas className="home-three-object"></canvas>
        </div>

    );
}