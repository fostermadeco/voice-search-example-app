import React from 'react';
import { StyleSheet, View, FlatList, Image, Text } from 'react-native';
import { connectInfiniteHits } from 'react-instantsearch-native';

const Hits = connectInfiniteHits(({ hits, hasMore, refine }) => {
    const onEndReached = function() {
        if (hasMore) {
            refine();
        }
    };

    return (
        <FlatList
            data={hits}
            onEndReached={onEndReached}
            keyExtractor={(item, index) => item.objectID}
            renderItem={({ item }) => {
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, }}>
                        <Image
                            style={{ height: 100, width: 100 }}
                            source={{ uri: item.image }}
                        />
                        <View style={{ flex: 1, marginLeft: 20, }}>
                            <Text>
                                {item.name}
                            </Text>
                            <Text>
                                {item.type}
                            </Text>
                        </View>
                    </View>
                );
            }}
        />
    );
});

export default Hits;
