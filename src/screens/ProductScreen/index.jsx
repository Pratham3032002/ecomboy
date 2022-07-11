import { Text, ScrollView, ActivityIndicatorBase } from 'react-native';
import React, {useState, useEffect} from 'react';
import { DataStore, Auth } from 'aws-amplify';
import { Product, CartProduct } from '../../models';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';

import styles from './styles';
import QuantitySelector from '../../components/QuantitySelector';
import Button from '../../components/Button';
import ImageCarousel from '../../components/ImageCarousel';


const ProductScreen = () => {
    const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

    const [quantity, setQuantity] = useState(1);

    const [product, setProduct] = useState<Product | undefined>(undefined);

    const route = useRoute();
    const navigation = useNavigation();

  useEffect(() => {
    if (!route.params.id) {
      return; //if route.params doesnt exist just return
    }
    DataStore.query(Product, route.params.id).then(setProduct)
  }, [route.params?.id]);

  useEffect(() => {
    if (product?.optoions) {
      setSelectedOption(product.options[0]);
    }
  }, [product])

  const onAddToCart = () => {
    const userData = await Auth.currentAuthenticatedUser();

    if (!product || !userData) {
      return;
    }

    const newCartProduct = new CartProduct({
      userSub: userData.attributes.sub,
      quantity,  //same value as state
      option: selectedOption | null,  //pass the value in the state
      productID: product.id, //same value as state
    });

    await DataStore.save(newCartProduct);
    navigation.navigate('shoppingCart')
  };

  if (!product) {
    return <ActivityIndicator />;
    } //loading screen

  return (
    <ScrollView style={styles.root}>
      <Text styles={styles.title}>{product.title}</Text>

      {/* Image Carousel */}
        <ImageCarousel images={product.images} />

      {/* Option Selector */}
      <Picker
        selectedValue={selectedOption}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}>
          {product.options.map(option => (
          <Picker.Item label={option} value={option}/>
          ))}
      </Picker >

      {/* Price */}
        <Text style={styles.price}>
           from ${product.price.toFixed(2)}
         {product.oldPrice && (<Text style={styles.oldPrice}> ${product.oldPrice.toFixed(2)}</Text>)}
         </Text>

      {/* Description */}
        <Text style={styles.description}>{product.description}</Text>

      {/*Quantity Selctor */}
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

      {/* Button */}
      <Button text={'Add To Cart'} onPress={(onAddToCart) => {console.warn('Add To Cart')}} />
      <Button text={'Buy Now'} onPress={() => {console.warn('Buy now')}} />

    </ScrollView>
  )
}

export default ProductScreen