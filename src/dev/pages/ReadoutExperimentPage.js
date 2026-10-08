// TEMP EXPERIMENT — AxisReadout options for review. Not a component; not committed.
import { StyleSheet, View } from 'react-native';
import Text from '../../components/base/Text';
import AxisSlider from '../../components/base/AxisSlider';
import { color, size, spacing } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';
import Glyph from '../../components/base/Glyph';
import { icon } from '../../theme/tokens';

const TRACK_H = size.meter.track; // 4 — beanFreshness
const MARK = { w: 2, h: 14 }; // beanFreshness todayMarker
const TRACK = color.surface.muted;
const FILL = color.border.medium; // #B3A69E — axis.ghost / axis.delta's colour
const FILL_DARK = color.text.muted; // #6B5D55
const PREV = color.border.muted; // #C8BCB4

function Bar({ value, mode = 'A', marker = true, ticks = false, centre = false, h = TRACK_H, fill = FILL, previous }) {
  const lo = mode === 'A' ? 0 : Math.min(50, value);
  const hi = mode === 'A' ? value : Math.max(50, value);
  const pLo = previous == null ? null : mode === 'A' ? 0 : Math.min(50, previous);
  const pHi = previous == null ? null : mode === 'A' ? previous : Math.max(50, previous);
  return (
    <View style={{ height: MARK.h, justifyContent: 'center' }}>
      <View style={{ height: h, backgroundColor: TRACK }}>
        {previous != null ? <View style={[styles.abs, { left: `${pLo}%`, width: `${pHi - pLo}%`, backgroundColor: PREV }]} /> : null}
        <View style={[styles.abs, { left: `${lo}%`, width: `${hi - lo}%`, backgroundColor: fill }]} />
        {ticks ? [25, 50, 75].map((t) => <View key={t} style={[styles.abs, { left: `${t}%`, width: 1.5, marginLeft: -0.75, backgroundColor: color.surface.raised }]} />) : null}
      </View>
      {centre ? <View style={[styles.mark, { left: '50%', backgroundColor: PREV, height: 8, top: (MARK.h - 8) / 2 }]} /> : null}
      {previous != null ? <View style={[styles.mark, { left: `${previous}%`, backgroundColor: PREV }]} /> : null}
      {marker ? <View style={[styles.mark, { left: `${value}%`, backgroundColor: FILL_DARK }]} /> : null}
    </View>
  );
}

function Row({ label, ...p }) {
  return (
    <View style={{ gap: spacing.gap.tight }}>
      <View style={styles.poles}>
        <Text variant="labelEyebrow" color="muted">Acid</Text>
        <Text variant="labelEyebrow" color="muted">Bitter</Text>
      </View>
      <Bar {...p} />
      {label ? <Text variant="meta" color="muted">{label}</Text> : null}
    </View>
  );
}

const STOPS = [0, 25, 50, 75, 100];
function SliderRail({ border, width, fill, needles }) {
  return (
    <View style={{ gap: spacing.gap.tight, backgroundColor: color.surface.raised, padding: 12, borderWidth: 2, borderColor: color.border.strong }}>
      <View style={styles.poles}>
        <Text variant="labelEyebrow" color="muted">Acid</Text>
        <Text variant="labelEyebrow" color="muted">Bitter</Text>
      </View>
      <View style={{ height: 20, borderWidth: width, borderColor: border, backgroundColor: fill }}>
        {[25, 50, 75].map((t) => <View key={t} style={[styles.abs, { left: `${t}%`, width: 1.5, marginLeft: -0.75, backgroundColor: color.surface.muted }]} />)}
        {needles.map((n, i) => (
          <View key={i} style={{ position: "absolute", left: `${n.at}%`, marginLeft: -6, top: (20 - n.h) / 2 - width, width: 12, height: n.h, backgroundColor: n.bg, borderWidth: n.bw, borderColor: n.bc }} />
        ))}
      </View>
    </View>
  );
}
const N_EMPTY = { h: 30, bg: color.surface.muted, bw: 1.5, bc: color.border.medium };
const N_ENTERED = { h: 32, bg: color.icon.accent, bw: 2, bc: color.border.strong };
const N_LIT_RATING = { h: 32, bg: color.icon.rating, bw: 2, bc: color.border.strong };
const N_LIT_STRONG = { h: 32, bg: color.text.accentStrong, bw: 2, bc: color.border.strong };

