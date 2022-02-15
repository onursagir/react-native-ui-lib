import {Easing} from 'react-native-reanimated';
import {Constants} from 'react-native-ui-lib';
const WINDOW_WIDTH = Constants.windowWidth;
export const MARGIN = 8;
export const getItemSize = (numOfColumns: number) => (WINDOW_WIDTH / numOfColumns); // maybe (- MARGIN)

export const animationConfig = {
  easing: Easing.inOut(Easing.ease),
  duration: 350
};

export const useSortableGridConfig = (numOfColumns: number) => {
  const itemSize = getItemSize(numOfColumns);
  return {
    getPositionByOrder: (order: number) => {
      'worklet';
      return {
        x: (order % numOfColumns) * itemSize,
        y: Math.floor(order / numOfColumns) * itemSize
      };
    },
    getOrderByPosition: (positionX: number, positionY: number) => {
      'worklet';
      const col = Math.round(positionX / itemSize);
      const row = Math.round(positionY / itemSize);
      return row * numOfColumns + col;
    }
  };
};