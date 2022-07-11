import { View, StyleSheet, FlatList } from 'react-native'
import React, {useState, useEffect} from 'react'
import ProductItem from '../../components/ProductItems';
import { DataStore } from 'aws-amplify';
import { Product } from '../../models';


const HomeScreen = ({searchValue}: {searchValue: string}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
      DataStore.query(Product).then(setProducts);
  }, []);

  return (
    <View style={styles.page}>
     {/* Render Product Componenet */}
        <FlatList 
        data={products}
        renderItem={({item}) => <ProductItem item={item} />}
        showsVerticalScrollIndicator={false}
        />
    </View>
  );
};

const styles = StyleSheet.create({
    page: {
        padding: 10, 
    },
});

export default HomeScreen;