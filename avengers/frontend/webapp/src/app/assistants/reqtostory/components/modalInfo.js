import React from 'react';

const ModalInfo = () => {
  return (
    <div id="divModalInfo">
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#moreInfo"
        id="infoButton"
      >
        <i className="fa fa-question-circle"></i>
      </button>
      <div
        className="modal fade"
        id="moreInfo"
        tabIndex="-1"
        aria-labelledby="moreInfoLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="moreInfoLabel">
                Information
              </h5>
            </div>
            <div className="modal-body">
              Write your requirements in the text box, or alternatively, upload
              your text file containing the list.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalInfo;

