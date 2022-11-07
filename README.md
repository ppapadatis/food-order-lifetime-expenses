
# food-order-lifetime-expenses

A simple node script that calculates the total amount spent on food ordering services, based in Greece.

## Before you start

At root level, there's a file named `.test.env`. Rename it to just `.env` and replace the values of `*_ACCESS_TOKEN` to your access tokens.

To get a token from each service, visit the required service, login (if not already logged-in), open your browser's dev tools, select Console
and type:
- [e-food](https://www.e-food.gr/): `window.app.userSid`.
- [box](https://box.gr/): `window.localStorage.getItem('Box:token')`
- [wolt](https://wolt.com/): `JSON.parse((Object.fromEntries(document.cookie.split('; ').map(v=>v.split(/=(.*)/s).map(decodeURIComponent)))).__wtoken).accessToken`

## Installation

If you have [nvm](https://github.com/nvm-sh/nvm)/[yvm](https://github.com/tophat/yvm) installed, at root level there are `.nvmrc` and `.yvmrc` files which help install the correct versions of node and yarn.  

If you don't, then advise these files to download and install the correct versions.

```bash
  nvm use && yvm use
  yarn install
```

## Usage

To calculate total expenses, run the following command
```bash
yarn calculate --service=<efood/box/wolt>
```

If for any reason installation failed, run `yarn clean` and start all over again.

## Output

```bash
[{ ... }]

Number of shops: <X>.
Total amount of orders: <Y>.
Period from <YYYY-MM-DD> to <YYYY-MM-DD>.
Total amount spent in <SERVICE> is €<Z>.
```

## Roadmap

- Finish tests
- Prettier format for stats
    - Add more stats
- ~Add more services~

## License

[ISC](https://choosealicense.com/licenses/isc/)

