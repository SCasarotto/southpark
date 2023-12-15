import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Pressable,
  FlatList,
  Linking,
} from 'react-native';
import episodes from './data/episodes.json';
import { images } from './images';

const episodesBySeason = episodes.reduce((acc, episode) => {
  if (!acc[episode.season]) {
    acc[episode.season] = [];
  }
  acc[episode.season].push(episode);
  return acc;
}, {});

const orderedSeasons = Object.keys(episodesBySeason).sort((a, b) => {
  if (a === 'e') {
    return 1;
  }
  if (b === 'e') {
    return -1;
  }
  return a - b;
});

export default function App() {
  const [pageMode, setPageMode] = useState('randomizer');
  const [selectedEpisode, setSelectedEpisode] = useState();
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState();

  const { season, episode, title, airDate, description, seriesEpisode } = selectedEpisode || {};

  if (pageMode === 'randomizer') {
    const seasonNumber = season === 'e' ? images.length - 1 : season - 1;
    return (
      <SafeAreaView style={styles.background}>
        <StatusBar style='light' />
        <Image source={require('./assets/homeBackground.png')} style={styles.backgroundImage} />
        <View style={styles.contentBackground}>
          <Text style={styles.randomizeTitle}>Get a random episode!</Text>
          {selectedEpisode && (
            <>
              <Image
                source={images[seasonNumber][episode - 1]}
                style={styles.selectedEpisodeImage}
              />
              <Text style={styles.selectedEpisodeTitle}>
                S{season}E{episode}: {title}
              </Text>
              <Text style={styles.selectedEpisodeDate}>
                #{seriesEpisode} - {airDate}
              </Text>
              <Text style={styles.selectedEpisodeDescription}>{description}</Text>
              <Pressable
                style={styles.viewEpisodeOnlineButton}
                onPress={async () => {
                  try {
                    const url = selectedEpisode.episodeUrl;
                    // Checking if the link is supported for links with custom URL scheme.
                    const supported = await Linking.canOpenURL(url);

                    if (supported) {
                      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                      // by some browser in the mobile
                      await Linking.openURL(url);
                    } else {
                      Alert.alert(`Don't know how to open this URL: ${url}`);
                    }
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <Text style={styles.viewEpisodeOnlineButtonText}>View Episode Online</Text>
              </Pressable>
            </>
          )}
          <Pressable
            style={styles.randomizeButton}
            onPress={() => {
              setSelectedEpisode(episodes[Math.floor(Math.random() * episodes.length)]);
            }}
          >
            <Text style={styles.randomizeButtonText}>
              {!!selectedEpisode ? 'Give Me Another One Guy!' : 'Random Episode'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.navigateButton}
            onPress={() => {
              setPageMode('seasons');
              setSelectedEpisode(undefined);
            }}
          >
            <Text style={styles.navigateButtonText}>View Seasons</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const seasonNumber = selectedSeasonNumber === 'e' ? images.length - 1 : selectedSeasonNumber - 1;

  return (
    <SafeAreaView style={styles.background}>
      <StatusBar style='light' />
      <Image
        source={require('./assets/homeBackground.png')}
        style={[styles.backgroundImage, styles.backgroundNearlyHidden]}
      />
      <View style={styles.seasonHeader}>
        <Text style={styles.seasonHeaderTitle}>Select a Season</Text>
        <View style={styles.seasonBlockWrapper}>
          {orderedSeasons.map((seasonLabel) => (
            <Pressable
              key={seasonLabel}
              style={[
                styles.seasonNumberButton,
                selectedSeasonNumber === seasonLabel && styles.selectedSeasonNumberButton,
              ]}
              onPress={() => setSelectedSeasonNumber(seasonLabel)}
            >
              <Text style={styles.seasonNumberButtonText}>{seasonLabel}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={styles.seasonsBackButton}
          onPress={() => {
            setPageMode('randomizer');
            setSelectedSeasonNumber(0);
          }}
        >
          <Text style={styles.seasonsBackButtonText}>Back</Text>
        </Pressable>
      </View>
      <FlatList
        style={styles.episodeList}
        data={episodesBySeason[selectedSeasonNumber]}
        renderItem={({ item }) => (
          <Pressable
            style={styles.episodeWrapper}
            onPress={async () => {
              try {
                const url = item.episodeUrl;
                // Checking if the link is supported for links with custom URL scheme.
                const supported = await Linking.canOpenURL(url);

                if (supported) {
                  // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                  // by some browser in the mobile
                  await Linking.openURL(url);
                } else {
                  Alert.alert(`Don't know how to open this URL: ${url}`);
                }
              } catch (e) {
                console.log(e);
              }
            }}
          >
            <Image source={images[seasonNumber][item.episode - 1]} style={styles.episodeImage} />
            <View style={styles.textWrapper}>
              <Text style={styles.episodeName}>
                E{item.episode}: {item.title}
              </Text>
              <Text style={styles.episodeAirDate}>
                #{item.seriesEpisode} - {item.airDate}
              </Text>
              <Text style={styles.episodeDescription}>{item.description}</Text>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.title}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#111111',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    resizeMode: 'cover',
    opacity: 0.5,
  },
  backgroundNearlyHidden: {
    opacity: 0.1,
  },
  contentBackground: {
    padding: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  randomizeTitle: {
    color: '#ffffff',
    fontSize: 20,
    marginBottom: 20,
  },
  selectedEpisodeImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  selectedEpisodeTitle: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: '600',
  },
  selectedEpisodeDate: {
    color: '#ffffff',
    fontSize: 18,
    marginBottom: 5,
    textAlign: 'center',
  },
  selectedEpisodeDescription: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  viewEpisodeOnlineButton: {
    padding: 5,
    marginBottom: 20,
  },
  viewEpisodeOnlineButtonText: {
    color: '#ffffff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  randomizeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
  },
  randomizeButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },
  navigateButton: {
    padding: 14,
    borderRadius: 20,
  },
  navigateButtonText: {
    color: '#ffffff',
    fontSize: 18,
  },

  seasonHeader: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  seasonHeaderTitle: {
    color: '#ffffff',
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  seasonBlockWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  seasonNumberButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    minWidth: 35,
    minHeight: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3,
    borderRadius: 3,
  },
  selectedSeasonNumberButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  seasonNumberButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  seasonsBackButton: ({ pressed }) => ({
    position: 'absolute',
    top: -15,
    left: 0,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: pressed ? 'rgba(255,255,255,0.1)' : 'transparent',
    borderRadius: 20,
  }),
  seasonsBackButtonText: { color: '#ffffff' },
  episodeList: { width: '100%' },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },
  episodeWrapper: ({ pressed }) => ({
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: pressed ? 'rgba(255,255,255,0.1)' : 'transparent',
  }),
  episodeImage: {
    width: 75,
    height: 75,
    borderRadius: 5,
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flexShrink: 1,
  },
  episodeName: {
    marginLeft: 10,
    fontSize: 18,
    color: '#ffffff',
    flexShrink: 1,
    fontWeight: '600',
  },
  episodeAirDate: {
    marginLeft: 10,
    fontSize: 14,
    color: '#ffffff',
  },
  episodeDescription: {
    marginLeft: 10,
    fontSize: 14,
    color: '#ffffff',
  },
});
