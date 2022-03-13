/// <reference types="react" />
import { AnimatedFlatListProps } from './AnimatedFlatList';
export interface SortableListProps<ItemT> extends Omit<AnimatedFlatListProps<ItemT>, 'extraData'> {
    /**
     * A callback to get the new order (or swapped items).
     */
    onOrderChange: (data: ItemT[]) => void;
}
declare const SortableList: <ItemT extends unknown>(props: SortableListProps<ItemT>) => JSX.Element;
export default SortableList;
