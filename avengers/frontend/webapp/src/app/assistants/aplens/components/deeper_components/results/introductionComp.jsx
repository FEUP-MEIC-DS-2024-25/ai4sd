import React from "react";

const IntroductionComponent = ({ results }) => {
  return (
    <div className=" p-6 flex items-center text-left">
        <div>
          <h2 className="text-xl font-bold mb-2">Explanation</h2>
          <p className="text-justify pt-4">
            {results.explanation}
          </p>
        </div>
      </div>
)};

export default IntroductionComponent;
