import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './style.module.scss';

const teamPropType = PropTypes.shape({
  abbreviation: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  logo: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    })
  ).isRequired,
  colors: PropTypes.shape({
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string.isRequired
  }).isRequired
}).isRequired;

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

const animatedStates = {
  main: {
    entered: new Deferred()
  },
  teamStat: {
    exited: new Deferred()
  }
};

export default class Scoreboard extends React.Component {
  static propTypes = {
    home: teamPropType,
    away: teamPropType
  };

  constructor(props) {
    super(props);
    this.clock = React.createRef();
    this.teamStat = React.createRef();
  }

  state = {
    sections: [],
    mainEntered: false,
    teamStatExited: true
  };

  componentDidMount() {
    this.clock.current.addEventListener('transitionend', ({ propertyName }) => {
      if (propertyName === 'transform') {
        if (!this.state.mainEntered) {
          animatedStates.main.entered.resolve();
        } else {
          animatedStates.main.entered = new Deferred();
        }

        this.setState({
          mainEntered: !this.state.mainEntered
        });
      }
    });

    this.teamStat.current.addEventListener(
      'transitionend',
      ({ propertyName }) => {
        if (propertyName === 'transform') {
          if (!this.state.teamStatExited) {
            animatedStates.teamStat.exited.resolve();
          } else {
            animatedStates.teamStat.exited = new Deferred();
          }

          this.setState({
            teamStatExited: !this.state.teamStatExited
          });
        }
      }
    );
  }

  componentWillReceiveProps = async nextProps => {
    for (let index = 0; index < nextProps.animation.length; index++) {
      const { animation, delay } = nextProps.animation[index];

      if (index >= 1) {
        const animatedState =
          animatedStates[nextProps.animation[index - 1].animation];
        await animatedState.entered.promise;
        this.activateSection(animation, delay);
      } else {
        this.activateSection(animation, delay);
      }
    }

    const removedSections = this.props.animation
      .filter(
        ({ animation }) =>
          !nextProps.animation.find(
            nextAnimation => nextAnimation.animation === animation
          )
      )
      .reverse();

    for (let index = 0; index < removedSections.length; index++) {
      const { animation, delay } = removedSections[index];

      if (index >= 1) {
        await animatedStates[removedSections[index - 1].animation].exited
          .promise;
        await this.deactivateSection(animation, delay);
      } else {
        await this.deactivateSection(animation, delay);
      }
    }
  };

  activateSection = (name, delay) => {
    if (this.state.sections.includes(name)) {
      return;
    }

    setTimeout(() => {
      const sections = this.state.sections.slice(name);
      sections.push(name);
      this.setState({ sections });
    }, delay * 1000);
  };

  deactivateSection = (name, delay) =>
    new Promise((resolve, reject) => {
      if (!this.state.sections.includes(name)) {
        resolve();
      }

      this.setState(
        {
          sections: this.state.sections.filter(section => section !== name)
        },
        resolve
      );
    });

  render() {
    const { home, away } = this.props;
    const activeTeam = home;
    const activeStat = home.stats[0];

    return (
      <div
        className={cx(
          styles.container,
          this.state.sections.map(name => styles[`${name}Animate`])
        )}
      >
        <div
          className={cx([styles.teamShortName, styles.home])}
          style={{
            background: home.colors.primary,
            color: home.colors.secondary
          }}
        >
          <span>{home.abbreviation}</span>
        </div>
        <div className={styles.score}>
          <span>
            {home.score}-{away.score}
          </span>
        </div>
        <div
          className={cx([styles.teamShortName, styles.away])}
          style={{
            background: away.colors.primary,
            color: away.colors.secondary
          }}
        >
          <span>{away.abbreviation}</span>
        </div>
        <div className={styles.clock} ref={this.clock}>
          <span>90:00</span>
        </div>
        <div
          className={styles.teamInfo}
          style={{
            background: activeTeam.colors.primary,
            color: activeTeam.colors.secondary
          }}
          ref={this.teamStat}
        >
          <div>
            <img
              src={require(`../../assets/logos/${activeTeam.logo}`)}
              alt={activeTeam.name}
              className={styles.logo}
            />
          </div>
          <div className={styles.teamName}>{activeTeam.name}</div>
        </div>
        <div className={styles.stat}>
          <span className={styles.statName}>{activeStat.type}</span>{' '}
          <span className={styles.count}>{activeStat.value}</span>
        </div>
      </div>
    );
  }
}
