import { createContext } from 'react';

/**
 * The native gesture of a horizontal pager that contains taste axes (the
 * Record sheet's swipe-back pager). AxisSlider blocks it with
 * blocksExternalGesture, so the pager waits until the axis gesture has failed:
 * a sideways drag on an axis can never page the sheet. Decided on the UI
 * thread by gesture-handler, not by a JS round trip. Null when there is none.
 */
export const AxisPagerGestureContext = createContext(null);
