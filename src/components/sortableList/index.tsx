/* eslint-disable react-hooks/exhaustive-deps */
import {isArray, times} from 'lodash';
import React, {useMemo, useCallback} from 'react';
import {FlatListProps} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import View from '../view';
import SortableListContext from './SortableListContext';
import AnimatedFlatList, {AnimatedFlatListProps} from './AnimatedFlatList';
import SortableListItem from './SortableListItem';
import useListScroll from './useListScroll';
import SortableListItemDecorator from './SortableListItemDecorator';

function getIndices<ItemT>(data: AnimatedFlatListProps<ItemT>['data']) {
  const length = isArray(data) ? data.length : 0;
  return times(length, index => index);
}

export interface SortableListProps<ItemT> extends Omit<AnimatedFlatListProps<ItemT>, 'extraData' | 'data'> {
  /**
   * The data of the list, do not update the data.
   */
  data: FlatListProps<ItemT>['data'];
  /**
   * A callback to get the new order (or swapped items).
   */
  onOrderChange: (data: ItemT[] /* TODO: add more data? */) => void;
  /**
   * Enable scrolling while dragging (experimental, default is false).
   */
  scrollWhileDragging?: boolean;
}

const SortableList = <ItemT extends unknown>(props: SortableListProps<ItemT>) => {
  const {data, onOrderChange, scrollWhileDragging = false, ...others} = props;

  const currentByInitialIndices = useSharedValue<number[]>(getIndices(data));
  const initialByCurrentIndices = useSharedValue<number[]>(getIndices(data));

  const {scrollRef, onDrag, onScroll, cleanScrollValues, measureRef, onLayout, setItemHeight, onContentSizeChange} =
    useListScroll();

  const onDragStateChange = useCallback((index?: number) => {
    if (index === undefined && isArray(data)) {
      cleanScrollValues();
      onOrderChange(times(data.length, index => data[initialByCurrentIndices.value[index]]));
    }
  },
  [cleanScrollValues, onOrderChange]);

  const context = useMemo(() => {
    return {
      currentByInitialIndices,
      initialByCurrentIndices,
      scrollWhileDragging,
      onDragStateChange,
      onDrag,
      setItemHeight
    };
  }, []);

  return (
    <SortableListContext.Provider value={context}>
      {/* @ts-expect-error */}
      <View ref={measureRef} onLayout={onLayout}>
        <AnimatedFlatList
          showsVerticalScrollIndicator={false}
          {...others}
          data={data}
          // @ts-expect-error
          ref={scrollRef}
          onScroll={onScroll}
          onContentSizeChange={onContentSizeChange}
          CellRendererComponent={SortableListItem}
          removeClippedSubviews={false} // Workaround for crashing on Android (ArrayIndexOutOfBoundsException in ViewGroupDrawingOrderHelper.getChildDrawingOrder)
        />
      </View>
    </SortableListContext.Provider>
  );
};

SortableList.SortableListItemDecorator = SortableListItemDecorator;

export default SortableList;