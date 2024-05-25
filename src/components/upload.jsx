import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API } from "./global";

const Upload = () => {
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const uploadFile = async (type) => {
    const data = new FormData();
    data.append("file", type === "image" ? img : video);
    data.append(
      "upload_preset",
      type === "image" ? "images_preset" : "videos_preset"
    );
    try {
      let cloudName = "dz0vvjdhc";
      let resourceType = type === "image" ? "image" : "video";
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data);
      const { secure_url } = res.data;
      console.log(secure_url);
      return secure_url;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Upload image file
      const imgUrl = await uploadFile("image");

      // Upload video file
      const videoUrl = await uploadFile("video");

      // Send backend api request
      await axios.post(`${API}/api/videos`, { imgUrl, videoUrl });

      // Reset states
      setImg(null);
      setVideo(null);

      console.log("File upload success!");
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error(error);
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
            onChange={(e) => setVideo((prev) => e.target.files[0])}
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
            onChange={(e) => setImg((prev) => e.target.files[0])}
          />
        </div>
        <br />
        <button type="submit">Upload</button>
      </form>

      {loading && <h3>Looding</h3>}
    </div>
  );
};

export default Upload;
