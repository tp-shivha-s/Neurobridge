import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Plus, TimerReset, Brain, Flame, X } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./OCDDashboard.module.css";

const HOURS = Array.from({ length: 24 }, (_, index) => index);

const exposureChallenges = {
  1: "Touch a neutral object and wait 30 seconds before reassurance.",
  2: "Leave one item slightly imperfect for 2 minutes.",
  3: "Delay one checking ritual for 3 minutes.",
  4: "Touch a low-trigger surface and delay washing for 5 minutes.",
  5: "Send one message without rereading more than once.",
  6: "Leave home after one lock check only.",
  7: "Resist one reassurance question for 10 minutes.",
  8: "Allow uncertainty on a medium trigger and observe sensations.",
  9: "Do one high-trigger exposure with a 15-minute ritual delay.",
  10: "Complete a full exposure and log urges without performing rituals.",
};

const formatTime = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const getStreaks = (hourStates) => {
  let maxStreak = 0;
  let currentStreak = 0;

  HOURS.forEach((hour) => {
    if (hourStates[hour] === "resisted") {
      currentStreak += 1;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });

  return { maxStreak, currentStreak };
};

export default function OCDDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const [fearInput, setFearInput] = useState("");
  const [fearRank, setFearRank] = useState(5);
  const [triggerLadder, setTriggerLadder] = useState([]);
  const [challengeMode, setChallengeMode] = useState(false);

  const [timerDuration, setTimerDuration] = useState(180);
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerRunning, setTimerRunning] = useState(false);

  const [sosOpen, setSosOpen] = useState(false);
  const [intrusiveThought, setIntrusiveThought] = useState("");
  const [labeledThought, setLabeledThought] = useState("");

  const [hourStates, setHourStates] = useState({});

  useEffect(() => {
    const loadTimeout = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(loadTimeout);
  }, []);

  useEffect(() => {
    if (!timerRunning || timeLeft <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerRunning, timeLeft]);

  const latestRank = triggerLadder[0]?.rank ?? fearRank;
  const activeChallenge = exposureChallenges[latestRank];

  const timerProgress = useMemo(() => {
    const elapsed = timerDuration - timeLeft;
    return Math.max(0, Math.min(100, (elapsed / timerDuration) * 100));
  }, [timerDuration, timeLeft]);

  const resistedCount = useMemo(
    () => HOURS.filter((hour) => hourStates[hour] === "resisted").length,
    [hourStates],
  );

  const performedCount = useMemo(
    () => HOURS.filter((hour) => hourStates[hour] === "performed").length,
    [hourStates],
  );

  const streaks = useMemo(() => getStreaks(hourStates), [hourStates]);

  const addTrigger = () => {
    if (!fearInput.trim()) {
      return;
    }

    setTriggerLadder((previous) => [
      {
        id: Date.now(),
        fear: fearInput.trim(),
        rank: fearRank,
      },
      ...previous,
    ]);

    setFearInput("");
  };

  const removeTrigger = (id) => {
    setTriggerLadder((previous) => previous.filter((item) => item.id !== id));
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimeLeft(timerDuration);
  };

  const setQuickTimer = (seconds) => {
    setTimerDuration(seconds);
    setTimeLeft(seconds);
    setTimerRunning(false);
  };

  const toggleHourState = (hour) => {
    setHourStates((previous) => {
      const current = previous[hour];
      const next = { ...previous };

      if (!current) {
        next[hour] = "resisted";
      } else if (current === "resisted") {
        next[hour] = "performed";
      } else {
        delete next[hour];
      }

      return next;
    });
  };

  const applyLabeler = () => {
    if (!intrusiveThought.trim()) {
      setLabeledThought("");
      return;
    }

    setLabeledThought(`I am having the thought that ${intrusiveThought.trim()}.`);
  };

  const circleRadius = 72;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleOffset = circleCircumference - (timerProgress / 100) * circleCircumference;

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
          <Shield size={26} />
        </div>
        <div>
          <h1 className={styles.heroTitle}>MindBridge</h1>
          <p className={styles.heroSubtitle}>Transition from compulsion to observation and resistance.</p>
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <header className={styles.cardHeader}>
                <Brain size={18} />
                <h2>Dynamic ERP Engine</h2>
              </header>

              <label className={styles.label}>Trigger / Fear</label>
              <input
                className={styles.input}
                value={fearInput}
                onChange={(event) => setFearInput(event.target.value)}
                placeholder="Example: If I don't check the lock, something bad will happen"
              />

              <div className={styles.rankRow}>
                <label className={styles.label}>Fear Rank</label>
                <span className={styles.rankChip}>{fearRank}/10</span>
              </div>
              <input
                className={styles.slider}
                type="range"
                min={1}
                max={10}
                value={fearRank}
                onChange={(event) => setFearRank(Number(event.target.value))}
              />

              <button className={styles.primaryButton} onClick={addTrigger}>
                <Plus size={16} />
                Add to Trigger Ladder
              </button>

              <div className={styles.ladderList}>
                {triggerLadder.length === 0 && <p className={styles.empty}>No triggers yet. Start by adding one.</p>}
                {triggerLadder.map((item) => (
                  <div key={item.id} className={styles.ladderItem}>
                    <div>
                      <p className={styles.ladderFear}>{item.fear}</p>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${item.rank * 10}%` }} />
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <span className={styles.rankChip}>{item.rank}</span>
                      <button className={styles.iconButton} onClick={() => removeTrigger(item.id)} aria-label="Remove trigger">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className={styles.secondaryButton} onClick={() => setChallengeMode((value) => !value)}>
                {challengeMode ? "Hide Challenge Mode" : "Enable Challenge Mode"}
              </button>

              <AnimatePresence>
                {challengeMode && (
                  <motion.div
                    className={styles.challengeBox}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className={styles.challengeLabel}>Challenge for Rank {latestRank}</p>
                    <p>{activeChallenge}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            <motion.section
              className={styles.glassCard}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
            >
              <header className={styles.cardHeader}>
                <TimerReset size={18} />
                <h2>Ritual Delayer — Wave Rider</h2>
              </header>

              <div className={styles.timerWrap}>
                <svg width="180" height="180" viewBox="0 0 180 180" className={styles.timerSvg}>
                  <circle className={styles.timerTrack} cx="90" cy="90" r={circleRadius} />
                  <circle
                    className={styles.timerProgress}
                    cx="90"
                    cy="90"
                    r={circleRadius}
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={circleOffset}
                  />
                </svg>
                <div className={styles.timerCenter}>{formatTime(timeLeft)}</div>
              </div>

              <div className={styles.quickActions}>
                <button className={styles.quickButton} onClick={() => setQuickTimer(120)}>
                  2 min
                </button>
                <button className={styles.quickButton} onClick={() => setQuickTimer(180)}>
                  3 min
                </button>
                <button className={styles.quickButton} onClick={() => setQuickTimer(300)}>
                  5 min
                </button>
              </div>

              <div className={styles.timerActions}>
                <button className={styles.primaryButton} onClick={() => setTimerRunning((value) => !value)}>
                  {timerRunning ? "Pause" : "Start Delay"}
                </button>
                <button className={styles.secondaryButton} onClick={resetTimer}>
                  Reset
                </button>
              </div>

              <div className={styles.wavePanel}>
                <p className={styles.wavePrompt}>Breathe with the wave</p>
                <svg viewBox="0 0 300 64" className={styles.waveSvg} preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0,32 C25,10 50,10 75,32 C100,54 125,54 150,32 C175,10 200,10 225,32 C250,54 275,54 300,32" />
                  <path d="M0,34 C25,56 50,56 75,34 C100,12 125,12 150,34 C175,56 200,56 225,34 C250,12 275,12 300,34" />
                </svg>
              </div>
            </motion.section>
          </div>

          <motion.section
            className={styles.glassCard}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <header className={styles.cardHeader}>
              <Flame size={18} />
              <h2>Compulsion Heatmap & Analytics</h2>
            </header>

            <div className={styles.analyticsRow}>
              <div className={styles.metricCard}>
                <span>Resisted</span>
                <strong>{resistedCount}</strong>
              </div>
              <div className={styles.metricCard}>
                <span>Performed</span>
                <strong>{performedCount}</strong>
              </div>
              <div className={styles.metricCard}>
                <span>Current Streak</span>
                <strong>{streaks.currentStreak}h</strong>
              </div>
              <div className={styles.metricCard}>
                <span>Best Streak</span>
                <strong>{streaks.maxStreak}h</strong>
              </div>
            </div>

            <div className={styles.heatmapLegend}>
              <span><i className={styles.legendResisted} />Resisted</span>
              <span><i className={styles.legendPerformed} />Performed</span>
            </div>

            <div className={styles.heatmapGrid}>
              {HOURS.map((hour) => {
                const value = hourStates[hour];
                return (
                  <button
                    key={hour}
                    className={`${styles.heatCell} ${value === "resisted" ? styles.resisted : ""} ${value === "performed" ? styles.performed : ""}`}
                    onClick={() => toggleHourState(hour)}
                    title={`${String(hour).padStart(2, "0")}:00`}
                  >
                    <span>{hour}</span>
                  </button>
                );
              })}
            </div>
          </motion.section>
        </>
      )}

      <button className={styles.sosFab} onClick={() => setSosOpen(true)} aria-label="Open ACT SOS labeler">
        ACT SOS
      </button>

      <AnimatePresence>
        {sosOpen && (
          <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSosOpen(false)}
          >
            <motion.div
              className={styles.modalCard}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <h3>Intrusive Thought Labeler</h3>
              <p>Create distance by naming the thought, not becoming the thought.</p>
              <textarea
                className={styles.textarea}
                value={intrusiveThought}
                onChange={(event) => setIntrusiveThought(event.target.value)}
                placeholder="Type the intrusive thought here..."
              />
              <div className={styles.modalActions}>
                <button className={styles.primaryButton} onClick={applyLabeler}>Label Thought</button>
                <button className={styles.secondaryButton} onClick={() => setSosOpen(false)}>Close</button>
              </div>
              {labeledThought && <div className={styles.labeledThought}>{labeledThought}</div>}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
