// eslint-disable-next-line import/no-unresolved
import React from "react";
import PropTypes from "prop-types";
import {
  Animated,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  // eslint-disable-next-line import/no-unresolved
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  PinchGestureHandler,
  PanGestureHandler,
  TouchableWithoutFeedback,
  State,
} from "react-native-gesture-handler";
import crossIcon from "./cross.png";

function Lightbox({
  children,
  caption,
  captionStyle = {},
  onLightboxShowChange,
}) {
  const { top } = useSafeAreaInsets();
  const [isLightboxShowing, setIsLightboxShowing] = React.useState(false);
  const styles = React.useMemo(() =>
    StyleSheet.create(
      {
        modalView: {
          backgroundColor: "black",
          flex: 1,
          justifyContent: "center",
        },
        caption: {
          marginTop: 10,
          color: "white",
          zIndex: -1,
          textAlign: "center",
        },
        fullscreen: {
          flex: 1,
        },
        closeButtonContainer: {
          position: "absolute",
          right: 0,
          top,
          marginRight: 15,
        },
        closeButton: {
          width: 35,
          height: 35,
        },
      },
      [top]
    )
  );

  // Refs for simultaneous handlers
  const panGestureRef = React.useRef(null);
  const pinchGestureRef = React.useRef(null);

  const fadeInOpacity = React.useRef(new Animated.Value(0));

  // Scale
  const baseScale = React.useRef(new Animated.Value(1)).current;
  const pinchScale = React.useRef(new Animated.Value(1)).current;
  const lastScale = React.useRef(1);
  const scale = React.useRef(Animated.multiply(baseScale, pinchScale)).current;

  // XY translation
  const lastOffset = React.useRef({ x: 0, y: 0 });
  const translationX = React.useRef(new Animated.Value(0)).current;
  const translationY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (onLightboxShowChange) {
      onLightboxShowChange(isLightboxShowing);
    }
  }, [isLightboxShowing]);

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    {
      useNativeDriver: true,
    }
  );

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX, translationY } }],
    { useNativeDriver: true }
  );

  function handlePinchStateChange(event) {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      baseScale.setValue(lastScale.current);
      pinchScale.setValue(1);
    }
  }

  function handleTranslationStateChange(event) {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffset.current.x += event.nativeEvent.translationX;
      lastOffset.current.y += event.nativeEvent.translationY;
      translationX.setOffset(lastOffset.current.x);
      translationX.setValue(0);
      translationY.setOffset(lastOffset.current.y);
      translationY.setValue(0);
    }
  }

  function handleOnPress() {
    setIsLightboxShowing(true);
  }

  function handleClose() {
    Animated.parallel([
      Animated.spring(pinchScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(translationX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(translationY, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(fadeInOpacity.current, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished === true) {
        lastScale.current = 1;
        lastOffset.current = { x: 0, y: 0 };
        baseScale.resetAnimation();
        pinchScale.resetAnimation();
        translationX.setOffset(0);
        translationX.setValue(0);
        translationY.setOffset(0);
        translationY.setValue(0);
        setIsLightboxShowing(false);
      }
    });
  }

  function handleShow() {
    Animated.timing(fadeInOpacity.current, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }

  function handleSwipeDown({ nativeEvent: { translationY: tY } }) {
    if (tY > 90) {
      handleClose();
    }
  }

  function handleCloseButtonPress() {
    handleClose();
  }

  return (
    <>
      <Modal visible={isLightboxShowing} onShow={handleShow} transparent>
        <PanGestureHandler onGestureEvent={handleSwipeDown}>
          <Animated.View style={styles.fullscreen}>
            <PanGestureHandler
              ref={panGestureRef}
              simultaneousHandlers={pinchGestureRef}
              onGestureEvent={onGestureEvent}
              onHandlerStateChange={handleTranslationStateChange}
              minPointers={2}
            >
              <Animated.View style={styles.fullscreen}>
                <PinchGestureHandler
                  ref={pinchGestureRef}
                  simultaneousHandlers={panGestureRef}
                  onGestureEvent={onPinchEvent}
                  onHandlerStateChange={handlePinchStateChange}
                >
                  <Animated.View
                    style={{
                      ...styles.modalView,
                      opacity: fadeInOpacity.current,
                    }}
                  >
                    <TouchableOpacity
                      style={styles.closeButtonContainer}
                      onPress={handleCloseButtonPress}
                    >
                      <Image source={crossIcon} style={styles.closeButton} />
                    </TouchableOpacity>
                    <Animated.View
                      style={[
                        {
                          transform: [
                            { scale },
                            {
                              // Ensures the scale of the image doesnt distort
                              // the tracking of the image under your pointer
                              translateX: Animated.divide(translationX, scale),
                            },
                            {
                              translateY: Animated.divide(translationY, scale),
                            },
                          ],
                        },
                      ]}
                    >
                      {children}
                    </Animated.View>
                    {caption ? (
                      <Text style={[styles.caption, captionStyle]}>
                        {caption}
                      </Text>
                    ) : null}
                  </Animated.View>
                </PinchGestureHandler>
              </Animated.View>
            </PanGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </Modal>
      <TouchableWithoutFeedback onPress={handleOnPress}>
        {children}
      </TouchableWithoutFeedback>
    </>
  );
}

Lightbox.defaultProps = {
  caption: undefined,
  captionStyle: {},
  onLightboxShowChange: undefined,
};

Lightbox.propTypes = {
  children: PropTypes.node.isRequired,
  caption: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  captionStyle: PropTypes.object,
  onLightboxShowChange: PropTypes.func,
};

export default Lightbox;
