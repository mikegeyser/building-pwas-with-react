# The Demo!

The things I will be doing to convert an React app to a PWA are:
1. Create an app manifest
1. Create an app shell
1. Precache all essential assets
1. Cache any dynamic data returned from the api, including images.
1. Prompt the user to install an updated service worker.
1. Queue failed updates using IndexDb

# 1. App Manifest

Create a `manifest.json` file in the `public/`.

> Snippet: _1

#### public/manifest.json
```json
{
  "short_name": "MemeWrangler",
  "name": "Meme Wrangler 9001",
  "icons": [
    {
      "src": "images/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

> Snippet: _2
#### public/index.html
```html
<link rel="manifest" href="/manifest.json">
```

And then you can see the manifest loaded up in Chrome.

> # Open chrome and show manifest

# 2. App Shell

#### public/index.html
```html
<div id="root">This will only display while the app is loading!</div>
```

Open the `index.html` in Chrome as a file, to show it without the application mounted.

Change the inner html from a simple string to some markup.

> Snippet: _3
```html
<div class="shell">
  <div class="title">loading...</div>
  <div class="meme">&nbsp;</div>
  <div class="meme">&nbsp;</div>
  <div class="meme">&nbsp;</div>
</div>
```

Add some styling to sketch out what the page is going to look like.

> Snippet: _4
```html
<style>
  html,
  body {
    margin: 0;
  }

  .shell .title {
    background-color: #282c34;
    color: #fff;
    text-align: center;
    font: 32px sans-serif;
    height: 2em;
    font-size: 2em;
    padding-top: 0.5em;
    font-weight: bold;
  }

  .shell .meme {
    margin: 0.5em 1em;
    background-color: #e0e0e0;
    min-height: 250px;
  }
</style>
```

Rebuild the solution.

# 3.1. Precache all essential assets

```bash
>> npm install -g workbox-cli
```

We can generate a service worker using `workbox`

```bash
>> workbox wizard
? What is the root of your web app (i.e. which directory do you deploy)? dist/
? Which file types would you like to precache? txt, png, ico, html, js, json, css
? Where would you like your service worker file to be saved? dist/sw.js
? Where would you like to save these configuration options? workbox-config.js
```

Generate the service worker.

```bash
>> workbox generateSW workbox-config.js
```

> # Open the `src/workbox-config.js` and `dist/sw.js` and show the generated code.

A more powerful way to do this is not via config alone, but a template `sw.js`.

> Snippet: _5
#### src/sw.js
```js
importScripts("workbox-v3.6.3/workbox-sw.js");

workbox.setConfig({modulePathPrefix: 'workbox-v3.6.3/'})

const precacheManifest = [];

workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(precacheManifest);
```

Change the config to respect the inject manifest.

> Snippet: _6
#### workbox-config.js
```js
  "swSrc": "src/sw.js",
  "injectionPointRegexp": /(const precacheManifest = )\[\](;)/
```

Install the service worker in the `public/index.html` file.

#### public/index.html

Register the service worker after the app has booted. Check to make sure that this is a production build, and that service worker is actually available. Then, register it.

> Snippet: _7
```js
<script>
  const isProduction = ('%NODE_ENV%' === 'production');

  if (isProduction && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
</script>
```

Then we can build and test it.

```bash
>> yarn build
```
> # new tab

```bash
>> workbox injectManifest workbox-config.js

>> workbox copyLibraries build/

>> http-server build/ -c 0
```

We're going to do this a lot, so best to add it to the `package.json` scripts.

> Snippet: _8
#### package.json
```json
"start-sw": "workbox injectManifest workbox-config.js && workbox copyLibraries build/ &&  http-server dist -c 0"
```

```bash
>> yarn start-sw
```

> # Open Chrome show `sw.js` registration, and the network panel.

Take a look at the Application tab in Chrome dev tools, to see the service worker installed. Switching the network offline will show that the assets are served from cache.

# 4.1. Cache api data

Add a caching route for categories.

> Snippet: _9
#### src/sw.js
```js
const dataCacheConfig = {
    cacheName: 'meme-data'
};

workbox.routing.registerRoute(/.*categories/, workbox.strategies.cacheFirst(dataCacheConfig), 'GET');
```

Open Chrome and verify that the categories are being served from service worker. Check that the categories are being stored in the cache. Show the offline behaviour.

Cache the other routes of interest.

> Snippet: _10
#### src/sw.js
```js
workbox.routing.registerRoute(/.*templates/, workbox.strategies.cacheFirst(dataCacheConfig), 'GET');
workbox.routing.registerRoute(/.*memes\/.\w+/, workbox.strategies.staleWhileRevalidate(dataCacheConfig), 'GET');
    
```

# 4.2. Cache images

Add some simple image caching (before the data caching).
> Snippet:
#### src/sw.js
```js
workbox.routing.registerRoute(
    /.*.(?:png|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'meme-images'
    }), 
    'GET');
