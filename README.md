[![Deploy](https://github.com/rednaw/exhibitionDB/actions/workflows/main.yml/badge.svg)](https://github.com/rednaw/exhibitionDB/actions/workflows/main.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[LightHouse](https://rednaw.github.io/exhibitionDB/lighthouse/report.html)

# ExhibitionDB 

<img src="/images/logo.png" height="300px"/>

## Art exhibitions database

With this app you can create your own art gallery with artworks from various museums.
- [Metropolitan Museum API](https://metmuseum.github.io/)
- [The Art Institute of Chicago API](https://api.artic.edu/docs/)
- [Rijksmuseum API](https://data.rijksmuseum.nl/)

The web app is deployed at https://rednaw.github.io/exhibitionDB/.

## Implementation

The main purpose of this project is to investigate how to build a web application that
- follows the [Jamstack architecture best practices](https://jamstack.org/) (in a nutshell: full CI/CD and no server side database).
- handles a lot (tens of megabytes) of structured data.
- performs very well according to measurement tools like [Lighthouse](https://developers.google.com/web/tools/lighthouse). 

What follows is a diagram of the deployment architecture.

![main-components](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/rednaw/exhibitionDB/main/doc/Architecture.iuml)

## Supporting technologies

What follows is a breakdown of the various technologies and projects on which this project depends ordered by where in the deployment overview they are used.

### The Browser
![main-components](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/rednaw/exhibitionDB/main/doc/User.iuml)
- [Computer Modern](https://www.checkmyworking.com/cm-web-fonts/): Computer Modern is the family of typefaces developed by Donald Knuth for TeX. 
- [Javascript](https://javascript.info/): The only programming language that runs in all browsers.
- [LocalForage](https://localforage.github.io/localForage/): Deal with getting and setting bulk data in the browser offline store.
- [svelte-asyncable](https://github.com/sveltetools/svelte-asyncable): Super tiny, declarative, optimistic, async store for SvelteJS.
- [svelte-simple-modal](https://github.com/flekschas/svelte-simple-modal): A simple, small, and content-agnostic modal for Svelte.
- [svelte-toggle](https://github.com/metonym/svelte-toggle): Accessible toggle switch component for Svelte.
- [sql.js](https://github.com/sql-js/sql.js): A javascript SQL database, it allows creating a relational database and querying it entirely in the browser.
- [Tabulator](http://tabulator.info/): Data visualisation using interactive tables.

### The Content Delivery Network
![main-components](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/rednaw/exhibitionDB/main/doc/Delivery.iuml)
- [GitHub Pages](https://pages.github.com/): Static site hosting service that takes files straight from a repository on GitHub.

### The Build Pipeline
- [GitHub Actions](https://github.com/features/actions): Automate tasks within the software development life cycle.
- [Checkout](https://github.com/marketplace/actions/checkout): GitHub action to check-out the repository so the workflow can access it.
- [github-pages-deploy-action](https://github.com/marketplace/actions/deploy-to-github-pages): GitHub action that pushes generated files to production.
#### Data pipeline
![main-components](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/rednaw/exhibitionDB/main/doc/DataPipeline.iuml) 
- [SQLite](https://www.sqlite.org/): SQLite is a C-language library that implements a small, fast, self-contained SQL database engine. 
- [curl](https://curl.se/): Command line tool and library for transferring data with URLs
- [csv-to-sqlite](https://github.com/zblesk/csv-to-sqlite):  A script that copies CSV files into a SQLite database. 
#### Code pipeline
![main-components](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/rednaw/exhibitionDB/main/doc/DeployPipeline.iuml) 
- [npm](https://www.npmjs.com/): Javascript dependencymanager and script runner.
- [Svelte](https://svelte.dev/): Static Site Generator for reactive user interface.
- [Rollup](https://rollupjs.org/): Bundle generated html, css and javascript to a small number of compressed files.
- [Jekyll](https://jekyllrb.com/): Static Site Generator for Markdown generated documentation HTML.
- [jekyll-action-ts](https://github.com/marketplace/actions/jekyll-action-ts): GH action for running Jekyll.
- [ESLint](https://eslint.org/): Static analysis, detects basic code smells.
- [Lighthouse](https://developers.google.com/web/tools/lighthouse/): Collect runtime performance metrics and insights on developer best practices.
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci): Run asserts against Lighthouse analysis results.

### Automated data sources
![main-components](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/rednaw/exhibitionDB/main/doc/APIs.iuml)
- [Metropolitan Museum API](https://metmuseum.github.io/): Data on artworks in the museum collection.
- [The Art Institute of Chicago API](https://api.artic.edu/docs/): Historical data on art exhibitions held in the museum.
- [Rijksmuseum API](https://data.rijksmuseum.nl/): Data on artworks in the museum collection.

### Version control
![main-components](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/rednaw/exhibitionDB/main/doc/GitHub.iuml) 
- [GitHub](https://github.com/): Version control, this project. Stores code and Filemaker dumps. 
- [Dependabot](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/about-dependabot-version-updates): Automated dependency updates

### Manual data source
![main-components](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/rednaw/exhibitionDB/main/doc/Expert.iuml) 
- [Filemaker](https://www.claris.com/filemaker/pro/): Manual data entry
 
