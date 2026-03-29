import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '../../theme/token';

function getColor(isActive) {
  return isActive ? colors.tab.active : colors.brand.lightBlue;
}

export function HomeIcon({ isActive = false }) {
  const fill = getColor(isActive);
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M10 0C10.2471 0 10.4876 0.0788715 10.6826 0.224609L19.5713 6.86816C19.7049 6.968 19.8134 7.09611 19.8877 7.24219C19.962 7.38834 20.0001 7.54925 20 7.71191V18.9326C19.9999 19.2157 19.8831 19.4873 19.6748 19.6875C19.4666 19.8875 19.1841 19.9999 18.8896 20H12.2588V13.0801H7.89453V20H1.11133C0.816825 20 0.534494 19.8875 0.326172 19.6875C0.11785 19.4873 5.85355e-05 19.2157 0 18.9326V7.71191C-0.000106948 7.54925 0.0389593 7.38834 0.113281 7.24219C0.187587 7.09621 0.295229 6.96796 0.428711 6.86816L9.31836 0.224609C9.51327 0.0790437 9.75314 6.50913e-05 10 0Z"
        fill={fill}
      />
    </Svg>
  );
}

export function CoffeeListIcon({ isActive = false }) {
  const fill = getColor(isActive);
  return (
    <Svg width={18} height={20} viewBox="0 0 18 20" fill="none">
      <Path
        d="M2.25 20C1.63125 20 1.10175 19.8043 0.6615 19.413C0.22125 19.0217 0.00075 18.5507 0 18V2C0 1.45 0.2205 0.979333 0.6615 0.588C1.1025 0.196667 1.632 0.000666667 2.25 0H15.75C16.3687 0 16.8986 0.196 17.3396 0.588C17.7806 0.98 18.0007 1.45067 18 2V18C18 18.55 17.7799 19.021 17.3396 19.413C16.8994 19.805 16.3695 20.0007 15.75 20H2.25ZM9 10L12 8L15 10V3H9V10Z"
        fill={fill}
      />
    </Svg>
  );
}

export function CalendarIcon({ isActive = false }) {
  const fill = getColor(isActive);
  const accent = isActive ? '#D4C5E2' : colors.tab.background;
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
      <Path
        d="M0 8H20V18C20 19.1046 19.1046 20 18 20H2C0.895431 20 0 19.1046 0 18V8Z"
        fill={fill}
      />
      <Path
        d="M0 3C0 1.89543 0.895431 1 2 1H18C19.1046 1 20 1.89543 20 3V6H0V3Z"
        fill={fill}
      />
      <Rect x={5} width={2} height={4} fill={accent} />
      <Rect x={13} width={2} height={4} fill={accent} />
    </Svg>
  );
}

export function ProfileIcon({ isActive = false }) {
  const fill = getColor(isActive);
  return (
    <Svg width={20} height={19} viewBox="0 0 20 19" fill="none">
      <Path
        d="M19.8974 18.6201C19.8299 18.7356 19.7327 18.8315 19.6158 18.8982C19.4988 18.9649 19.3661 19 19.231 19H0.768484C0.633516 18.9999 0.500959 18.9647 0.384124 18.8979C0.26729 18.8312 0.17029 18.7352 0.102866 18.6197C0.0354414 18.5042 -3.46252e-05 18.3732 2.53589e-08 18.2399C3.46759e-05 18.1066 0.0355787 17.9756 0.103063 17.8602C1.56757 15.3591 3.82442 13.5658 6.45822 12.7157C5.15542 11.9495 4.14323 10.7822 3.57709 9.39281C3.01094 8.00345 2.92215 6.46893 3.32434 5.02489C3.72653 3.58085 4.59746 2.30715 5.8034 1.39939C7.00934 0.491631 8.48359 0 9.99976 0C11.5159 0 12.9902 0.491631 14.1961 1.39939C15.4021 2.30715 16.273 3.58085 16.6752 5.02489C17.0774 6.46893 16.9886 8.00345 16.4224 9.39281C15.8563 10.7822 14.8441 11.9495 13.5413 12.7157C16.1751 13.5658 18.432 15.3591 19.8965 17.8602C19.9641 17.9756 19.9998 18.1066 20 18.24C20.0002 18.3734 19.9648 18.5044 19.8974 18.6201Z"
        fill={fill}
      />
    </Svg>
  );
}

export function AddCoffeeIcon() {
  return (
    <Svg width={44} height={34} viewBox="0 0 44 34" fill="none">
      <Rect width={44} height={34} rx={10} fill="#D6D3F0" />
      <Rect x={12} y={15} width={20} height={4} fill="#FFFFFF" />
      <Rect
        x={20}
        y={27}
        width={20}
        height={4}
        transform="rotate(-90 20 27)"
        fill="#FFFFFF"
      />
    </Svg>
  );
}
