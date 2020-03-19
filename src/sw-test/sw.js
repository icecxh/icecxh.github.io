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