/** Rail length / size candidates (2026-10-08). Values in pt; static drawings. */
function Axis2({ railW, railH, handleW, handleH, labelsAtRail, step = 3, from = "Low sweetness", to = "High sweetness" }) {
  const track = railW - handleW;
  const x = handleW / 2 + (step / 4) * track;
  const poles = (
    <View style={[styles.poles, labelsAtRail ? { width: railW, alignSelf: "center" } : null]}>
      <Text variant="labelEyebrow" color="muted">{from}</Text>
      <Text variant="labelEyebrow" color="muted">{to}</Text>
    </View>
  );
  return (
    <View style={{ gap: spacing.gap.row }}>
      {poles}
      <View style={{ width: railW, height: railH, alignSelf: "center", borderWidth: 1.5, borderColor: color.border.muted, backgroundColor: color.surface.ground }}>
        {[1, 2, 3].map((i) => <View key={i} style={{ position: "absolute", top: 0, bottom: 0, width: 1.5, marginLeft: -0.75, left: handleW / 2 - 1.5 + (i / 4) * track, backgroundColor: color.surface.muted }} />)}
        <View style={{ position: "absolute", left: x - handleW / 2 - 1.5, top: (railH - handleH) / 2 - 1.5, width: handleW, height: handleH, backgroundColor: color.icon.accent, borderWidth: 2, borderColor: color.border.strong }} />
      </View>
    </View>
  );
}
function CardBox({ children }) {
  return <View style={{ backgroundColor: color.surface.raised, borderWidth: 2, borderColor: color.border.strong, padding: 16, gap: 20 }}>{children}</View>;
}

