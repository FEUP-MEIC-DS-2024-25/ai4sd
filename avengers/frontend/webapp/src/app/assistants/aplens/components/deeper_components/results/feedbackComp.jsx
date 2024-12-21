const FeedbackComponent = ({ feedback, improvements }) => {
  return (
    <div className="p-6 shadow-lg h-auto">
      {improvements ? (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-left">Areas for Improvement</h3>
          {feedback.length === 0 ? (
            <p>No improvements found.</p>
          ) : (
            feedback.map((improvement, index) => {
              const [key, value] = Object.entries(improvement)[0];
              return (
                <details
                  className="mb-2"
                  key={index}
                  style={{ overflow: 'visible' }}
                >
                  <summary className="cursor-pointer text-left pt-3">
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
          <h3 className="text-lg font-semibold mb-2 text-left">Well-Implemented Features</h3>
          {feedback.length === 0 ? (
            <p>No well-implemented features found.</p>
          ) : (
            feedback.map((strength, index) => {
              const [key, value] = Object.entries(strength)[0];
              return (
                <details
                  className="mb-2"
                  key={index}
                  style={{ overflow: 'visible' }}
                >
                  <summary className="cursor-pointer text-left pt-2 pb-2 text-medium">
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
