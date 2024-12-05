import React from "react";

const FeedbackComponent = ({ feedback, improvements }) => {
  return (
    <div className="p-6 shadow-lg">
      {improvements ? (
        <div>
          <h3 className="text-lg font-semibold mb-2">Areas for Improvement</h3>
          {feedback.length === 0 ? (
            <p>No improvements found.</p>
          ) : (
            feedback.map((improvement, index) => {
              const [key, value] = Object.entries(improvement)[0];
              return (
                <details className="mb-2" key={index}>
                  <summary className="cursor-pointer text-left text-red-600 pt-3">
                    {key}
                  </summary>
                  <p className="ml-4 text-left">{value}</p>
                </details>
              );
            })
          )}
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-semibold mb-2">Well-Implemented Features</h3>
          {feedback.length === 0 ? (
            <p>No well-implemented features found.</p>
          ) : (
            feedback.map((strength, index) => {
              const [key, value] = Object.entries(strength)[0];
              return (
                <details className="mb-2" key={index}>
                  <summary className="cursor-pointer text-left text-green-600 pt-3 ">
                    {key}
                  </summary>
                  <p className="ml-4 text-left">{value}</p>
                </details>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackComponent;
