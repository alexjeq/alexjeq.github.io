import React, { useState } from 'react';
import { Button, TextArea } from 'semantic-ui-react';
import logo from "./images/logo.png"
import './App.scss';

function App() {

  const [firstOption, setFirstOption] = useState(true);
  const [secondOption, setSecondOption] = useState(false);
  const [displayUpload, setDisplayUpload] = useState(true);
  const [firstTextarea, setFirstTextArea] = useState("");
  const [secondTextarea, setSecondTextArea] = useState("");
  const [output, setOutput] = useState("");
  const [orderingType, setOrderingType] = useState("asc");

  const handleRadioButton = (type) => {
    setOrderingType(type === "asc" ? "asc" : "desc");
  }

  const handleOption = (type) => {
    if (type === "1") {
      setFirstOption(true);
      setSecondOption(false)
      document.getElementById("reset-second").click();
    } else {
      setSecondOption(true);
      setFirstOption(false);
      document.getElementById("reset-first").click();
    }
  }

  const showFile = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setSecondTextArea(text);
      e.target.abort();
    };
    reader.readAsText(e.target.files[0]);
    setDisplayUpload(false);
  };

  const resetTextarea = () => {
    setFirstTextArea("");
    const inputArea = document.getElementById("area-input");
    inputArea.style.height = "initial";
  }

  const resetForm = () => {
    setDisplayUpload(true);
    setSecondTextArea("");
    const inputArea = document.getElementById("area-input");
    inputArea.style.height = "initial";
  }

  const sortNames = (type) => {
    const data = type === "1" ? firstTextarea : secondTextarea;
    const result = data.split(/\n/).filter((value, index, arr) => {
      return !["", "\n", "\r"].includes(value)
    }).sort((a, b) => {
      if (a.toLowerCase() < b.toLowerCase()) {
        return orderingType === "asc" ? -1 : 1;
      } else if (a.toLowerCase() > b.toLowerCase()) {
        return orderingType === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });
    var outputText = "";
    result.forEach((elem, index) => {
      outputText += elem + (index < result.length - 1 ? "\n" : "")
    })
    setOutput(`List contains ${result.length} names\n_ _ _ _ _ _ _ _ _ _ _ \n${outputText}`)
  }

  const downloadFile = (text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', "sorted-names.txt");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <div className="app-container">
      <div className="header-container">
        <div className='logo-header'>
          <img src={logo} alt="logo" />
        </div>
        Welcome to order names algorithm!
      </div>
      <div className='body-container'>
        <div className='options-container'>
          <div
            className={`first-option ${firstOption ? "active-option" : "nonactive-option"}`}
            onClick={() => handleOption("1")}>
            Introduce name one by one
          </div>
          <div
            className={`second-option ${secondOption ? "active-option" : "nonactive-option"}`}
            onClick={() => handleOption("2")}>
            Upload file (only .txt)
          </div>
        </div>
        <div className='option-select-input'>
          <form className='ordering-container'>
            <div className="choose-order-type">
              Choose ordering type:
            </div>
            <div className='ordering-type' onClick={() => handleRadioButton("asc")}>
              <input
                type="radio"
                name="fav_language"
                value="asc"
                required="required"
                checked={orderingType === "asc"}
              />
              <label style={{ fontWeight: orderingType === "asc" ? "bold" : "normal" }} for="html">Ascending</label><br />
            </div>
            <div className='ordering-type' onClick={() => handleRadioButton("desc")}>
              <input
                type="radio"
                name="fav_language"
                value="desc"
                checked={orderingType === "desc"}
              />
              <label style={{ fontWeight: orderingType === "desc" ? "bold" : "normal" }} for="css">Descending</label><br />
            </div>
          </form>
          {firstOption && (
            <div className='first-input'>
              <TextArea
                className="text-area"
                id="area-input"
                rows={10}
                placeholder="Write something..."
                value={firstTextarea}
                onChange={(e) => {
                  setFirstTextArea(e.target.value);
                }}
              />
              <div className='buttons-container'>
                <Button
                  onClick={() => sortNames("1")}
                >
                  Order names
                </Button>
                <Button
                  id="reset-first" onClick={() => resetTextarea()}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
          {secondOption && (
            <div className='second-input'>
              <TextArea
                className="text-area"
                id="area-input"
                rows={10}
                disabled={displayUpload}
                value={secondTextarea}
                onChange={(e) => {
                  setSecondTextArea(e.target.value);
                }}
              />
              <div className={`buttons-container ${displayUpload ? "three-buttons" : "two-buttons"}`}>
                {displayUpload &&
                  <form id="upload-form" >
                    <input
                      type="file"
                      id="selectedFile"
                      style={{ display: "none" }}
                      accept=".txt"
                      onChange={showFile}
                      onClick={e => (e.target.value = null)} />
                    <input
                      type="button"
                      value="Upload .txt"
                      onClick={() => document.getElementById('selectedFile').click()} />
                  </form>
                }
                <Button
                  onClick={() => sortNames("2")}
                >
                  Order names
                </Button>
                <Button
                  id="reset-second"
                  onClick={resetForm}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className='output-container'>
          <TextArea
            className="text-area"
            rows={10}
            disabled={true}
            value={output}
          />
          <div className='buttons-container'>
            <Button
              onClick={() => downloadFile(output)}
            >
              Download as .txt
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
