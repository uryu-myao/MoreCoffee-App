// TEMP EXPERIMENT — AxisReadout options for review. Not a component; not committed.
import { StyleSheet, View } from 'react-native';
import Text from '../../components/base/Text';
import AxisSlider from '../../components/base/AxisSlider';
import { color, size, spacing } from '../../theme/tokens';
import { HarnessCase, HarnessGroup, HarnessPage } from '../harness';

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

export default function ReadoutExperimentPage() {
  return (
    <HarnessPage>
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