export default function ReadoutExperimentPage() {
  return (
    <HarnessPage>
      <HarnessGroup title="R layout — rail 28 tall, handle 16×40">
        <HarnessCase label="now: rail 310 (card width), 74.5/step">
          <CardBox><Axis2 railW={310} railH={20} handleW={12} handleH={32} from="Acid" to="Bitter" /><Axis2 railW={310} railH={20} handleW={12} handleH={32} /></CardBox>
        </HarnessCase>
        <HarnessCase label="L1: rail 220 centred, labels at the rail ends (51/step)">
          <CardBox><Axis2 railW={220} railH={28} handleW={16} handleH={40} labelsAtRail from="Acid" to="Bitter" /><Axis2 railW={220} railH={28} handleW={16} handleH={40} labelsAtRail /></CardBox>
        </HarnessCase>
        <HarnessCase label="L2: rail 220 centred, labels at the card edges (51/step)">
          <CardBox><Axis2 railW={220} railH={28} handleW={16} handleH={40} from="Acid" to="Bitter" /><Axis2 railW={220} railH={28} handleW={16} handleH={40} /></CardBox>
        </HarnessCase>
        <HarnessCase label="L3: rail 240 centred, labels at the rail ends (56/step)">
          <CardBox><Axis2 railW={240} railH={28} handleW={16} handleH={40} labelsAtRail from="Acid" to="Bitter" /><Axis2 railW={240} railH={28} handleW={16} handleH={40} labelsAtRail /></CardBox>
        </HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="H size — rail 240">
        <HarnessCase label="H1: rail 28, handle 16×40">
          <CardBox><Axis2 railW={240} railH={28} handleW={16} handleH={40} labelsAtRail from="Acid" to="Bitter" /></CardBox>
        </HarnessCase>
        <HarnessCase label="H2: rail 32, handle 20×44">
          <CardBox><Axis2 railW={240} railH={32} handleW={20} handleH={44} labelsAtRail from="Acid" to="Bitter" /></CardBox>
        </HarnessCase>
        <HarnessCase label="readout 4pt for contrast"><Row value={75} mode="B" /></HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="D add-slot dashes: ink (now) vs text.muted #6B5D55">
        {[color.border.strong, color.text.muted].map((c) => (
          <HarnessCase key={c} label={c === color.border.strong ? "ink #273D22 (now)" : "#6B5D55 (2 steps lighter)"}>
            <View style={{ backgroundColor: color.surface.raised, padding: 12, gap: 10, borderWidth: 2, borderColor: color.border.strong }}>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <View style={{ paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1.5, borderColor: color.border.accent, backgroundColor: color.badge.bg.accent }}><Text variant="labelCaps" color="accentStrong">Jasmine</Text></View>
                <View style={{ paddingVertical: 14, paddingHorizontal: 16, borderWidth: 1.5, borderColor: color.border.muted }}><Text variant="labelCaps" color="secondary">Cocoa</Text></View>
                <View style={{ paddingVertical: 14, paddingHorizontal: 16, borderWidth: 2, borderStyle: "dashed", borderColor: c }}><Text variant="labelCaps" color="muted">Search</Text></View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 2, borderStyle: "dashed", borderColor: c }}>
                <Glyph name="camera" token={icon.md} color={color.icon.default} /><Text variant="labelCaps" color="primary">Add a photo</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderWidth: 2, borderStyle: "dashed", borderColor: color.border.muted }}>
                <Glyph name="camera" token={icon.md} color={color.icon.muted} /><Text variant="labelCaps" color="secondary">Add a photo (inert)</Text>
              </View>
            </View>
          </HarnessCase>
        ))}
      </HarnessGroup>
      <HarnessGroup title="B rail candidates (needles: empty @50, entered @75)">
        <HarnessCase label="R1 2px ink solid, raised (= entered today)"><SliderRail border={color.border.strong} width={2} fill={color.surface.raised} needles={[{ ...N_EMPTY, at: 50 }, { ...N_ENTERED, at: 75 }]} /></HarnessCase>
        <HarnessCase label="R2 1.5 border.muted solid, ground fill"><SliderRail border={color.border.muted} width={1.5} fill={color.surface.ground} needles={[{ ...N_EMPTY, at: 50 }, { ...N_ENTERED, at: 75 }]} /></HarnessCase>
        <HarnessCase label="R3 1.5 border.medium solid, ground fill"><SliderRail border={color.border.medium} width={1.5} fill={color.surface.ground} needles={[{ ...N_EMPTY, at: 50 }, { ...N_ENTERED, at: 75 }]} /></HarnessCase>
        <HarnessCase label="R4 1.5 border.muted solid, no fill (raised)"><SliderRail border={color.border.muted} width={1.5} fill={color.surface.raised} needles={[{ ...N_EMPTY, at: 50 }, { ...N_ENTERED, at: 75 }]} /></HarnessCase>
        <HarnessCase label="readout (B) for contrast"><Row value={75} mode="B" /></HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="needle while dragging (R3 rail): entered vs lit">
        <HarnessCase label="entered: icon.accent #9E5202"><SliderRail border={color.border.medium} width={1.5} fill={color.surface.ground} needles={[{ ...N_ENTERED, at: 50 }]} /></HarnessCase>
        <HarnessCase label="lit A: icon.rating #C9821A"><SliderRail border={color.border.medium} width={1.5} fill={color.surface.ground} needles={[{ ...N_LIT_RATING, at: 50 }]} /></HarnessCase>
        <HarnessCase label="lit B: text.accentStrong #8A4602"><SliderRail border={color.border.medium} width={1.5} fill={color.surface.ground} needles={[{ ...N_LIT_STRONG, at: 50 }]} /></HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="1 fill origin — value 72 / 28 / 50">
        <HarnessCase label="A: from 0 (72)"><Row value={72} mode="A" /></HarnessCase>
        <HarnessCase label="B: from 50 (72)"><Row value={72} mode="B" /></HarnessCase>
        <HarnessCase label="A: from 0 (28)"><Row value={28} mode="A" /></HarnessCase>
        <HarnessCase label="B: from 50 (28)"><Row value={28} mode="B" /></HarnessCase>
        <HarnessCase label="A: exactly 50"><Row value={50} mode="A" /></HarnessCase>
        <HarnessCase label="B: exactly 50 (no fill, marker only)"><Row value={50} mode="B" /></HarnessCase>
        <HarnessCase label="B: exactly 50, no marker, centre tick"><Row value={50} mode="B" marker={false} centre /></HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="2 marker">
        <HarnessCase label="B, no marker, darker fill (end = value)"><Row value={72} mode="B" marker={false} fill={FILL_DARK} centre /></HarnessCase>
        <HarnessCase label="B, marker + light fill"><Row value={72} mode="B" centre /></HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="3 ticks">
        <HarnessCase label="B with 25/50/75 ticks"><Row value={72} mode="B" ticks centre /></HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="4 height vs the 20pt slider">
        <HarnessCase label="readout 4pt (B)"><Row value={72} mode="B" centre /></HarnessCase>
        <HarnessCase label="AxisSlider (entered) for contrast">
          <AxisSlider from="Acid" to="Bitter" value={72} onChange={() => {}} />
        </HarnessCase>
      </HarnessGroup>
      <HarnessGroup title="6 5c ghost + delta (B) — 44 → 38">
        <HarnessCase label="previous fill lighter, current darker; ghost mark at 44">
          <Row value={38} previous={44} mode="B" centre label="Moved 6 points brighter" />
        </HarnessCase>
        <HarnessCase label="4 points lighter: 56 → 52">
          <Row value={52} previous={56} mode="B" centre label="Moved 4 points lighter" />
        </HarnessCase>
      </HarnessGroup>
    </HarnessPage>
  );
}

const styles = StyleSheet.create({
  abs: { position: 'absolute', top: 0, bottom: 0 },
  mark: { position: 'absolute', width: MARK.w, height: MARK.h, marginLeft: -MARK.w / 2, top: 0 },
  poles: { flexDirection: 'row', justifyContent: 'space-between' },
});
