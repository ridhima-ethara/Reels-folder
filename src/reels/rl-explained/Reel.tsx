// Reel "rl-explained": Reinforcement learning, explained (~45 s).
// Scene cuts and pop-ins are tied to WORDS (t.atText), so a real voiceover later
// (npm run voice + npm run sync) re-times everything automatically.
// Until then public/reels/rl-explained/ holds reading-paced placeholder timings and a silent vo.wav.
import React from "react";
import { brand as myBrand } from "../../brand";
import { Avatar } from "../../avatars/Avatar";
import { useMouth } from "../../avatars/useMouth";
import type { PoseCue } from "../../avatars/SpritePlayer";
import { BigNumber, Card, EndCard, Karaoke, Line, ReelFrame, SceneBlock, Sticker, Title, type ReelProps } from "../../components";
import { AVATAR_BOX, CAPTION_BOTTOM, SAFE, SAFE_BOX } from "../../layout";
import { timing } from "../../timing";
import mouth from "../../../public/reels/rl-explained/mouth.json";
import words from "../../../public/reels/rl-explained/captions.words.json";

export const t = timing(words);
export const AUDIO = "reels/rl-explained/vo.wav";
export const durationInFrames = t.duration();

// Scene cuts on spoken words: [start frame, end frame].
const S = {
  hook: [0, t.atText("That's", 5.1, 0)],
  dog: [t.atText("That's", 5.1, 0), t.atText("Now", 14)],
  loop: [t.atText("Now", 14), t.atText("Then", 20.8)],
  again: [t.atText("Then", 20.8), t.atText("That's", 23.5, 1)],
  alphago: [t.atText("That's", 23.5, 1), t.atText("Here's", 29.3)],
  twist: [t.atText("Here's", 29.3), t.atText("Humans", 33.7)],
  rlhf: [t.atText("Humans", 33.7), t.atText("Want", 38)],
  end: [t.atText("Want", 38), t.duration()],
} as const;

// Sprite avatars only (the flat mascot ignores this).
const poseCues: PoseCue[] = [
  { at: 0, pose: "thinking" },
  { at: 5.1, pose: "explain" },
  { at: 14, pose: "one" },
  { at: 18.2, pose: "two" },
  { at: 20, pose: "three" },
  { at: 23.5, pose: "thumbs-up" },
  { at: 29.3, pose: "finger-up" },
  { at: 33.7, pose: "present" },
  { at: 38, pose: "point-down" },
];

const TOP_TITLE = SAFE.top + 40;

