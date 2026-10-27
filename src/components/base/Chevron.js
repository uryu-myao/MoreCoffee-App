import { component } from '../../theme/tokens';
import Glyph from './Glyph';

/**
 * The › at the end of a pressable row or block (design-system.md §1 Tap
 * affordance; Design Round 11, C): component.chevron, 16 in text.secondary,
 * the same everywhere. Where it sits is the caller's: centred on a one-line
 * row, on the heading line of a multi-line block.
 *
 * Props: color — only for a state that recolours the whole row (FieldRow's
 * error); otherwise leave it.
 */
export default function Chevron({ color = component.chevron.color }) {
  return <Glyph name="chevronRight" token={component.chevron.icon} color={color} />;
}
