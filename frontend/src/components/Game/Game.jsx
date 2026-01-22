import React, { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Phaser from "phaser";
import GameScene from "./GameScene";
import CssGameScene from "./CssGameScene";
import NodeMazeScene from "./NodeGameScene";
import PythonGameScene from "./PythonGameScene";
import { submitScore } from "../../redux/game/gameActions";
import apiClient from "../../services/apiConfig";
import "./Game.css";

const GameComponent = ({ courseId }) => {
  const gameRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const courses = useSelector((state) => state.game.courses);
  const [gameConfig, setGameConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  const onGameComplete = useCallback(
    (finalScore) => {
      if (user && (user.id || user._id)) {
        const userId = user.id || user._id;
        dispatch(submitScore(userId, finalScore));
      } else {
        console.error("User ID not found, cannot submit score");
      }
    },
    [dispatch, user]
  );

  // Fetch game config
  useEffect(() => {
    const fetchGameConfig = async () => {
      try {
        const response = await apiClient.get(`/api/games/config/${courseId}`);
        setGameConfig(response.data);
      } catch (error) {
        console.error("Error fetching game config:", error);
        // Continue with default config
        setGameConfig(null);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchGameConfig();
    }
  }, [courseId]);

  useEffect(() => {
    if (loading || !gameConfig) {
      return;
    }

    const courseData = courses.find((course) => (course.id || course._id) === courseId);

    if (!courseData) {
      console.error("Course data is undefined for ID:", courseId);
      return;
    }

    // Merge game config into course data
    const courseDataWithConfig = {
      ...courseData,
      gameSceneConfig: gameConfig
    };

    console.log("Fetched course data with config:", courseDataWithConfig);

    let sceneClass;
    switch (courseDataWithConfig.title) {
      case "HTML Basics":
        sceneClass = GameScene;
        break;
      case "CSS Fundamentals":
        sceneClass = CssGameScene;
        break;
      case "NodeJs Basics":
        sceneClass = NodeMazeScene;
        break;
      case "Python Fundamentals":
        sceneClass = PythonGameScene;
        break;
      default:
        console.error(
          "No matching scene class for the course title:",
          courseDataWithConfig.title
        );
        return;
    }

    if (sceneClass) {
      const config = {
        type: Phaser.AUTO,
        parent: "phaser-container",
        width: 800,
        height: 600,
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0 },
            debug: false,
          },
        },
        scene: new sceneClass(courseId, courseDataWithConfig, onGameComplete),
      };

      gameRef.current = new Phaser.Game(config);
    } else {
      console.error(
        "Scene class is undefined for the course title:",
        courseDataWithConfig.title
      );
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
      }
    };
  }, [courseId, onGameComplete, courses, gameConfig, loading]);

  if (loading) {
    return (
      <div id="game-wrapper">
        <div style={{ textAlign: "center", padding: "50px", color: "#fff" }}>
          Loading game...
        </div>
      </div>
    );
  }

  return (
    <div id="game-wrapper">
      <div id="phaser-container"></div>
    </div>
  );
};

export default GameComponent;
