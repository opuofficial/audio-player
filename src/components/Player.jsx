import React, { useState } from "react";
import { Typography, Slider, Tooltip } from "antd";
const { Title } = Typography;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBackwardStep,
  faForwardStep,
  faPause,
  faPlay,
  faRepeat,
  faVolumeHigh,
  faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";

function Player(props) {
  const {
    currentSong,
    elapsed,
    handleProgressBarChange,
    playPrevNext,
    handlePlayPause,
    handleVolumeChange,
    formatDuration,
    volume,
    repeatMode,
    toggleRepeatMode,
  } = props;

  const [repeat, setRepeat] = useState(repeatMode);

  const handleRepeatChange = () => {
    setRepeat((val) => !val);
    toggleRepeatMode();
  };

  return (
    <div className="audio__player">
      {currentSong.data && (
        <img className="thumbnail" src={currentSong.data.thumbnail} alt="" />
      )}

      <Title level={3} style={{ textAlign: "center" }}>
        {currentSong?.data?.title}
      </Title>

      <div id="music__controller">
        <div className="audio__duration">
          <span>{formatDuration(elapsed)}</span>
          <span>{formatDuration(currentSong?.duration)}</span>
        </div>
        <Slider
          min={0}
          max={currentSong.duration}
          step={1}
          value={elapsed}
          tooltip={{ open: false }}
          onChange={handleProgressBarChange}
        />

        <div className="controller__buttons">
          <div>
            <div>
              <FontAwesomeIcon
                icon={faBackwardStep}
                onClick={() => playPrevNext("prev")}
                className="icon"
              />
            </div>
            <div>
              {!currentSong.isPlaying ? (
                <FontAwesomeIcon
                  icon={faPlay}
                  onClick={handlePlayPause}
                  className="icon"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faPause}
                  onClick={handlePlayPause}
                  className="icon"
                />
              )}
            </div>
            <div>
              <FontAwesomeIcon
                icon={faForwardStep}
                onClick={() => playPrevNext("next")}
                className="icon"
              />
            </div>
          </div>

          <div>
            <div>
              <Tooltip
                title={repeat ? "Repeat is on" : "Repeat is off"}
                arrow={false}
              >
                <FontAwesomeIcon
                  icon={faRepeat}
                  onClick={handleRepeatChange}
                  className={`icon ${repeat ? "active" : ""}`}
                />
              </Tooltip>
            </div>
            <div className="volume__icon">
              {volume > 0 ? (
                <FontAwesomeIcon icon={faVolumeHigh} className="icon" />
              ) : (
                <FontAwesomeIcon icon={faVolumeXmark} className="icon" />
              )}

              <div id="volume__slider__container">
                <Slider
                  vertical
                  defaultValue={50}
                  className="sliderStyle"
                  onChange={handleVolumeChange}
                  tooltip={{ open: false }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