export const Reel: React.FC<ReelProps> = ({ brand = myBrand, avatar = "flat", debugSafeZones, probe }) => {
  const m = useMouth(mouth, words);
  return (
    <ReelFrame brand={brand} audio={AUDIO} debugSafeZones={debugSafeZones} probe={probe}>
      {/* 1. Hook */}
      <SceneBlock name="hook" from={S.hook[0]} to={S.hook[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: TOP_TITLE, width: SAFE_BOX.width }}>
          <Title text="Nobody gave this AI the answers" highlight="the answers" at={0} size={118} />
        </div>
        <Sticker text="no answer key" at={t.atText("answers", 1.8)} rotate={6} style={{ position: "absolute", left: 560, top: 720 }} />
        <Sticker text="trial + error" at={t.atText("trial", 3.7)} rotate={-5} style={{ position: "absolute", left: 440, top: 850 }} />
      </SceneBlock>

      {/* 2. Name it + the dog */}
      <SceneBlock name="dog" from={S.dog[0]} to={S.dog[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: TOP_TITLE, width: SAFE_BOX.width }}>
          <Title text="Reinforcement Learning" highlight="Learning" at={S.dog[0]} size={96} showHandle={false} />
        </div>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 500, width: SAFE_BOX.width }}>
          <Card at={t.atText("Think", 7)}>
            <Line first at={t.atText("Think", 7)}>Like training a dog</Line>
            <Line at={t.atText("sits", 9.3)}>Sits = treat</Line>
            <Line at={t.atText("chews", 11.7)}>Chews shoes = no treat</Line>
          </Card>
        </div>
      </SceneBlock>

      {/* 3. The loop */}
      <SceneBlock name="loop" from={S.loop[0]} to={S.loop[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: TOP_TITLE, width: SAFE_BOX.width }}>
          <Title text="Now the AI is the dog" highlight="the dog" at={S.loop[0]} size={96} showHandle={false} />
        </div>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 500, width: SAFE_BOX.width }}>
          <Card at={t.atText("tries", 16.5)}>
            <Line first at={t.atText("tries", 16.5)}>1 &nbsp;Try a move</Line>
            <Line at={t.atText("reward", 18.2)}>2 &nbsp;Get a reward or a penalty</Line>
            <Line at={t.atText("adjusts", 20)}>3 &nbsp;Adjust</Line>
          </Card>
        </div>
      </SceneBlock>

      {/* 4. Again and again */}
      <SceneBlock name="again" from={S.again[0]} to={S.again[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: TOP_TITLE + 120, width: SAFE_BOX.width }}>
          <Title text="Again, and again." highlight="and again." at={S.again[0]} size={130} showHandle={false} />
        </div>
        <Sticker text="that's the learning" at={t.atText("again", 22.7, 1)} rotate={-6} style={{ position: "absolute", left: 420, top: 720 }} />
      </SceneBlock>

      {/* 5. Proof: AlphaGo */}
      <SceneBlock name="alphago" from={S.alphago[0]} to={S.alphago[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 300, width: SAFE_BOX.width }}>
          <Card at={S.alphago[0]}>
            <Line first at={S.alphago[0]}>AlphaGo vs Lee Sedol</Line>
            <div style={{ height: 36 }} />
            <BigNumber to={4} suffix="–1" at={t.atText("four", 26.5)} countFrames={14} label="games" size={220} tracked={false} />
            <Line at={t.atText("2016", 28.5)}>Seoul, March 2016</Line>
          </Card>
        </div>
      </SceneBlock>

      {/* 6. Twist */}
      <SceneBlock name="twist" from={S.twist[0]} to={S.twist[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: TOP_TITLE, width: SAFE_BOX.width }}>
          <Title text="Plot twist" highlight="twist" at={S.twist[0]} size={130} />
        </div>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 560, width: SAFE_BOX.width }}>
          <Card at={t.atText("ChatGPT", 30.7)}>
            <Line first at={t.atText("ChatGPT", 30.7)}>ChatGPT</Line>
            <Line at={t.atText("trained", 31.5)}>trained partly this way</Line>
          </Card>
        </div>
      </SceneBlock>

      {/* 7. How: RLHF */}
      <SceneBlock name="rlhf" from={S.rlhf[0]} to={S.rlhf[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 300, width: SAFE_BOX.width }}>
          <Card at={S.rlhf[0]}>
            <Line first at={S.rlhf[0]}>Humans rank its answers</Line>
            <Line at={t.atText("rankings", 36)}>Rankings = treats</Line>
          </Card>
        </div>
        <Sticker text="RLHF" at={t.atText("treats", 37.2)} rotate={7} style={{ position: "absolute", left: 700, top: 590 }} />
      </SceneBlock>

      {/* 8. CTA */}
      <SceneBlock name="end" from={S.end[0]} to={S.end[1]}>
        <div style={{ position: "absolute", left: SAFE_BOX.x, top: 300, width: SAFE_BOX.width }}>
          <EndCard keyword="RL" lead="Want my simple RL guide?" sub="I will send it to you" at={S.end[0]} />
        </div>
      </SceneBlock>

      {/* Always on: character + captions */}
      {avatar !== "none" ? (
        <div style={{ position: "absolute", left: AVATAR_BOX.x, top: AVATAR_BOX.y }}>
          <Avatar style={avatar} mouth={m} cues={poseCues} size={AVATAR_BOX.size} />
        </div>
      ) : null}
      <div style={{ position: "absolute", left: SAFE_BOX.x, width: SAFE_BOX.width, bottom: CAPTION_BOTTOM }}>
        <Karaoke words={words} perChunk={4} keywords={["reinforcement", "treats", "AlphaGo", "RL"]} />
      </div>
    </ReelFrame>
  );
};
