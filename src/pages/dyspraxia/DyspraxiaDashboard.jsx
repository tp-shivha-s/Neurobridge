import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Hand, FlipHorizontal2, PlayCircle, PauseCircle, Building2, Trees, Flag } from "lucide-react";
import styles from "./DyspraxiaDashboard.module.css";

const tasks = [
  {
    id: "task-1",
    title: "Tying a Tie",
    cue: "Lead with left loop, then mirror cross-over.",
    landmark: "Use mirror shoulder alignment",
  },
  {
    id: "task-2",
    title: "Buttoning a Shirt",
    cue: "Anchor fabric with one thumb before pushing button.",
    landmark: "Pause at each hole edge",
  },
  {
    id: "task-3",
    title: "Cutlery Sequencing",
    cue: "Fork pins first, knife glides second.",
    landmark: "Count 1-2 rhythm for each cut",
  },
];

const mapLandmarks = [
  { id: 1, icon: Building2, text: "Start at the Red Building" },
  { id: 2, icon: Trees, text: "Continue until the Green Park Gate" },
  { id: 3, icon: Flag, text: "Turn right at the Blue Flag Corner" },
];

const BPM = 60;

const useFumbleProtection = (cooldown = 420) => {
  const tapRegistry = useRef(new Map());

  return useCallback(
    (key, handler) => () => {
      const now = Date.now();
      const lastTap = tapRegistry.current.get(key) ?? 0;
      if (now - lastTap < cooldown) {
        return;
      }
      tapRegistry.current.set(key, now);
      handler();
    },
    [cooldown],
  );
};

export default function DyspraxiaDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0].id);
  const [mirrorMode, setMirrorMode] = useState(false);
  const [pacerRunning, setPacerRunning] = useState(false);
  const [pulseTick, setPulseTick] = useState(0);
  const [beatCount, setBeatCount] = useState(0);

  const safeTap = useFumbleProtection();

  useEffect(() => {
    const loadTimeout = setTimeout(() => setIsLoading(false), 950);
    return () => clearTimeout(loadTimeout);
  }, []);

  useEffect(() => {
    if (!pacerRunning) {
      return;
    }

    const intervalMs = (60 / BPM) * 1000;
    const beatInterval = setInterval(() => {
      setPulseTick((value) => value + 1);
      setBeatCount((value) => value + 1);
      if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        navigator.vibrate(45);
      }
    }, intervalMs);

    return () => clearInterval(beatInterval);
  }, [pacerRunning]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? tasks[0],
    [selectedTaskId],
  );

  return (
    <div className={styles.moduleShell}>
      <div className={styles.topRow}>
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Modes
        </Link>
      </div>

      <motion.section
        className={styles.heroCard}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className={styles.heroIconWrap}>
          <Hand size={26} />
        </div>
        <div>
          <h1 className={styles.heroTitle}>CoordiMate</h1>
          <p className={styles.heroSubtitle}>Reduce physical-to-digital friction with safe, rhythmic interactions.</p>
        </div>
      </motion.section>

      {isLoading ? (
        <div className={styles.loadingGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard} />
          ))}
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            <motion.section
              className={styles.glassCard}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.04 }}
            >
              <header className={styles.cardHeader}>
                <h2>AOMI Task Library</h2>
              </header>

              <div className={styles.stackColumn}>
                {tasks.map((task) => (
                  <button
                    key={task.id}
                    className={`${styles.safeTapButton} ${styles.taskCard} ${selectedTaskId === task.id ? styles.activeCard : ""}`}
                    onClick={safeTap(`select-${task.id}`, () => setSelectedTaskId(task.id))}
                  >
                    <div>
                      <h3>{task.title}</h3>
                      <p>{task.cue}</p>
                    </div>
                    <small>{task.landmark}</small>
                  </button>
                ))}
              </div>

              <div className={styles.previewShell}>
                <div className={styles.previewTopRow}>
                  <strong>{selectedTask.title}</strong>
                  <button
                    className={`${styles.safeTapButton} ${styles.inlineButton}`}
                    onClick={safeTap("mirror", () => setMirrorMode((value) => !value))}
                  >
                    <FlipHorizontal2 size={18} />
                    Mirror Mode {mirrorMode ? "On" : "Off"}
                  </button>
                </div>

                <motion.div
                  className={`${styles.videoMock} ${mirrorMode ? styles.mirror : ""}`}
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                >
                  <motion.div
                    className={styles.motionPath}
                    animate={{ x: [0, 70, 0], y: [0, -6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span>Action Observation Preview</span>
                </motion.div>
              </div>
            </motion.section>

            <motion.section
              className={styles.glassCard}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              <header className={styles.cardHeader}>
                <h2>Proprioceptive Pacer — 60 BPM</h2>
              </header>

              <div className={styles.pacerPanel}>
                <motion.div
                  key={pulseTick}
                  className={styles.pulseCircle}
                  animate={
                    pacerRunning
                      ? { scale: [1, 1.2, 1], opacity: [0.65, 1, 0.65] }
                      : { scale: 1, opacity: 0.6 }
                  }
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
                <p>{pacerRunning ? "Move on each pulse." : "Start to sync movement with the beat."}</p>
                <small>Beats: {beatCount}</small>
              </div>

              <button
                className={`${styles.safeTapButton} ${styles.primaryButton}`}
                onClick={safeTap("pacer", () => {
                  setPacerRunning((value) => !value);
                  if (pacerRunning) {
                    setBeatCount(0);
                  }
                })}
              >
                {pacerRunning ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
                {pacerRunning ? "Pause Pacer" : "Start Pacer"}
              </button>
            </motion.section>
          </div>

          <motion.section
            className={styles.glassCard}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.12 }}
          >
            <header className={styles.cardHeader}>
              <h2>Adaptive Navigation GPS</h2>
            </header>

            <div className={styles.mapMock}>
              <div className={styles.pathLine} />
              {mapLandmarks.map((landmark) => (
                <div key={landmark.id} className={styles.landmarkRow}>
                  <div className={styles.landmarkIcon}>
                    <landmark.icon size={20} />
                  </div>
                  <p>{landmark.text}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </>
      )}
    </div>
  );
}
