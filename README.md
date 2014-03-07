# Threes!

This is a copy of the popular iOS game [Threes!](https://itunes.apple.com/us/app/threes!/id779157948?mt=8&ign-mpt=uo%3D2) with HTML, CSS and JavaScript.

It is still under construction but a demo is availbale [here](http://mondaychen.github.io/threes/#playing). The demo is tested on the lastest version of Chrome. You can report bugs in the [issues](https://github.com/mondaychen/threes/issues).

## About the game

The primary goal of the game is to make a number as big as you can before you run out of moves.

Rules:

* 1+2=3
* 3 and bigger numbers merge with itself: 3+3=6, 6+6=12...
* All the movable cards move together.

## Development

Steps before see it locally:

1. install [Node.js](http://nodejs.org/)
2. install [Bower](http://bower.io/) and [Grunt](http://gruntjs.com/): `npm install -g bower && npm install -g grunt-cli`
3. open the dictionary of this repository and run:

```
npm install
bower install
grunt
```

If you want to change any JavaScript or CSS codes, run `grunt watch` in advance to make the changes work.