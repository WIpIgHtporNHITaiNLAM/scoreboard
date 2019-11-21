import React from 'react';
import Scoreboard from './components/scoreboard';

import styles from './app.module.css';

const data = {
  teams: {
    home: {
      name: 'Kingston City',
      abbreviation: 'KC',
      score: 0,
      logo: 'kingston-city.png',
      colors: {
        primary: '#C8392B',
        secondary: '#FFFFFF'
      },
      stats: [
        {
          type: 'Red Cards',
          value: 0
        }
      ]
    },
    away: {
      name: 'Green Gully',
      abbreviation: 'GG',
      score: 4,
      logo: 'green-gully.png',
      colors: {
        primary: '#FFFFFF',
        secondary: '#254B3A'
      },
      stats: [
        {
          type: 'Red Cards',
          value: 2
        }
      ]
    }
  }
};

export default class App extends React.Component {
  state = {
    animation: []
  };

  triggerAnimation = value => {
    this.setState({
      animation: value
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <Scoreboard
          home={data.teams.home}
          away={data.teams.away}
          animation={this.state.animation}
        />

        <button onClick={() => this.triggerAnimation([])}>default</button>
        <button
          onClick={() =>
            this.triggerAnimation([{ animation: 'main', delay: 0 }])
          }
        >
          main
        </button>
        <button
          onClick={() =>
            this.triggerAnimation([
              { animation: 'main', delay: 0 },
              { animation: 'teamStat', delay: 0.6 }
            ])
          }
        >
          teamStat
        </button>
      </div>
    );
  }
}
