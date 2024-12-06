import React from "react";

const IntroductionComponent = ({ pattern, explanation }) => {
  return (
    <div className=" p-6 flex items-center">
        <div>
          <h2 className="text-xl font-bold mb-2">Repository Evaluation</h2>
          <p className="text-left pt-4">
            The repository has been evaluated regarding the implementation of pattern {pattern} .<p>
            Here are the results: {explanation}</p>
          </p>
        </div>
      </div>
)};

export default IntroductionComponent;
