const Clarifai = require('clarifai');
const dotenv = require('dotenv');
dotenv.config();
const app = new Clarifai.App({
  //apiKey: "7ac6314b53c34d25af019be048acd8f3",
  apiKey: process.env.CLARIFAI_API_KEY
});

const analyseImage = (req, res) =>{
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.url)
  .then(data => res.json(data))
  .catch(err => {
    res.status(400).json('unable to fetch image data')
  })
}

module.exports = {
  analyseImage : analyseImage
}