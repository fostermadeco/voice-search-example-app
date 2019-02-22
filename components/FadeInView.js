import React from 'react';
import { Animated, Text, View } from 'react-native';

class FadeInView extends React.Component {
    state = {
        fadeAnim: new Animated.Value(0),
    }

    componentDidMount() {
        Animated.loop(
            Animated.timing(
                this.state.fadeAnim,
                {
                    toValue: 1,
                    duration: 1400,
                },
            )
        ).start();
    }

    render() {
        let { fadeAnim } = this.state;
        const { children } = this.props;
        return (
            <Animated.View style={{opacity: fadeAnim}}>
                {children}
            </Animated.View>
        )
    }
}

export default FadeInView;