```

> # Open Chrome, and update the `sw.js` using skipWaiting. Show network panel, show cache storage. Take app offline.

Open up in Chrome, show the images stored in the cache, and then the storage summary. Take the application offline, and show it working.

# 5. Proper updating for the service worker.

> Snippet: _12
#### src/sw.js
```js
self.addEventListener('install', function(event) {
  self.skipWaiting();
});
```

This will suffice for our current need, but when the service worker updates the page will already have loaded. This means that we will need to reload the page to make full use of the updated service worker.

> Snippet: _13
#### src/sw.js
```js
const channel = new BroadcastChannel('service-worker-channel');
channel.postMessage({ promptToReload: true });
```

> Snippet: _14
#### public/index.html
```js
const channel = new BroadcastChannel('service-worker-channel');
channel.onmessage = (message) => {
  if (message.data.promptToReload) {
    if (confirm('Updates available. Would you like to reload?')) {
      channel.postMessage({ skipWaiting: true });
    };
  }
}
```

> Snippet: _15
#### src/sw.js
```js
channel.onmessage = (message) => {
    if (message.data.skipWaiting) {
        console.log('Skipping waiting and installing service worker.');
        self.skipWaiting();
    }
};
```

> Snippet: _16
#### public/index.html
```js
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload();
});
```

---------------------------------
Back to background sync.
---------------------------------

# 6.1 Offline updates

Workbox has a built in queue mechanism, based off of IndexDB and the background sync api.

> Snippet: _sw6
#### src/sw.js
```js
const queue = new workbox.backgroundSync.Queue('memes-to-be-saved');
```

Can listen to all `fetch` events, that is essentially any http request proxied through service worker. On the event we can opt to filter by url and method, to only deal with the `POST` to the `memes` api.

> Snippet: _sw7
#### src/sw.js
```js
self.addEventListener('fetch', (event) => {
  if (event.request.url.match(/.*memes/) && event.request.method === 'POST') {

  }
});
```

We can then elect to make the call on behalf of the request. We expect that request to fail if the app is offline, so we catch the error and add it to the background sync queue.

> Snippet: _sw8
#### src/sw.js
```js
let response = fetch(event.request.clone());
                .catch((err) => {
                    return queue.addRequest(event.request.clone())
                });

event.respondWith(response);
```

> # Wish it were this simple. Cache invalidation joke.

# 6.2 Offline updates (take 2)

This would work, but means that the rest of the application is ignorant to the updates. We can do better, so that the offline support is transparent.

> Snippet: _sw9
#### src/sw.js
```js
  /*
      1. Submit request
      2. Invalidate cache (if successful)
      3. Queue the change (if failed)
  */
  
  let response = fetch(event.request.clone())
      .then(actualResponse => invalidateCache(event.request.clone(), actualResponse))
      .catch(_ => queueChange(event.request.clone()));
```

> # Everything is a promise.

> Snippet: _sw10
#### src/sw.js
```js
function invalidateCache(request, actualResponse) {
    /*
        1. Read the request data.
        2. Open the cache.
        3. Delete anything that matches the url.
        4. Return the actual response.
     */

    return request.json()
        .then(requestData => {
            const url = `${request.url}/${requestData.category}`;
            
            return caches.open('meme-data')
                .then(cache => cache.delete(url));
        })
        .then(_ => actualResponse);
}
```

> Snippet: _sw11
#### src/sw.js
```js
function queueChange(request) {
    /*
        1. Queue the change.
        2. Read the request data.
        3. Open the cache.
        4. Find the matching response.
        5. Read the cached response.
        6. Create a new response.
        7. Update the cached response.
        8. Return a fake response.
     */

    return queue.addRequest(request.clone())
        .then(_ => request.json())
        .then(requestData => {
            requestData['offline'] = true;
            const url = `${request.url}/${requestData.category}`;

            return caches.open('meme-data')
                .then(cache => {
                    return cache.match(url)
                        .then(cachedResponse => cachedResponse.json())
                        .then(data => {
                            const updatedRequest = [requestData, ...data];

                            const fakeResponse = new Response(
                                JSON.stringify(updatedRequest),
                                { status: 200 });

                            return cache.put(url, fakeResponse.clone())
                                .then(_ => fakeResponse.clone());
                        });
                });
        });
}
```

Force background sync using the Chrome Devtools. 

```
  > workbox-background-sync:memes-to-be-saved
```

