import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API, API_KEY } from "./global"; // Adjust your import path accordingly

const SecureUpload = () => {
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const uploadFile = async (type, timestamp, signature) => {
    const folder = type === "image" ? "images" : "videos";
    const data = new FormData();
    data.append("file", type === "image" ? img : video);
    data.append("timestamp", timestamp);
    data.append("signature", signature);
    data.append("api_key", API_KEY);
    data.append("folder", folder);

    try {
      const cloudName = "dz0vvjdhc";
      const resourceType = type === "image" ? "image" : "video";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      setError("Failed to upload the file. Please try again.");
    }
  };

  const getSignatureForUpload = async (folder) => {
    try {
      const res = await axios.post(`${API}/api/sign-upload`, { folder });
      return res.data;
    } catch (error) {
      console.error("Signature error:", error);
      setError("Failed to get upload signature. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { timestamp: imgTimestamp, signature: imgSignature } =
        await getSignatureForUpload("images");
      const { timestamp: videoTimestamp, signature: videoSignature } =
        await getSignatureForUpload("videos");

      const imgUrl = await uploadFile("image", imgTimestamp, imgSignature);
      const videoUrl = await uploadFile(
        "video",
        videoTimestamp,
        videoSignature
      );

      await axios.post(`${API}/api/videos`, { imgUrl, videoUrl });

      setImg(null);
      setVideo(null);
      console.log("File upload success!");
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Submit error:", error);
      setError("Failed to submit the files. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="video">Video:</label>
          <br />
          <input
            type="file"
            accept="video/*"
            id="video"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        </div>
        <br />
        <div>
          <label htmlFor="img">Image:</label>
          <br />
          <input
            type="file"
            accept="image/*"
            id="img"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>
        <br />
        <button type="submit">Upload</button>
      </form>

      {loading && <h3>Loading...</h3>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default SecureUpload;
