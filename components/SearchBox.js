import React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Image,
    Text,
    TextInput,
  } from 'react-native';
import { connectInfiniteHits, connectSearchBox } from 'react-instantsearch-native';

class SearchBox extends React.Component {
    componentDidUpdate(prevProps) {
        if (prevProps.query !== this.props.query) {
            this.refineSearch(this.props.query);
        }
    }

    refineSearch = (text) => {
        this.props.refine(text);
    };

    render() {
        const { query, onChange } = this.props;
        return (
            <TextInput
                style={styles.input}
                onChangeText={text => onChange(text)}
                value={query}
                placeholder={'Search ...'}
                clearButtonMode={'always'}
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize={'none'}
            />
        );
    }
}

const styles = StyleSheet.create({
    input: {
        height: 60,
        borderWidth: 1,
        padding: 10,
        marginVertical: 20,
        borderRadius: 5,
    },
});

export default connectSearchBox(SearchBox);
