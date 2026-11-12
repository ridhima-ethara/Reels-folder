// Reel "ml-three-ways": The 3 main ways AI learns (~48 s), Bold Dark motion-graphics format.
// Countdown chapters (01 / 02 / 03) with a progress rail, full-screen animated diagrams, a glitch twist,
// and a comment-quiz ending. No mascot. Pieces live in ./visuals.tsx.
// Every cut and pop is tied to a WORD (t.atText), so a voiceover later (npm run voice + sync) re-times it.
import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PRESETS } from "../../presets";
import { useBrand } from "../../brand-context";
import { Karaoke, ReelFrame, SceneBlock, type ReelProps } from "../../components";
import { CAPTION_BOTTOM, SAFE_BOX } from "../../layout";
import { timing } from "../../timing";
import words from "../../../public/reels/ml-three-ways/captions.words.json";
import {
  AnswerButtons,
  Backdrop,
  ChapterSlam,
  Chip,
  Clusters,
  CommentPrompt,
  GlitchTitle,
  GridWorld,
  Inbox,
  KineticLine,
  PhotoSort,
  ProgressRail,
  TypeTiles,
  useChapterColors,
} from "./visuals";

export const t = timing(words);
export const AUDIO = "reels/ml-three-ways/vo.wav";
export const durationInFrames = t.duration();

const W = {
  one: t.atText("One", 3.3, 0),
  examples: t.atText("examples", 6.1, 0),
  answers: t.atText("answers", 7.2, 0),
  This: t.atText("this", 8.1, 0),
  spam: t.atText("spam", 9.1),
  this2: t.atText("this", 9.6, 1),
  isnt: t.atText("isn't", 10.2),
  soon: t.atText("Soon", 10.9),
  labels: t.atText("labels", 11.5),
  itself: t.atText("itself", 12.9),
  two: t.atText("Two", 13.7, 0),
  no: t.atText("No", 15.7),
  all: t.atText("all", 16.7),
  finds: t.atText("finds", 17.6),
  patterns: t.atText("patterns", 18),
  on: t.atText("on", 18.5),
  its: t.atText("its", 18.8, 0),
  own: t.atText("own", 19.1),
  grouping: t.atText("grouping", 19.9),
  three: t.atText("Three", 22.2, 1),
  trial: t.atText("Trial", 24.2),
  error: t.atText("error", 24.9),
  a: t.atText("A", 25.7, 0),
  reward: t.atText("reward", 25.9),
  when: t.atText("when", 26.3, 0),
  wins: t.atText("wins", 26.9),
  penalty: t.atText("penalty", 27.7),
  fails: t.atText("fails", 28.7),
  alphago: t.atText("AlphaGo", 29.5),
  was: t.atText("was", 29.9),
  trained: t.atText("trained", 30.2),
  this3: t.atText("this", 30.7, 2),
  way: t.atText("way", 31),
  plot: t.atText("Plot", 31.7),
  chatgpt: t.atText("ChatGPT", 32.6),
  used: t.atText("used", 33),
  more: t.atText("more", 33.3),
  than: t.atText("than", 33.7),
  one3: t.atText("one", 34, 2),
  supervised2: t.atText("Supervised", 34.7, 1),
  rewards: t.atText("rewards", 36.6),
  quick: t.atText("Quick", 38.6),
  groups: t.atText("groups", 40.3),
  without: t.atText("without", 42.2),
  is: t.atText("Is", 43.7, 1),
  ansOne: t.atText("one", 44.4, 3),
  ansTwo: t.atText("two", 44.8, 1),
  ansThree: t.atText("three", 45.5, 2),
  comment: t.atText("Comment", 46.3),
};

const S = {
  hook: [0, W.one],
  supIntro: [W.one, W.This],
  supDemo: [W.This, W.two],
  unsIntro: [W.two, W.finds],
  unsDemo: [W.finds, W.three],
  rlIntro: [W.three, W.a],
  rlDemo: [W.a, W.plot],
  twist: [W.plot, W.quick],
  quizQ: [W.quick, W.is],
  quizA: [W.is, t.duration()],
} as const;

