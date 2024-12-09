import React, { useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const ObjectDetection = () => {
  const [imageData, setImageData] = useState({
    file: null,
    url: null
  });
  const [predictions, setPredictions] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    setImageData({
      file: file,
      url: url
    });
  };

  const loadModelAndDetect = async () => {
    const model = await cocoSsd.load();
    const img = document.getElementById('uploaded-image'); // Get image by ID
    const predictions = await model.detect(img);
    setPredictions(predictions);
  };

  return (
    <div>
      <h1>Object Detection</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageData.url && (
        <>
          <img id="uploaded-image" src={imageData.url} alt="Uploaded" width="500" />
          <button onClick={loadModelAndDetect}>Detect Objects</button>
        </>
      )}
      {predictions.length > 0 && (
        <ul>
          {predictions.map((prediction, index) => (
            <li key={index}>
              {prediction.class} - {Math.round(prediction.score * 100)}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ObjectDetection;
