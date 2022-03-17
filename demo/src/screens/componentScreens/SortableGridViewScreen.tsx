import _ from 'lodash';
import React, {useCallback, useState} from 'react';
import {Alert, StyleSheet, ScrollView} from 'react-native';
import {View, SortableGridView, Card, BorderRadiuses} from 'react-native-ui-lib';
import products from '../../data/products';

const styles = StyleSheet.create({
  image: {
    borderRadius: BorderRadiuses.br20
  }
});

const sortableProducts = _.chain(products)
  .map((product, index) => ({
    onPress: () => Alert.alert('My price is ' + product.formattedPrice),
    id: `Product #${index}`,
    imageProps: {source: {uri: product.mediaUrl}, style: styles.image},
    title: `Product #${index}`
    // ...product
  }))
  .value();

const SortableGridViewScreen = () => {
  const [items] = useState(sortableProducts);

  const renderDemoTile = useCallback((item: {onPress: () => void; source: {uri: string}}) => {
    return (
      <Card flex onPress={item.onPress}>
        <Card.Section imageSource={{...item.source}} imageStyle={{height: '100%'}}/>
      </Card>
    );
  }, []);

  const onChange = useCallback((_newItems, newItemsOrder) => {
    console.log('newItemsOrder: ', newItemsOrder);
  }, []);

  return (
    <ScrollView>
      <View flex padding-page>
        <SortableGridView
          items={items}
          onChange={onChange}
          renderItem={renderDemoTile}
          numOfColumns={3}
          // itemSpacing={20}
          // viewWidth={300}
        />
      </View>
    </ScrollView>
  );
};

export default SortableGridViewScreen;