const Tinted: React.FC = () => {
  const f = useCurrentFrame();
  const b = useBrand();
  const cols = useChapterColors();
  const tint = f < W.one ? b.colors.accent : f < W.two ? cols[0] : f < W.three ? cols[1] : f < W.plot ? cols[2] : f < W.quick ? b.colors.accent2 : b.colors.accent;
  return <Backdrop tint={tint} />;
};

/** Giant "3" that slams in at frame 0. */
const BigThree: React.FC = () => {
  const b = useBrand();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: f, fps, config: { damping: 11, stiffness: 160 } });
  return (
    <div data-el="hook3" data-kind="content" style={{ position: "absolute", left: SAFE_BOX.x, top: 290, width: SAFE_BOX.width, textAlign: "center", fontFamily: b.fontFamily, fontSize: 560, fontWeight: 700, lineHeight: 0.85, color: b.colors.accent, textShadow: `0 0 80px ${b.colors.accent}88`, transform: `scale(${2.2 - 1.2 * s})`, opacity: interpolate(f, [0, 3], [0.2, 1], { extrapolateRight: "clamp" }) }}>
      3
    </div>
  );
};

const NameTicker: React.FC<{ at: number }> = ({ at }) => {
  const b = useBrand();
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cols = useChapterColors();
  return (
    <div data-el="ticker" data-kind="content" style={{ position: "absolute", left: SAFE_BOX.x, top: 1090, width: SAFE_BOX.width, textAlign: "center", fontFamily: b.fontFamily, fontSize: 58, fontWeight: 700, lineHeight: 1.12 }}>
      {["Supervised", "Unsupervised", "Reinforcement"].map((n, i) => {
        const s = spring({ frame: f - at - i * 3, fps, config: { damping: 13, stiffness: 200 } });
        return (
          <div key={n} style={{ color: cols[i], opacity: interpolate(f - at - i * 3, [0, 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `scale(${0.4 + 0.6 * Math.min(1, s)})` }}>
            {n}
          </div>
        );
      })}
    </div>
  );
};

const Block: React.FC<{ el: string; top: number; children: React.ReactNode }> = ({ el, top, children }) => (
  <div data-el={el} data-kind="content" style={{ position: "absolute", left: SAFE_BOX.x, top, width: SAFE_BOX.width }}>
    {children}
  </div>
);

export const Reel: React.FC<ReelProps> = ({ brand = PRESETS.boldDark, debugSafeZones, probe }) => {
  return (
    <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
      <Inner />
    </ReelFrame>
  );
};

const Inner: React.FC = () => {
  const b = useBrand();
  const cols = useChapterColors();
  return (
    <>
      <Tinted />
      <ProgressRail marks={[W.one, W.two, W.three, W.plot]} labels={["SUPERVISED", "UNSUPERVISED", "REINFORCE"]} />

      {/* Hook */}
      <SceneBlock name="hook" from={S.hook[0]} to={S.hook[1]}>
        <BigThree />
        <Block el="hookline" top={800}>
          <KineticLine
            align="center"
            size={120}
            words={[
              { text: "MAIN", at: t.at(1) },
              { text: "WAYS", at: t.at(2) },
              { text: "AI", at: t.at(3), color: b.colors.accent },
              { text: "LEARNS", at: t.at(4) },
            ]}
          />
        </Block>
        <NameTicker at={t.atText("Let's", 2.3)} />
      </SceneBlock>

      {/* 01 Supervised */}
      <SceneBlock name="sup-intro" from={S.supIntro[0]} to={S.supIntro[1]}>
        <ChapterSlam num="01" name="SUPERVISED" color={cols[0]} at={W.one} chips={[{ text: "examples", at: W.examples }, { text: "+ the answers", at: W.answers }]} />
      </SceneBlock>
      <SceneBlock name="sup-demo" from={S.supDemo[0]} to={S.supDemo[1]}>
        <Inbox at={W.This} color={cols[0]} rows={{ spam: [W.This, W.spam], ok: [W.this2, W.isnt], fresh: [W.soon, W.labels, W.itself] }} />
      </SceneBlock>

      {/* 02 Unsupervised */}
      <SceneBlock name="uns-intro" from={S.unsIntro[0]} to={S.unsIntro[1]}>
        <ChapterSlam num="02" name="UNSUPERVISED" color={cols[1]} at={W.two} chips={[{ text: "no answers", at: W.no }, { text: "no labels", at: W.all }]} />
      </SceneBlock>
      <SceneBlock name="uns-demo" from={S.unsDemo[0]} to={S.unsDemo[1]}>
        <Block el="uns-head" top={340}>
          <KineticLine
            size={84}
            words={[
              { text: "Finds", at: W.finds },
              { text: "patterns", at: W.patterns, color: cols[1] },
              { text: "on", at: W.on },
              { text: "its", at: W.its },
              { text: "own", at: W.own },
            ]}
          />
        </Block>
        <Clusters at={W.finds} gatherAt={W.patterns} haloAt={W.grouping} labels={["Snackers", "Gamers", "Readers"]} />
      </SceneBlock>

      {/* 03 Reinforcement */}
      <SceneBlock name="rl-intro" from={S.rlIntro[0]} to={S.rlIntro[1]}>
        <ChapterSlam num="03" name="REINFORCEMENT" color={cols[2]} at={W.three} chips={[{ text: "trial", at: W.trial }, { text: "+ error", at: W.error }]} />
      </SceneBlock>
      <SceneBlock name="rl-demo" from={S.rlDemo[0]} to={S.rlDemo[1]}>
        <GridWorld
          at={W.a}
          color={cols[2]}
          reward={W.reward}
          penalty={W.penalty}
          goal={W.was}
          path={[
            { at: W.a, cell: [0, 4] },
            { at: W.reward, cell: [1, 4] },
            { at: W.when, cell: [1, 3] },
            { at: W.wins, cell: [2, 3] },
            { at: W.penalty, cell: [2, 2] },
            { at: W.fails, cell: [2, 3] },
            { at: W.fails + 7, cell: [3, 3] },
            { at: W.fails + 14, cell: [3, 2] },
            { at: W.alphago, cell: [4, 2] },
            { at: W.alphago + 7, cell: [4, 1] },
            { at: W.was, cell: [4, 0] },
          ]}
        />
        <Block el="rl-note" top={1300}>
          <div style={{ textAlign: "center" }}>
            <Chip text="AlphaGo was trained this way" at={W.alphago} color={cols[2]} size={38} />
          </div>
        </Block>
      </SceneBlock>

      {/* Twist */}
      <SceneBlock name="twist" from={S.twist[0]} to={S.twist[1]}>
        <Block el="twist-title" top={340}>
          <GlitchTitle text="PLOT TWIST" at={W.plot} size={150} />
        </Block>
        <Block el="twist-line" top={650}>
          <KineticLine
            size={68}
            words={[
              { text: "ChatGPT", at: W.chatgpt, color: b.colors.accent },
              { text: "used", at: W.used },
              { text: "more", at: W.more },
              { text: "than", at: W.than },
              { text: "one", at: W.one3, color: b.colors.accent },
            ]}
          />
        </Block>
        <TypeTiles at={W.used} lit={[W.supervised2, null, W.rewards]} notes={["1st: examples", "", "2nd: rewards"]} />
      </SceneBlock>

      {/* Quiz: question */}
      <SceneBlock name="quiz-q" from={S.quizQ[0]} to={S.quizQ[1]}>
        <Block el="quiz-badge" top={340}>
          <Chip text="QUICK QUIZ" at={W.quick} color={b.colors.accent} filled size={52} />
        </Block>
        <PhotoSort at={W.quick + 6} sortAt={W.groups} tagAt={W.without} />
      </SceneBlock>

      {/* Quiz: answers + comment */}
      <SceneBlock name="quiz-a" from={S.quizA[0]} to={S.quizA[1]}>
        <Block el="quiz-title" top={350}>
          <KineticLine size={80} words={["Which", "type", "is", "it?"].map((w, i) => ({ text: w, at: W.is + i * 3, color: i === 1 ? b.colors.accent : undefined }))} />
        </Block>
        <AnswerButtons ats={[W.ansOne, W.ansTwo, W.ansThree]} />
        <CommentPrompt at={W.comment} />
      </SceneBlock>

      {/* Always on: captions */}
      <div style={{ position: "absolute", left: SAFE_BOX.x, width: SAFE_BOX.width, bottom: CAPTION_BOTTOM }}>
        <Karaoke words={words} perChunk={4} keywords={["supervised", "unsupervised", "reinforcement", "quiz"]} />
      </div>
    </>
  );
};
