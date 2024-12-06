import React from "react";
import { CircularProgressBar } from "react-percentage-bar";
import DownloadComponent from "./downloadComp";

const PercentageBarComponent = ({results}) => {

    const percentage = parseFloat(results.percentage);
    const textGrade = mapPercentageToText(percentage)
    
    return (
      <div className="flex items-center justify-center p-6">
        <div className="relative w-full max-w-xs">

          <DownloadComponent results={results}/>

          <CircularProgressBar
            percentage={percentage}
            size={"2rem"}
            radius={"9rem"}
            roundLineCap={false}
            styles="separators"
            separator={[5, 10, "#fff"]}
            color={"#333"}
            percentageStyle={{
              color: "#000",
              fontSize: "1.5rem",
              fontWeight: "600",
            }}
            textStyle={{
              color: "#000",
              fontSize: "1.3rem",
              fontWeight: "500",
            }}
            antiClockWise={true}
            text={textGrade}
          />
        </div>
      </div>
    );
}

function mapPercentageToText(percentage) {
    const gradingSysytem = [
      { limit: 20, grade: "Very Bad" },
      { limit: 40, grade: "Bad" },
      { limit: 60, grade: "Okay" },
      { limit: 80, grade: "Good" },
      { limit: 100, grade: "Very Good" },
    ];
  
    for (const { limit, grade } of gradingSysytem) {
      if (percentage <= limit) {
        return grade;
      }
    }
  
    return "Invalid Percentage";
  }

export default PercentageBarComponent