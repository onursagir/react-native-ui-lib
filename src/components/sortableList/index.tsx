/* eslint-disable react-hooks/exhaustive-deps */
import {map} from 'lodash';
import React, {useMemo, useCallback} from 'react';
import {FlatList, FlatListProps} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import SortableListContext from './SortableListContext';
import SortableListItem from './SortableListItem';

export interface SortableListProps<ItemT> extends Omit<FlatListProps<ItemT>, 'extraData' | 'data'> {
  /**
   * The data of the list, do not update the data.
   */
  data: FlatListProps<ItemT>['data'];
  /**
   * A callback to get the new order (or swapped items).
   */
  onOrderChange: (data: ItemT[] /* TODO: add more data? */) => void;
}

const SortableList = <ItemT extends unknown>(props: SortableListProps<ItemT>) => {
  const {data, onOrderChange, ...others} = props;

  const itemsOrder = useSharedValue<number[]>(map(props.data, (_v, i) => i));
  const itemHeight = useSharedValue<number>(1);

  const onChange = useCallback(() => {
    const newData: ItemT[] = [];
    if (data?.length) {
      itemsOrder.value.forEach(itemIndex => {
        newData.push(data[itemIndex]);
      });
    }

    onOrderChange?.(newData);
  }, [onOrderChange, data]);

  const context = useMemo(() => {
    return {
      itemsOrder,
      onChange,
      itemHeight
    };
  }, []);

  return (
    <SortableListContext.Provider value={context}>
      <FlatList
        {...others}
        data={data}
        CellRendererComponent={SortableListItem}
        removeClippedSubviews={false} // Workaround for crashing on Android (ArrayIndexOutOfBoundsException in ViewGroupDrawingOrderHelper.getChildDrawingOrder)
      />
    </SortableListContext.Provider>
  );
};

export default SortableList;
