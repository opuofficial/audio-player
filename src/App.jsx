import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "antd";
import songData from "./data";
import "./App.css";

import Player from "./components/Player";
import Playlist from "./components/Playlist";

function App() {
  const [audio, setAudio] = useState(null);
  const [currentSong, setCurrentSong] = useState({
    data: null,
    isPlaying: false,
    duration: null,
  });
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(0.5);

  let intervalID = useRef();
  const repeatModeRef = useRef(false);

  const toggleRepeatMode = () => {
    repeatModeRef.current = !repeatModeRef.current;
  };

  const handleAudioLoaded = () => {
    setCurrentSong((prev) => ({
      ...prev,
      duration: Math.ceil(audio.duration),
    }));
  };

  const handleAudioEnded = () => {
    setCurrentSong((prev) => ({
      ...prev,
      isPlaying: false,
    }));
    clearInterval(intervalID.current);
    setElapsed(0);

    if (repeatModeRef.current) {
      playPrevNext("next");
    }
  };

  useEffect(() => {
    let audio = new Audio();
    setAudio(audio);
    setCurrentSong((prev) => ({
      ...prev,
      data: songData[0],
      duration: null,
      isPlaying: false,
    }));

    audio.src = songData[0].path;
  }, []);

  useEffect(() => {
    if (!audio) {
      return;
    }

    audio.onloadeddata = handleAudioLoaded;
    audio.onended = handleAudioEnded;
  }, [audio, currentSong]);

  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const changeSong = (songId) => {
    let song = songData.find((song) => song.id == songId);

    if (currentSong.data.id == song.id) {
      return;
    }

    setCurrentSong((prev) => ({
      ...prev,
      data: song,
      duration: null,
      isPlaying: true,
    }));

    audio.src = song.path;

    setElapsed(0);
    startElapsed();
    audio.play();
  };

  const handlePlayPause = () => {
    let isPlaying;

    if (!currentSong.isPlaying) {
      audio.play();
      startElapsed();
      isPlaying = true;
    } else {
      audio.pause();
      isPlaying = false;
      clearInterval(intervalID.current);
    }

    setCurrentSong((prev) => ({
      ...prev,
      isPlaying,
    }));
  };

  const handleProgressBarChange = (timestamp) => {
    setElapsed(timestamp);
    audio.currentTime = timestamp;
  };

  const startElapsed = () => {
    clearInterval(intervalID.current);

    intervalID.current = setInterval(() => {
      setElapsed((sec) => sec + 1);
    }, 1000);
  };

  const formatDuration = (duration) => {
    let seconds = Math.floor(Number(duration));
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${minutes}:${seconds}`;
  };

  const handleVolumeChange = (newVolume) => {
    const volume = newVolume / 100;
    setVolume(volume);
  };

  const playPrevNext = (direction) => {
    const currentSongID = currentSong.data.id;
    let newSongData = {};

    const getSongById = (songId) => {
      return songData.find((item) => item.id === songId);
    };

    if (direction == "prev") {
      const prevSongId =
        currentSongID > 1 ? currentSongID - 1 : songData.length;
      newSongData = getSongById(prevSongId);
    } else {
      const nextSongId =
        currentSongID < songData.length ? currentSongID + 1 : 1;
      newSongData = getSongById(nextSongId);
    }

    setCurrentSong((prev) => ({
      ...prev,
      data: newSongData,
      isPlaying: true,
    }));

    audio.src = newSongData.path;

    setElapsed(0);
    startElapsed();
    audio.play();
  };

  return (
    <>
      <Row gutter={[16, 10]}>
        <Col
          md={{ span: 8, offset: 4 }}
          xs={{ span: 20, offset: 2 }}
          sm={{ span: 16, offset: 4 }}
        >
          <Player
            currentSong={currentSong}
            elapsed={elapsed}
            handleProgressBarChange={handleProgressBarChange}
            playPrevNext={playPrevNext}
            handlePlayPause={handlePlayPause}
            handleVolumeChange={handleVolumeChange}
            formatDuration={formatDuration}
            volume={volume}
            repeatMode={repeatModeRef.current}
            toggleRepeatMode={toggleRepeatMode}
          />
        </Col>
        <Col
          md={{ span: 8, offset: 0 }}
          xs={{ span: 20, offset: 2 }}
          sm={{ span: 16, offset: 4 }}
        >
          <Playlist changeSong={changeSong} currentSong={currentSong} />
        </Col>
      </Row>
    </>
  );
}

export default App;
