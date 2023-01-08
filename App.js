import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Pressable,
  FlatList,
} from 'react-native';
import { episodes, episodesBySeason } from './episodes';

// import axios from 'axios'

// const dataBaseUrl = 'https://spapi.dev/api'

// const getEpisodeByPage = (page) => axios.get(`${dataBaseUrl}/episodes?page=${page}`)
// const getAllEpisodes = async () => {
// 	const response = await axios.get(`${dataBaseUrl}/episodes`)
// 	const { last_page } = response.data.meta
// 	const allRequests = await Promise.all(
// 		new Array(last_page).fill(0).map((_, i) => getEpisodeByPage(i + 1)),
// 	)
// 	const episodes = allRequests.reduce((acc, curr) => [...acc, ...curr.data.data], [])
// 	return episodes
// }

// const [episodes, setEpisodes] = React.useState([])
// const [loading, setLoading] = React.useState(false)

// useEffect(() => {
// 	const fetchData = async () => {
// 		try {
// 			setLoading(true)
// 			const data = await getAllEpisodes()
// 			console.log(JSON.stringify(data))
// 			setEpisodes(data)
// 			setLoading(false)
// 		} catch (error) {
// 			console.log(error)
// 		}
// 	}
// 	fetchData()
// }, [])

export default function App() {
  const [pageMode, setPageMode] = useState('randomizer');
  const [selectedEpisode, setSelectedEpisode] = useState();
  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState();

  if (pageMode === 'randomizer') {
    return (
      <SafeAreaView style={styles.background}>
        <StatusBar style='light' />
        <Image source={require('./assets/homeBackground.png')} style={styles.backgroundImage} />
        <View style={styles.contentBackground}>
          <Text style={styles.randomizeTitle}>Get a random episode!</Text>
          {selectedEpisode && (
            <>
              <Image
                source={{ uri: selectedEpisode.thumbnail_url }}
                style={styles.selectedEpisodeImage}
              />
              <Text style={styles.selectedEpisodeTitle}>
                S{selectedEpisode.season}E{selectedEpisode.episode}: {selectedEpisode.name}
              </Text>
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
          {episodesBySeason.map((_, index) => (
            <Pressable
              style={[
                styles.seasonNumberButton,
                selectedSeasonNumber === index && styles.selectedSeasonNumberButton,
              ]}
              onPress={() => setSelectedSeasonNumber(index)}
            >
              <Text style={styles.seasonNumberButtonText}>{index + 1}</Text>
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
          <View style={styles.episodeWrapper}>
            <Image source={{ uri: item.thumbnail_url }} style={styles.episodeImage} />
            <Text style={styles.episodeName}>
              E{item.episode}: {item.name}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      {/* <ScrollView>
				<View style={styles.container}>
					<StatusBar style='light' />
					<Text style={styles.title}>Welcome to my very cool south park app!</Text>
					{episodesBySeason.map((season, index) => {
						return (
							<View key={season.id}>
								<Text>Season {index}</Text>
								{season.map((episode) => (
									<View key={episode.id} style={styles.episodeWrapper}>
										<Image
											source={{ uri: episode.thumbnail_url }}
											style={styles.episodeImage}
										/>
										<Text style={styles.episodeName}>
											S{episode.season}E{episode.episode}: {
												episode.name}
										</Text>
									</View>
								))}
							</View>
						)
					})}
				</View>
			</ScrollView> */}
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
    marginBottom: 20,
    textAlign: 'center',
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
  seasonsBackButton: {
    position: 'absolute',
    top: -15,
    left: 0,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
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
  episodeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 10,
  },
  episodeImage: {
    width: 75,
    height: 75,
    borderRadius: 5,
  },
  episodeName: {
    marginLeft: 10,
    fontSize: 18,
    color: '#ffffff',
    flexShrink: 1,
  },
});
