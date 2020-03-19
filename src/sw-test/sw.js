// install 事件一般是被用来填充你的浏览器的离线缓存
this.addEventListener('install', function(event) {
  // 这会确保Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成
  event.waitUntil(
    // cache使我们可以存储网络响应发来的资源，并且根据它们的请求来生成key
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/src/sw-test/',
        '/src/sw-test/index.html',
        '/src/sw-test/style.css',
        '/src/sw-test/app.js',
        '/src/sw-test/image-list.js',
        '/src/sw-test/star-wars-logo.jpg',
        // 'gallery/',
        '/src/sw-test/gallery/bountyHunters.jpg',
        '/src/sw-test/gallery/myLittleVader.jpg',
        '/src/sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});


// 你的 service worker 函数像一个代理服务器一样，允许你修改请求和响应，用他们的缓存替代它们等等。
this.addEventListener('fetch', function(event) {
  event.respondWith(
    // magic goes here
    caches.match(event.request).then(function(response) {
      // 命中缓存则直接返回缓存，否则，获取资源并进行缓存
      return response || fetch(event.request).then(function(response) {
        return caches.open('v1').then(function(cache) {
          // 它的响应会被  response.clone() 克隆一份然后被加入缓存，这是因为请求和响应流只能被读取一次。
          // 原始的会返回给浏览器
          cache.put(event.request, response.clone());
          return response;
        });
      });
    }).catch(function() {
      // 缓存不可用，网络不可用
      return caches.match('/src/sw-test/gallery/myLittleVader.jpg');
    })
  );
});

// 如果你的 service worker 已经被安装，但是刷新页面时有一个新版本的可用，新版的 service worker 会在后台安装，但是还没激活。当不再有任何已加载的页面在使用旧版的 service worker 的时候，新版本才会激活
// self.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open('v2').then(function(cache) {
//       return cache.addAll([
//         '/sw-test/',
//         '/sw-test/index.html',
//         '/sw-test/style.css',
//         '/sw-test/app.js',
//         '/sw-test/image-list.js',
        
//         …

//         // include other new resources for the new version...
//       ]);
//     })
//   );
// });

// onactivate 主要用途是清理先前版本的service worker 脚本中使用的资源
// 清除缓存
self.addEventListener('activate', function(event) {
  var cacheWhitelist = ['v1'];

  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});