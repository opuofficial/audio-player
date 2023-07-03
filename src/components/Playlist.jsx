import React from "react";
import { Typography } from "antd";
const { Title } = Typography;
import songData from "../data";

function Playlist(props) {
  const { changeSong, currentSong } = props;

  return (
    <div className="audio__playlist">
      <Title level={3}>Playlist</Title>

      <div className="playlist__container">
        {songData.map((item, index) => (
          <div
            key={item.id}
            onClick={() => changeSong(item.id)}
            className="song__item"
          >
            <img src={item.thumbnail} alt={item.title} />
            <h3 className={currentSong.data?.id == item.id ? "active" : ""}>
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist;
