# Scoreboard

[View here.](https://ligr-scoreboard.now.sh/)

I approached this little project with modularity and ...some... abstraction in mind, so some tradeoffs needed to be met. I also **ran out of time** - not with your four day limit, but with the amount time I actually have, ha!

### Notes

- The order of the `animation` prop is important. I went through some iterations where I didn't rely on the order, but for time I compromised. That's why each `section` makes sure it waits for the "previous" one.
- I've used a listener to listen for css `transition` events - I've used `CSSTransition` a fair bit but wanted to explore something else. Resetting `teamStat.exited` immediately after it resolves to `Deferred` isn't a paradigm I've used much - I can see it exposing you to race conditions but in this very coupled environment, `exited` is being listened to before the transition is complete, always. I don't like it but it's something I'm ok with.
- I'm absolutely not a huge fan of `SASS`, I haven't used it in years (either personally or professionally) and it probably shows. The only reason why I used it here was there's a boatload of similar animations and a `mixin` makes sense for readability. Could it be much better? Probably!
- There's a bunch of bad readability in the prop `animation=[{animation...` it's nesting of the same key. I didn't abstract this, when I probably should have.
- I just eyeballed a bunch of timings for the animation, I had entirely expected revisiting them and making them reflect the video more, but again, I've run out of time.
- If I had more time, I made the props that go into `Scoreboard` dynamic enough to update easily, I wanted to make a UI to do this (change team colors, names, stats etc!).
- I'm also aware I'm missing some attention to detail - like animating the text in slightly after the container (for the team name, stat, clock).

### Requirements

**Provide props for setting the colors of the home and away team elements.**

There's a prop which controls primary and secondary colors, along with wither metadata like name and logo.

**Be able to respond dynamically to changes in the animation prop to show and hide the
specific sections of the graphic at will / gracefully handle changes to the animation prop mid animation.**

No - I honestly ran out of time. So click around slowly, I'd suggest. This disappoints me, more than anyone.

**Animate reliably and performantly**

Sure!
